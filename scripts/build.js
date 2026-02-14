const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(__dirname, '../dist');
const SRC_DIR = path.join(__dirname, '../src');

function copyDir(src, dest) {
    if (!fs.existsSync(src)) return;

    if (!fs.existsSync(dest)) {
        fs.mkdirSync(dest, { recursive: true });
    }

    let entries = fs.readdirSync(src, { withFileTypes: true });

    for (let entry of entries) {
        let srcPath = path.join(src, entry.name);
        let destPath = path.join(dest, entry.name);

        if (entry.isDirectory()) {
            copyDir(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    }
}

// 1. Clean Distribution Directory
if (fs.existsSync(DIST_DIR)) {
    fs.rmSync(DIST_DIR, { recursive: true, force: true });
}
fs.mkdirSync(DIST_DIR);
console.log('Cleaned dist/');

// 2. Copy Static Assets
console.log('Copying assets...');
copyDir(path.join(SRC_DIR, 'assets'), path.join(DIST_DIR, 'assets'));
copyDir(path.join(SRC_DIR, 'css'), path.join(DIST_DIR, 'css'));
copyDir(path.join(SRC_DIR, 'js'), path.join(DIST_DIR, 'js'));

// 3. Process HTML Files
console.log('Processing HTML...');
const pagesDir = path.join(SRC_DIR, 'pages');
if (fs.existsSync(pagesDir)) {
    const files = fs.readdirSync(pagesDir);
    files.forEach(file => {
        if (file.endsWith('.html')) {
            let content = fs.readFileSync(path.join(pagesDir, file), 'utf8');

            // Rewrite paths from "../assets" to "assets" for root deployment
            content = content.replace(/\.\.\/css\//g, 'css/');
            content = content.replace(/\.\.\/js\//g, 'js/');
            content = content.replace(/\.\.\/assets\//g, 'assets/');

            fs.writeFileSync(path.join(DIST_DIR, file), content);
            console.log(` - Processed ${file}`);
        }
    });
}

// 4. Copy Root Configuration Files
['sitemap.xml', 'robots.txt', 'vercel.json'].forEach(file => {
    const srcPath = path.join(__dirname, '../', file);
    if (fs.existsSync(srcPath)) {
        fs.copyFileSync(srcPath, path.join(DIST_DIR, file));
        console.log(` - Copied ${file}`);
    }
});

console.log('Build complete! Output in /dist');
