const fs = require('fs');

async function main() {
  const collegesData = [
    'Indian Institute of Technology Delhi', 'Indian Institute of Technology Bombay',
    'Indian Institute of Technology Madras', 'Indian Institute of Technology Kanpur',
    'Indian Institute of Technology Kharagpur', 'BITS Pilani campus',
    'National Institute of Technology Trichy', 'NIT Surathkal',
    'NIT Warangal', 'IIIT Hyderabad', 'VIT Vellore campus',
    'Delhi Technological University', 'Jadavpur University',
    'Thapar Institute of Engineering', 'SRM Institute of Science and Technology',
    'Manipal Institute of Technology', 'RV College of Engineering',
    'College of Engineering Pune', 'Symbiosis Institute of Technology Pune',
    'Lovely Professional University'
  ];

  const results = [];
  for (const c of collegesData) {
    try {
      const url = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent(c)}&gsrnamespace=6&gsrlimit=1&prop=imageinfo&iiprop=url&format=json`;
      const res = await fetch(url, { headers: { 'User-Agent': 'CampusAtlas/1.0 (test@example.com)' } });
      const data = await res.json();
      let imageUrl = null;
      if (data && data.query && data.query.pages) {
        const pages = data.query.pages;
        const pageId = Object.keys(pages)[0];
        if (pages[pageId].imageinfo && pages[pageId].imageinfo.length > 0) {
          imageUrl = pages[pageId].imageinfo[0].url;
        }
      }
      console.log(c, '=>', imageUrl);
      results.push(imageUrl);
    } catch(e) {
      console.log(c, '=>', null);
      results.push(null);
    }
  }
  fs.writeFileSync('images.json', JSON.stringify(results, null, 2));
}

main();
