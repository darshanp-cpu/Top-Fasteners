import fitz
import os

pdf_file = r"c:\Users\darsh\Downloads\Top-Fasteners\src\assets\Premium_Industrial_Hardware.pdf"
output_dir = r"c:\Users\darsh\Downloads\Top-Fasteners\src\assets\extracted_images"

if not os.path.exists(output_dir):
    os.makedirs(output_dir)

doc = fitz.open(pdf_file)

img_count = 0
for page_index in range(len(doc)):
    page = doc.load_page(page_index)
    image_list = page.get_images(full=True)
    
    if image_list:
        print(f"[+] Found {len(image_list)} images on page {page_index + 1}")
    for image_index, img in enumerate(image_list, start=1):
        xref = img[0]
        base_image = doc.extract_image(xref)
        image_bytes = base_image["image"]
        image_ext = base_image["ext"]
        image_name = f"page{page_index+1}_img{image_index}.{image_ext}"
        image_path = os.path.join(output_dir, image_name)
        
        with open(image_path, "wb") as f:
            f.write(image_bytes)
        print(f"    Saved {image_name}")
        img_count += 1
        
print(f"Total images extracted: {img_count}")
