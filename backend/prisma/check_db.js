const prisma = require('../src/prisma');
async function main() {
  const colleges = await prisma.college.findMany();
  console.log(`Total colleges: ${colleges.length}`);
  colleges.forEach(c => console.log(c.id, c.name));
  process.exit(0);
}
main();
