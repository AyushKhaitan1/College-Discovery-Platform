const fs = require('fs');
const path = require('path');
const axios = require('axios');
const sharp = require('sharp');
const prisma = require('../src/prisma');

const collegesData = [
  'Indian Institute of Technology Delhi', 'Indian Institute of Technology Bombay',
  'Indian Institute of Technology Madras', 'Indian Institute of Technology Kanpur',
  'Indian Institute of Technology Kharagpur', 'BITS Pilani',
  'National Institute of Technology Trichy', 'NIT Surathkal',
  'NIT Warangal', 'IIIT Hyderabad', 'VIT Vellore',
  'Delhi Technological University', 'Jadavpur University',
  'Thapar Institute of Engineering and Technology', 'SRM Institute of Science and Technology',
  'Manipal Institute of Technology', 'RV College of Engineering',
  'College of Engineering Pune', 'Symbiosis Institute of Technology',
  'Lovely Professional University'
];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function run() {
  const images = JSON.parse(fs.readFileSync(path.join(__dirname, 'images.json'), 'utf8'));
  const outputDir = path.join(__dirname, '../../frontend/public/colleges');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const localImages = [];

  for (let i = 0; i < images.length; i++) {
    let url = images[i];
    if (!url || url.endsWith('.pdf')) {
      url = 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Symbiosis_International_University_Lavale_campus.jpg';
    }
    
    const filename = `college_${i}.webp`;
    const filepath = path.join(outputDir, filename);
    const localPath = `/colleges/${filename}`;
    
    try {
      if (fs.existsSync(filepath)) {
        console.log(`Skipping ${url}, already downloaded.`);
        localImages.push(localPath);
        continue;
      }
      
      console.log(`Downloading ${url}...`);
      const response = await axios({ url, responseType: 'arraybuffer', headers: { 'User-Agent': 'CampusAtlasBot/1.0 (contact@example.com)' } });
      const buffer = Buffer.from(response.data, 'binary');
      
      await sharp(buffer)
        .resize({ width: 800, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toFile(filepath);
        
      localImages.push(localPath);
      console.log(`Saved optimized image to ${localPath}`);
      await sleep(2000); // Wait 2 seconds to avoid Wikipedia 429
    } catch (e) {
      console.error(`Failed to process image ${i}:`, e.message);
      localImages.push(`/campus_${(i % 10) + 1}.png`); // Fallback to AI images
    }
  }

  fs.writeFileSync(path.join(__dirname, 'local_images.json'), JSON.stringify(localImages, null, 2));

  // Update Database safely without deleting users
  const dbColleges = await prisma.college.findMany();
  for (let i = 0; i < collegesData.length; i++) {
    const collegeName = collegesData[i];
    const dbCollege = dbColleges.find(c => c.name.includes(collegeName) || collegeName.includes(c.name));
    
    if (dbCollege) {
      await prisma.college.update({
        where: { id: dbCollege.id },
        data: { imageUrl: localImages[i] }
      });
      console.log(`Updated DB for ${dbCollege.name}`);
    }
  }
  
  console.log('Finished image optimization and database update successfully!');
}

run();
