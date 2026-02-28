import sys
import fitz

out_file = "c:\\Users\\darsh\\Downloads\\Top-Fasteners\\src\\assets\\pdf_contents_utf8.txt"
with open(out_file, 'w', encoding='utf-8') as f:
    for pdf_path in sys.argv[1:]:
        f.write(f"--- Contents of {pdf_path} ---\n")
        try:
            doc = fitz.open(pdf_path)
            for page in doc:
                text = page.get_text()
                if text:
                    f.write(text + "\n")
        except Exception as e:
            f.write(f"Error reading {pdf_path}: {e}\n")
