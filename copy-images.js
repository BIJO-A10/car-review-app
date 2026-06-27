import fs from 'fs';
import path from 'path';

const srcDir = 'C:\\Users\\TUF\\.gemini\\antigravity\\brain\\af3c6e12-61ff-45d2-b2bf-abe632e359b7';
const destDir = 'C:\\Users\\TUF\\.gemini\\antigravity\\scratch\\car-review-app\\frontend\\public\\images';

// Ensure destDir exists
fs.mkdirSync(destDir, { recursive: true });

const files = fs.readdirSync(srcDir);
const targets = {
  'tesla_model_s': 'tesla_model_s.jpg',
  'porsche_911': 'porsche_911.jpg',
  'ford_mustang': 'ford_mustang.jpg',
  'defender': 'defender.jpg'
};

for (const file of files) {
  for (const [key, destName] of Object.entries(targets)) {
    if (file.startsWith(key) && file.endsWith('.jpg')) {
      const srcPath = path.join(srcDir, file);
      const destPath = path.join(destDir, destName);
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied ${file} to ${destName}`);
    }
  }
}
