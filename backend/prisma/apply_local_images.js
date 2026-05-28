const prisma = require('../src/prisma');

async function run() {
  const colleges = await prisma.college.findMany({ orderBy: { name: 'asc' } });
  const images = ['/campus_1.png', '/campus_2.png', '/campus_3.png', '/campus_4.png', '/campus_5.png'];
  
  for (let i = 0; i < colleges.length; i++) {
    const imageUrl = images[i % images.length];
    await prisma.college.update({
      where: { id: colleges[i].id },
      data: { imageUrl }
    });
  }
  console.log('Successfully updated all colleges to use ultra-fast local AI images!');
}

run();
