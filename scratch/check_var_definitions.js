const fs = require('fs');
const css = fs.readFileSync('css/style.css', 'utf8');

const definedVars = [...css.matchAll(/--([a-zA-Z0-9_-]+):/g)].map(m => '--' + m[1]);
console.log('Defined vars count:', definedVars.length);

['--brand-primary', '--brand-hover', '--color-brand', '--color-accent-teal', '--color-primary'].forEach(v => {
  console.log(`${v} defined?`, definedVars.includes(v));
});
