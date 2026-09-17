const fs = require('fs');

const style = fs.readFileSync('css/style.css', 'utf8');
const motion = fs.readFileSync('css/motion.css', 'utf8');

function search(css, name) {
  console.log(`=== SEARCHING IN ${name} ===`);
  const lines = css.split('\n');
  lines.forEach((line, idx) => {
    if (line.includes('care-feel') || line.includes('approach-') || (line.includes('about-page') && line.includes('hover'))) {
      console.log(`${idx + 1}: ${line}`);
    }
  });
}

search(style, 'style.css');
search(motion, 'motion.css');
