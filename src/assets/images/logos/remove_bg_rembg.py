import os
import glob
from rembg import remove
from PIL import Image

input_dir = r"c:\Users\darsh\Downloads\Top-Fasteners\src\assets\images\logos"

for path in glob.glob(os.path.join(input_dir, "*.png")):
    img = Image.open(path)
    output_img = remove(img)
    output_img.save(path)
    print(f"Processed nicely using rembg: {os.path.basename(path)}")
