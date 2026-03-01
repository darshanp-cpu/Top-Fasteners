import cv2
import numpy as np
import os

logos_dir = r"c:\Users\darsh\Downloads\Top-Fasteners\src\assets\images\logos"

# Re-crop just Repex with tighter centered crop
repex_path = os.path.join(logos_dir, "repex-logo.png")

# Load original from the slide instead since it's more reliable
slide = cv2.imread(r"c:\Users\darsh\Downloads\Top-Fasteners\src\assets\extracted_images\page2_img1.png")
gray = cv2.cvtColor(slide, cv2.COLOR_BGR2GRAY)
_, thresh = cv2.threshold(gray, 240, 255, cv2.THRESH_BINARY)
contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

cards = []
for cnt in contours:
    x, y, w, h = cv2.boundingRect(cnt)
    if w * h > 10000:
        cards.append((x, y, w, h))
cards.sort(key=lambda item: item[0])

if len(cards) >= 5:
    # The 5th card contains Duram, Paintchem, Repex stacked vertically
    c5_x, c5_y, c5_w, c5_h = cards[4]
    c5_roi = slide[c5_y:c5_y+c5_h, c5_x:c5_x+c5_w]

    def tight_crop(roi):
        """Auto-crop to the tightest bounding box of non-white pixels."""
        gray_roi = cv2.cvtColor(roi, cv2.COLOR_BGR2GRAY)
        _, m = cv2.threshold(gray_roi, 240, 255, cv2.THRESH_BINARY_INV)
        pts = cv2.findNonZero(m)
        if pts is None:
            return roi
        rx, ry, rw, rh = cv2.boundingRect(pts)
        pad = 8
        rx = max(0, rx - pad)
        ry = max(0, ry - pad)
        rw = min(roi.shape[1] - rx, rw + pad * 2)
        rh = min(roi.shape[0] - ry, rh + pad * 2)
        return roi[ry:ry+rh, rx:rx+rw]

    h3 = c5_h // 3
    repex_roi = c5_roi[2*h3:, :]
    repex_cropped = tight_crop(repex_roi)
    cv2.imwrite(repex_path, repex_cropped)
    print(f"Saved repex-logo.png: {repex_cropped.shape}")

    # Also re-crop herschell which appeared dark / too small
    herschell_path = os.path.join(logos_dir, "herschell-logo.png")
    herschell_roi = slide[cards[0][1]:cards[0][1]+cards[0][3], cards[0][0]:cards[0][0]+cards[0][2]]
    herschell_cropped = tight_crop(herschell_roi)
    cv2.imwrite(herschell_path, herschell_cropped)
    print(f"Saved herschell-logo.png: {herschell_cropped.shape}")

    for i, (name) in enumerate(["pratley-logo.png", "spanjaard-logo.png"]):
        idx = [3, 2][i]
        cx, cy, cw, ch = cards[idx]
        roi = slide[cy:cy+ch, cx:cx+cw]
        cropped = tight_crop(roi)
        cv2.imwrite(os.path.join(logos_dir, name), cropped)
        print(f"Saved {name}: {cropped.shape}")
