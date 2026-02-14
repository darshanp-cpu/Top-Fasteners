const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const FRAMES_DIR = path.join(__dirname, '../src/assets/frames');

if (!fs.existsSync(FRAMES_DIR)) {
    console.error('Frames directory not found:', FRAMES_DIR);
    process.exit(1);
}

const files = fs.readdirSync(FRAMES_DIR).filter(f => f.endsWith('.gif'));
console.log(`Found ${files.length} GIF frames to convert.`);

(async () => {
    for (const file of files) {
        const inputPath = path.join(FRAMES_DIR, file);
        const outputPath = path.join(FRAMES_DIR, file.replace('.gif', '.webp'));

        try {
            await sharp(inputPath, { animated: false }) // Hero frames are single frame GIFs usually? Or animated? If series, likely single.
                .webp({ quality: 80, effort: 6 })
                .toFile(outputPath);

            fs.unlinkSync(inputPath); // Delete original
            process.stdout.write('.');
        } catch (err) {
            console.error(`Error converting ${file}:`, err);
        }
    }
    console.log('\nConversion complete!');
})();
