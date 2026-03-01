import cv2
import numpy as np
import glob
import os

input_dir = r"c:\Users\darsh\Downloads\Top-Fasteners\src\assets\images\logos"

for path in glob.glob(os.path.join(input_dir, "*.png")):
    img = cv2.imread(path, cv2.IMREAD_UNCHANGED)
    if img is None: continue
    
    # Ensure it's BGRA
    if img.shape[2] == 3:
        img = cv2.cvtColor(img, cv2.COLOR_BGR2BGRA)
        
    b, g, r, a = cv2.split(img)
    
    # Find pure white (or very close)
    # The logos are mostly black/red/blue on a solid white background.
    # Pixels where all channels are > 240
    white_mask = (r > 240) & (g > 240) & (b > 240)
    
    # We want to keep non-white
    keep_mask = ~white_mask
    
    # Convert bool mask to uint8
    alpha_base = keep_mask.astype(np.uint8) * 255
    
    # Soften the edges (anti-aliasing)
    blurred = cv2.GaussianBlur(alpha_base, (3, 3), 0)
    
    final_alpha = np.minimum(a, blurred)
    img[:, :, 3] = final_alpha

    cv2.imwrite(path, img)
    print(f"Processed nicely using CV2 logic: {os.path.basename(path)}")
