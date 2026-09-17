const fs = require('fs');
const css = fs.readFileSync('css/style.css', 'utf8');

const lines = css.split('\n');
lines.forEach((l, idx) => {
  if (l.includes('--color-brand') || l.includes('--color-accent-teal') || l.includes('--color-primary')) {
    console.log(`${idx + 1}: ${l}`);
  }
});
