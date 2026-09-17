const fs = require('fs');
const html = fs.readFileSync('services.html', 'utf8');

const s1 = html.slice(html.indexOf('id="services-hero"'), html.indexOf('id="services-pathways"'));
console.log('=== SECTION 1 (HERO) ===\n', s1.slice(0, 500), '...\n');

const s2 = html.slice(html.indexOf('id="services-pathways"'), html.indexOf('id="services-journey"'));
console.log('=== SECTION 2 (PATHWAYS) ===\n', s2.slice(0, 600), '...\n');

const s3 = html.slice(html.indexOf('id="services-journey"'), html.indexOf('id="services-philosophy"'));
console.log('=== SECTION 3 (JOURNEY) ===\n', s3.slice(0, 600), '...\n');

const s4 = html.slice(html.indexOf('id="services-philosophy"'), html.indexOf('id="services-cta"'));
console.log('=== SECTION 4 (BEYOND / PHILOSOPHY) ===\n', s4.slice(0, 600), '...\n');

const s5 = html.slice(html.indexOf('id="services-cta"'), html.indexOf('</main>'));
console.log('=== SECTION 5 (CTA) ===\n', s5.slice(0, 600), '...\n');
