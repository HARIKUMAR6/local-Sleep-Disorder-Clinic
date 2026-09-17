const fs = require('fs');
const html = fs.readFileSync('about.html', 'utf8');

const s2 = html.slice(html.indexOf('id="about-approach"'), html.indexOf('id="about-philosophy"'));
console.log('=== SECTION 2 APPROACH PRINCIPLE ITEMS HTML ===');
console.log(s2);

const s4 = html.slice(html.indexOf('id="about-experience"'), html.indexOf('id="about-cta"'));
console.log('=== SECTION 4 CARE FEEL CARDS HTML ===');
console.log(s4);
