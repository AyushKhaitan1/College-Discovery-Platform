const { Pool } = require('pg');
const { PrismaPg } = require('@prisma/adapter-pg');
const { PrismaClient } = require('@prisma/client');
require('dotenv').config();

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('Seeding database with updated cutoffs...');
  
  await prisma.answer.deleteMany();
  await prisma.question.deleteMany();
  await prisma.review.deleteMany();
  await prisma.placement.deleteMany();
  await prisma.course.deleteMany();
  await prisma.savedComparison.deleteMany();
  await prisma.college.deleteMany();
  // await prisma.user.deleteMany(); // Keep users

  const collegesData = [
    {
      name: 'Indian Institute of Technology (IIT), Delhi', location: 'New Delhi, Delhi NCR',
      overview: 'IIT Delhi is one of the premier engineering institutes in India.',
      rating: 4.9, averageFees: 220000, acceptedExam: 'JEE Advanced', cutoffRank: 1000,
      courses: { create: [{ name: 'B.Tech in Computer Science', duration: '4 Years', fees: 220000 }] },
      placements: { create: [{ year: 2023, highestPackage: 20000000, averagePackage: 2500000 }] }
    },
    {
      name: 'Indian Institute of Technology (IIT), Bombay', location: 'Mumbai, Maharashtra',
      overview: 'IIT Bombay is globally renowned for its engineering education.',
      rating: 4.9, averageFees: 225000, acceptedExam: 'JEE Advanced', cutoffRank: 500,
      courses: { create: [{ name: 'B.Tech in Computer Science', duration: '4 Years', fees: 225000 }] },
      placements: { create: [{ year: 2023, highestPackage: 36700000, averagePackage: 2600000 }] }
    },
    {
      name: 'Indian Institute of Technology (IIT), Madras', location: 'Chennai, Tamil Nadu',
      overview: 'Consistently ranked #1 in NIRF.',
      rating: 4.9, averageFees: 215000, acceptedExam: 'JEE Advanced', cutoffRank: 1500,
      courses: { create: [{ name: 'B.Tech in Electrical Engineering', duration: '4 Years', fees: 215000 }] },
      placements: { create: [{ year: 2023, highestPackage: 19800000, averagePackage: 2100000 }] }
    },
    {
      name: 'Indian Institute of Technology (IIT), Kanpur', location: 'Kanpur, Uttar Pradesh',
      overview: 'Known for its rigorous curriculum.',
      rating: 4.8, averageFees: 219000, acceptedExam: 'JEE Advanced', cutoffRank: 2000,
      courses: { create: [{ name: 'B.Tech in Aerospace Engineering', duration: '4 Years', fees: 219000 }] },
      placements: { create: [{ year: 2023, highestPackage: 19000000, averagePackage: 2200000 }] }
    },
    {
      name: 'Indian Institute of Technology (IIT), Kharagpur', location: 'Kharagpur, West Bengal',
      overview: 'The first IIT to be established.',
      rating: 4.7, averageFees: 210000, acceptedExam: 'JEE Advanced', cutoffRank: 2500,
      courses: { create: [{ name: 'B.Tech in Civil Engineering', duration: '4 Years', fees: 210000 }] },
      placements: { create: [{ year: 2023, highestPackage: 26000000, averagePackage: 1900000 }] }
    },
    {
      name: 'Birla Institute of Technology and Science (BITS), Pilani', location: 'Pilani, Rajasthan',
      overview: 'BITS Pilani is a highly reputed private engineering college.',
      rating: 4.8, averageFees: 540000, acceptedExam: 'BITSAT', cutoffRank: 1000,
      courses: { create: [{ name: 'B.E. in Computer Science', duration: '4 Years', fees: 540000 }] },
      placements: { create: [{ year: 2023, highestPackage: 6000000, averagePackage: 3000000 }] }
    },
    {
      name: 'National Institute of Technology (NIT), Trichy', location: 'Tiruchirappalli, Tamil Nadu',
      overview: 'Consistently ranked as the top NIT in India.',
      rating: 4.7, averageFees: 150000, acceptedExam: 'JEE Main', cutoffRank: 5000,
      courses: { create: [{ name: 'B.Tech in Computer Science', duration: '4 Years', fees: 150000 }] },
      placements: { create: [{ year: 2023, highestPackage: 5200000, averagePackage: 1200000 }] }
    },
    {
      name: 'National Institute of Technology (NIT), Surathkal', location: 'Mangaluru, Karnataka',
      overview: 'One of the best NITs offering great infrastructure.',
      rating: 4.6, averageFees: 155000, acceptedExam: 'JEE Main', cutoffRank: 7000,
      courses: { create: [{ name: 'B.Tech in Information Technology', duration: '4 Years', fees: 155000 }] },
      placements: { create: [{ year: 2023, highestPackage: 5100000, averagePackage: 1300000 }] }
    },
    {
      name: 'National Institute of Technology (NIT), Warangal', location: 'Warangal, Telangana',
      overview: 'A top-tier NIT with exceptional placements.',
      rating: 4.6, averageFees: 145000, acceptedExam: 'JEE Main', cutoffRank: 8000,
      courses: { create: [{ name: 'B.Tech in Electronics Engineering', duration: '4 Years', fees: 145000 }] },
      placements: { create: [{ year: 2023, highestPackage: 8800000, averagePackage: 1400000 }] }
    },
    {
      name: 'International Institute of Information Technology (IIIT), Hyderabad', location: 'Hyderabad, Telangana',
      overview: 'Known for its outstanding coding culture.',
      rating: 4.8, averageFees: 360000, acceptedExam: 'JEE Main', cutoffRank: 2000,
      courses: { create: [{ name: 'B.Tech in Computer Science', duration: '4 Years', fees: 360000 }] },
      placements: { create: [{ year: 2023, highestPackage: 7400000, averagePackage: 3200000 }] }
    },
    {
      name: 'Vellore Institute of Technology (VIT), Vellore', location: 'Vellore, Tamil Nadu',
      overview: 'VIT offers a diverse range of programs.',
      rating: 4.3, averageFees: 198000, acceptedExam: 'VITEEE', cutoffRank: 20000,
      courses: { create: [{ name: 'B.Tech in Information Technology', duration: '4 Years', fees: 198000 }] },
      placements: { create: [{ year: 2023, highestPackage: 10200000, averagePackage: 900000 }] }
    },
    {
      name: 'Delhi Technological University (DTU)', location: 'New Delhi, Delhi NCR',
      overview: 'DTU offers a rich legacy in engineering education.',
      rating: 4.5, averageFees: 190000, acceptedExam: 'JEE Main', cutoffRank: 10000,
      courses: { create: [{ name: 'B.Tech in Software Engineering', duration: '4 Years', fees: 190000 }] },
      placements: { create: [{ year: 2023, highestPackage: 11000000, averagePackage: 1500000 }] }
    },
    {
      name: 'Jadavpur University', location: 'Kolkata, West Bengal',
      overview: 'A highly reputed state university known for unmatched ROI.',
      rating: 4.6, averageFees: 10000, acceptedExam: 'WBJEE', cutoffRank: 1000,
      courses: { create: [{ name: 'B.Tech in Computer Science', duration: '4 Years', fees: 10000 }] },
      placements: { create: [{ year: 2023, highestPackage: 8500000, averagePackage: 1200000 }] }
    },
    {
      name: 'Thapar Institute of Engineering and Technology', location: 'Patiala, Punjab',
      overview: 'A leading private university in Northern India.',
      rating: 4.3, averageFees: 400000, acceptedExam: 'JEE Main', cutoffRank: 25000,
      courses: { create: [{ name: 'B.E. in Computer Engineering', duration: '4 Years', fees: 400000 }] },
      placements: { create: [{ year: 2023, highestPackage: 5500000, averagePackage: 1100000 }] }
    },
    {
      name: 'SRM Institute of Science and Technology', location: 'Chennai, Tamil Nadu',
      overview: 'A massively popular private university.',
      rating: 4.1, averageFees: 300000, acceptedExam: 'SRMJEEE', cutoffRank: 30000,
      courses: { create: [{ name: 'B.Tech in Computer Science', duration: '4 Years', fees: 300000 }] },
      placements: { create: [{ year: 2023, highestPackage: 10000000, averagePackage: 700000 }] }
    },
    {
      name: 'Manipal Institute of Technology (MIT)', location: 'Manipal, Karnataka',
      overview: 'Famous for its vibrant campus life.',
      rating: 4.4, averageFees: 420000, acceptedExam: 'MET', cutoffRank: 15000,
      courses: { create: [{ name: 'B.Tech in Computer and Communication', duration: '4 Years', fees: 420000 }] },
      placements: { create: [{ year: 2023, highestPackage: 5400000, averagePackage: 1250000 }] }
    },
    {
      name: 'RV College of Engineering', location: 'Bengaluru, Karnataka',
      overview: 'One of the top engineering colleges in Karnataka.',
      rating: 4.5, averageFees: 250000, acceptedExam: 'KCET', cutoffRank: 2000,
      courses: { create: [{ name: 'B.E. in Computer Science', duration: '4 Years', fees: 250000 }] },
      placements: { create: [{ year: 2023, highestPackage: 6200000, averagePackage: 1100000 }] }
    },
    {
      name: 'College of Engineering Pune (COEP)', location: 'Pune, Maharashtra',
      overview: 'One of the oldest and most prestigious engineering colleges in Asia.',
      rating: 4.5, averageFees: 135000, acceptedExam: 'MHT CET', cutoffRank: 1000,
      courses: { create: [{ name: 'B.Tech in Computer Engineering', duration: '4 Years', fees: 135000 }] },
      placements: { create: [{ year: 2023, highestPackage: 5000000, averagePackage: 1150000 }] }
    },
    {
      name: 'Symbiosis Institute of Technology', location: 'Pune, Maharashtra',
      overview: 'A premium private institute focusing on holistic development.',
      rating: 4.0, averageFees: 280000, acceptedExam: 'SITEEE', cutoffRank: 10000,
      courses: { create: [{ name: 'B.Tech in Information Technology', duration: '4 Years', fees: 280000 }] },
      placements: { create: [{ year: 2023, highestPackage: 3500000, averagePackage: 650000 }] }
    },
    {
      name: 'Lovely Professional University (LPU)', location: 'Phagwara, Punjab',
      overview: 'One of the largest private universities in India.',
      rating: 3.9, averageFees: 200000, acceptedExam: 'LPUNEST', cutoffRank: 50000,
      courses: { create: [{ name: 'B.Tech in CSE', duration: '4 Years', fees: 200000 }] },
      placements: { create: [{ year: 2023, highestPackage: 3000000, averagePackage: 550000 }] }
    }
  ];

  const fs = require('fs');
  const path = require('path');
  const images = JSON.parse(fs.readFileSync(path.join(__dirname, 'images.json'), 'utf8'));

  for (let i = 0; i < collegesData.length; i++) {
    const collegeData = collegesData[i];
    let img = images[i];
    // Fallback if image is a PDF or null
    if (!img || img.endsWith('.pdf')) {
      img = 'https://upload.wikimedia.org/wikipedia/commons/e/e4/Symbiosis_International_University_Lavale_campus.jpg';
    }
    collegeData.imageUrl = img;
    await prisma.college.create({
      data: collegeData,
    });
  }

  console.log('Database seeded successfully with cutoffs!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
