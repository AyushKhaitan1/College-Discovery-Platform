const axios = require('axios');
const fs = require('fs');
const path = require('path');
const sharp = require('sharp');
const prisma = require('../src/prisma');

async function run() {
  const outputDir = path.join(__dirname, '../../frontend/public/colleges');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Fetch 20 unique generic university building images from Wikimedia
  const searchUrl = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=university+building+exterior&gsrnamespace=6&gsrlimit=20&prop=imageinfo&iiprop=url&format=json`;
  
  const res = await axios.get(searchUrl, { headers: { 'User-Agent': 'CampusAtlas/1.0' } });
  const pages = res.data.query.pages;
  const imageUrls = [];
  
  for (const pageId in pages) {
    if (pages[pageId].imageinfo && pages[pageId].imageinfo.length > 0) {
      imageUrls.push(pages[pageId].imageinfo[0].url);
    }
  }

  console.log(`Found ${imageUrls.length} images.`);

  const localImages = [];
  for (let i = 0; i < imageUrls.length; i++) {
    const url = imageUrls[i];
    const filename = `unique_campus_${i}.webp`;
    const filepath = path.join(outputDir, filename);
    const localPath = `/colleges/${filename}`;
    
    try {
      console.log(`Downloading ${url}...`);
      const response = await axios({ url, responseType: 'arraybuffer', headers: { 'User-Agent': 'CampusAtlasBot/1.0' } });
      const buffer = Buffer.from(response.data, 'binary');
      
      await sharp(buffer)
        .resize({ width: 800, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(filepath);
        
      localImages.push(localPath);
    } catch (e) {
      console.log(`Failed to process ${url}`);
    }
  }

  // Now assign them to the colleges in DB
  const colleges = await prisma.college.findMany({ orderBy: { name: 'asc' } });
  for (let i = 0; i < colleges.length; i++) {
    // If we have enough unique images, use them. Otherwise fallback.
    const img = localImages[i % localImages.length] || '/campus_1.png';
    await prisma.college.update({
      where: { id: colleges[i].id },
      data: { imageUrl: img }
    });
    console.log(`Updated ${colleges[i].name} with ${img}`);
  }
  
  console.log('Finished assigning 20 unique images!');
}

run();
