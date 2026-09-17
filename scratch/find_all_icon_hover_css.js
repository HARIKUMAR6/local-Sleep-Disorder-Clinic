const fs = require('fs');

const style = fs.readFileSync('css/style.css', 'utf8');
const motion = fs.readFileSync('css/motion.css', 'utf8');

function checkHover(css, name) {
  console.log(`=== CHECKING HOVER RULES IN ${name} ===`);
  const regex = /([^{}]*hover[^{}]*)\{([^}]*)\}/gi;
  let match;
  while ((match = regex.exec(css)) !== null) {
    const sel = match[1].trim();
    const body = match[2].trim();
    if (sel.includes(' i') || sel.includes('icon') || sel.includes('*') || body.includes('opacity: 0') || body.includes('visibility: hidden') || body.includes('display: none') || body.includes('color: transparent') || body.includes('scale(0)') || body.includes('filter:')) {
      console.log(`SELECTOR: ${sel}`);
      console.log(`BODY: ${body}\n`);
    }
  }
}

checkHover(style, 'style.css');
checkHover(motion, 'motion.css');
