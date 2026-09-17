const fs = require('fs');
const css = fs.readFileSync('css/style.css', 'utf8');

const lines = css.split('\n');
console.log('Total lines in style.css:', lines.length);

lines.forEach((l, idx) => {
  if (l.toLowerCase().includes('services') || l.includes('#services') || l.includes('.services-')) {
    console.log(`${idx + 1}: ${l}`);
  }
});
