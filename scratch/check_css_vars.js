const fs = require('fs');
const css = fs.readFileSync('css/style.css', 'utf8');

const matches = css.match(/var\(--[a-zA-Z0-9_-]+\)/g);
const uniqueVars = [...new Set(matches)];

console.log('Unique CSS vars used in style.css:');
uniqueVars.filter(v => v.includes('brand') || v.includes('accent') || v.includes('color')).forEach(v => console.log(v));
