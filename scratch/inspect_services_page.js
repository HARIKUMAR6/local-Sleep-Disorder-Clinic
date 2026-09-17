const fs = require('fs');
const html = fs.readFileSync('services.html', 'utf8');

const sectionMatches = [...html.matchAll(/<section[\s\S]*?id="([^"]+)"[\s\S]*?>/g)];
console.log('--- SECTIONS IN services.html ---');
sectionMatches.forEach((s, idx) => {
  console.log(`${idx + 1}. #${s[1]}`);
});

const imgMatches = [...html.matchAll(/<img[\s\S]*?src="([^"]+)"[\s\S]*?>/g)];
console.log('\n--- IMAGES IN services.html ---');
imgMatches.forEach((im, idx) => {
  console.log(`${idx + 1}. ${im[1]}`);
});

// Check assets in assets/images/
console.log('\n--- EXISTING ASSETS IN assets/images ---');
const assets = fs.readdirSync('assets/images').filter(f => f.startsWith('services-') || f.includes('service'));
assets.forEach(a => console.log('  ', a));
