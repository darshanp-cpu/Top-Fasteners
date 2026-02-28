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
    
    # Euclidean distance from white
    dist = np.sqrt((255 - r.astype(float))**2 + (255 - g.astype(float))**2 + (255 - b.astype(float))**2)
    
    # Pixels extremely close to white will fade out
    # Dist < 20 -> alpha 0
    # Dist > 80 -> alpha original
    
    new_alpha = np.clip((dist - 20) * (255.0 / 60.0), 0, 255).astype(np.uint8)
    
    # Merge existing alpha conditionally
    final_alpha = np.minimum(a, new_alpha)
    
    img[:, :, 3] = final_alpha

    cv2.imwrite(path, img)
    print(f"Processed: {os.path.basename(path)}")
