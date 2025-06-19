const fs = require('fs');
const path = require('path');

const foldersToRemove = [
  'node_modules',
  'dist',
  '.nx',
  '.idea',
  '.angular',
  'pnpm-lock.yaml',
  'stats.html',
];

foldersToRemove.forEach((folder) => {
  const fullPath = path.join(process.cwd(), folder);

  if (fs.existsSync(fullPath)) {
    fs.rm(fullPath, { recursive: true, force: true }, (err) => {
      if (err) {
        console.error(`❌ Error removing ${folder}:`, err);
      } else {
        console.log(`✅ Removed: ${folder}`);
      }
    });
  } else {
    console.log(`⚠️ Folder not found: ${folder}`);
  }
});

console.log('✅ Clean up complete!');
