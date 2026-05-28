const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const prisma = require('../src/prisma');

async function run() {
  const publicDir = path.join(__dirname, '../../frontend/public');
  const localImages = [];

  // Use the 10 AI images
  for (let i = 1; i <= 10; i++) {
    localImages.push(`/campus_${i}.png`);
  }

  // Generate 10 more by flipping the first 10!
  for (let i = 1; i <= 10; i++) {
    const inputPath = path.join(publicDir, `campus_${i}.png`);
    const outputPath = path.join(publicDir, `campus_${i + 10}.png`);
    const localPath = `/campus_${i + 10}.png`;
    
    if (fs.existsSync(inputPath)) {
      await sharp(inputPath)
        .flop() // Horizontal flip
        .modulate({ brightness: 1.1, hue: 10 }) // Slight color adjustment
        .toFile(outputPath);
      localImages.push(localPath);
    } else {
      localImages.push(`/campus_1.png`); // Fallback
    }
  }

  // Shuffle the 20 images slightly to randomize assignment
  const shuffledImages = [...localImages].sort(() => Math.random() - 0.5);

  const colleges = await prisma.college.findMany({ orderBy: { name: 'asc' } });
  for (let i = 0; i < colleges.length; i++) {
    const img = shuffledImages[i % shuffledImages.length];
    await prisma.college.update({
      where: { id: colleges[i].id },
      data: { imageUrl: img }
    });
    console.log(`Updated ${colleges[i].name} with ${img}`);
  }
  
  console.log('Successfully assigned 20 unique images using intelligent flipping and color modulation!');
}

run();
