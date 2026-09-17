const fs = require('fs');
const html = fs.readFileSync('about.html', 'utf8');

// Match sections in about.html
const sectionRegex = /<section[\s\S]*?<\/section>/g;
let secMatch;
let secIdx = 1;

while ((secMatch = sectionRegex.exec(html)) !== null) {
  const secContent = secMatch[0];
  const idMatch = secContent.match(/id="([^"]+)"/);
  const secId = idMatch ? idMatch[1] : `Section ${secIdx}`;
  
  console.log(`\n=== SECTION: ${secId} ===`);
  const iMatches = [...secContent.matchAll(/<i[^>]*class="([^"]*)"[^>]*>/g)];
  console.log(`Found ${iMatches.length} <i> tags in ${secId}:`);
  iMatches.forEach((m) => {
    console.log(`  - ${m[0]}`);
  });
}
