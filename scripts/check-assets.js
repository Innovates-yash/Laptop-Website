const fs = require('fs');
const path = require('path');

const requiredAssets = {
  models: [
    'laptop-1.glb',
    'laptop-2.glb',
    'laptop-3.glb',
    'laptop-4.glb'
  ],
  hdri: [
    'studio_kontrast_04_4k.hdr',
    'newman_lobby_4k.hdr',
    'cedar_bridge_sunset_1_4k.hdr'
  ],
  images: [
    'ionela-mat-2WxnKStKQTs-unsplash.jpg',
    'kyle-sung-0Qur_XBjOMY-unsplash.jpg',
    'leap-design-rXGzpEeYAS0-unsplash.jpg',
    'muneeb-ali-arshad-FpedyKWiHY-unsplash.jpg'
  ]
};

console.log('\n🔍 Checking for required assets...\n');

let allFound = true;

// Check models
console.log('📦 3D Models (/public/models/):');
requiredAssets.models.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, '../public/models', file));
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFound = false;
});

// Check HDRI
console.log('\n💡 HDRI Files (/public/hdri/):');
requiredAssets.hdri.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, '../public/hdri', file));
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFound = false;
});

// Check images
console.log('\n🖼️  Product Images (/public/images/products/):');
requiredAssets.images.forEach(file => {
  const exists = fs.existsSync(path.join(__dirname, '../public/images/products', file));
  console.log(`  ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFound = false;
});

// Check videos (optional)
console.log('\n🎬 Videos (/public/videos/) [Optional]:');
const videosDir = path.join(__dirname, '../public/videos');
if (fs.existsSync(videosDir)) {
  const videos = fs.readdirSync(videosDir).filter(f => f.endsWith('.mp4'));
  if (videos.length > 0) {
    videos.forEach(v => console.log(`  ✅ ${v}`));
  } else {
    console.log('  ℹ️  No video files found (will use gradient background)');
  }
} else {
  console.log('  ℹ️  No videos folder (will use gradient background)');
}

console.log('\n' + '='.repeat(60));
if (allFound) {
  console.log('✅ All required assets found! Ready to build.');
} else {
  console.log('❌ Some assets are missing. Please add them before continuing.');
  console.log('\nSee /public/ASSETS_REQUIRED.md for details.');
  process.exit(1);
}
console.log('='.repeat(60) + '\n');
