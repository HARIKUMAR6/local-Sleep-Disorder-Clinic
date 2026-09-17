const fs = require('fs');
const html = fs.readFileSync('about.html', 'utf8');

const s1 = html.slice(html.indexOf('id="about-hero"'), html.indexOf('id="about-approach"'));
console.log('=== SECTION 1 HERO HTML ===');
console.log(s1);
