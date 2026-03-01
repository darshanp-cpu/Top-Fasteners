"""
Strategy: The logos are embedded in white rounded-rectangle cards on the PDF slide.
We need to find the actual logo artwork INSIDE each card, not just the card boundary.
We do this by:
1. Loading each already-cropped logo image
2. Finding the inner non-card content by looking for the darkest/most colorful regions
   (the actual logo pixels), not just non-white pixels.
3. Using a connected components approach to find the main content cluster.
"""
import cv2
import numpy as np
import os

logos_dir = r"c:\Users\darsh\Downloads\Top-Fasteners\src\assets\images\logos"
targets = [
    "pratley-logo.png",
    "herschell-logo.png",
    "spanjaard-logo.png",
    "glue-devil-logo.png",
]

for name in targets:
    path = os.path.join(logos_dir, name)
    img = cv2.imread(path)
    if img is None:
        print(f"Not found: {name}")
        continue

    h, w = img.shape[:2]

    # Convert to HSV to detect colorful or dark (non-white, non-light-gray) pixels
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    # Pixels that are SATURATED (colorful) OR very dark (dark logos like Herschell)
    sat_mask = hsv[:, :, 1] > 30          # colorful pixels
    dark_mask = hsv[:, :, 2] < 80         # very dark pixels (Herschell dark oval)
    mid_dark_mask = hsv[:, :, 2] < 160    # medium dark (Spanjaard text)

    content_mask = (sat_mask | dark_mask | mid_dark_mask).astype(np.uint8) * 255

    # Dilate to connect nearby logo elements
    kernel = np.ones((7, 7), np.uint8)
    content_mask = cv2.dilate(content_mask, kernel, iterations=2)
    content_mask = cv2.erode(content_mask, kernel, iterations=1)

    pts = cv2.findNonZero(content_mask)
    if pts is None:
        print(f"No colorful/dark content found in {name}")
        continue

    x, y, bw, bh = cv2.boundingRect(pts)

    # Add 5% padding
    pad_x = int(bw * 0.05) + 3
    pad_y = int(bh * 0.05) + 3
    x = max(0, x - pad_x)
    y = max(0, y - pad_y)
    bw = min(w - x, bw + pad_x * 2)
    bh = min(h - y, bh + pad_y * 2)

    cropped = img[y:y+bh, x:x+bw]
    cv2.imwrite(path, cropped)
    print(f"Cropped {name}: ({w}x{h}) -> ({cropped.shape[1]}x{cropped.shape[0]})")
