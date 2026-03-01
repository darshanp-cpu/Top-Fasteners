import urllib.request
import os

domains = {
    "tolsen-logo.png": "https://logo.clearbit.com/tolsentools.com",
    "lukas-logo.png": "https://logo.clearbit.com/lukas-erzett.com",
    "unidelta-logo.png": "https://logo.clearbit.com/unidelta.com"
}

output_dir = r"c:\Users\darsh\Downloads\Top-Fasteners\src\assets\images\logos"

for name, url in domains.items():
    path = os.path.join(output_dir, name)
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        with urllib.request.urlopen(req) as response, open(path, 'wb') as out_file:
            data = response.read()
            out_file.write(data)
        print(f"Downloaded {name}")
    except Exception as e:
        print(f"Failed to download {name}: {e}")
