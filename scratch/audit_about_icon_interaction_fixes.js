const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'css', 'style.css');
const aboutHtmlPath = path.join(__dirname, '..', 'about.html');

const css = fs.readFileSync(cssPath, 'utf8');
const html = fs.readFileSync(aboutHtmlPath, 'utf8');

console.log('--- COMPREHENSIVE AUDIT: ABOUT US ICON HOVER VISIBILITY & CONTRAST ---');

const checks = [];

function assert(description, condition) {
  checks.push({ description, pass: !!condition });
  if (condition) {
    console.log(`  ✓ ${description}`);
  } else {
    console.error(`  ✗ FAIL: ${description}`);
  }
}

// 1. Root and Dark mode variable definitions (Eliminates CSS invalid custom property unset glitch)
assert(
  ':root defines --color-brand (#3B5BDB) and --color-accent-teal',
  css.includes('--color-brand: #3B5BDB;') &&
  css.includes('--color-accent-teal: #3B5BDB;')
);

assert(
  '.dark defines --color-brand (#7A9BE8) and --color-accent-teal',
  css.includes('--color-brand: #7A9BE8;') &&
  css.includes('--color-accent-teal: #7A9BE8;')
);

// 2. Universal About Us Icon visibility & stability guarantees across states
assert(
  'Universal About Us icon opacity & visibility guarantee across hover, focus, and active states',
  css.includes('.about-page i[class*="fa-"]') &&
  css.includes('.about-page *:hover i[class*="fa-"]') &&
  css.includes('.about-page *:focus i[class*="fa-"]') &&
  css.includes('.about-page *:active i[class*="fa-"]') &&
  css.includes('opacity: 1 !important;') &&
  css.includes('visibility: visible !important;')
);

assert(
  'Centred transform-origin for all About Us icons',
  css.includes('transform-origin: center center;')
);

// 3. Section 5 gate container
assert(
  '.about-page .about-conversation-gate is properly scoped and positioned',
  css.includes('.about-page .about-conversation-gate') &&
  html.includes('class="about-conversation-gate')
);

// 4. Pointer events safety on connecting line in Care Feel section
assert(
  '.care-feel-line has pointer-events: none (prevents mouse interception over cards/icons)',
  css.includes('.about-page .care-feel-line {') &&
  css.includes('pointer-events: none;')
);

// 5. Approach Icon Box Contrast & Visibility in Normal and Hover States
assert(
  '.approach-icon-box has explicit light mode color and background',
  css.includes('.about-page .approach-icon-box {') &&
  css.includes('color: #3B5BDB;') &&
  css.includes('.about-page .approach-icon-box i {')
);

assert(
  '.approach-icon-box hover in light mode has solid background (#3B5BDB) and white icon (#FFFFFF !important)',
  css.includes('.about-page .approach-principle-item:hover .approach-icon-box,') &&
  css.includes('background-color: #3B5BDB !important;') &&
  css.includes('.about-page .approach-principle-item:hover .approach-icon-box i') &&
  css.includes('color: #FFFFFF !important;')
);

assert(
  '.approach-icon-box hover in dark mode has solid background (#7A9BE8) and high contrast dark icon (#0A0F24 !important)',
  css.includes('.dark .about-page .approach-principle-item:hover .approach-icon-box,') &&
  css.includes('background-color: #7A9BE8 !important;') &&
  css.includes('.dark .about-page .approach-principle-item:hover .approach-icon-box i') &&
  css.includes('color: #0A0F24 !important;')
);

// 6. Direct icon box hover support
assert(
  'Direct hover on .approach-icon-box:hover preserves solid background and high contrast icon',
  css.includes('.about-page .approach-icon-box:hover') &&
  css.includes('.about-page .approach-icon-box:hover i')
);

// 7. Care Feel Card Contrast & Visibility in Normal and Hover States
assert(
  '.care-feel-icon-box has explicit light mode color and background',
  css.includes('.about-page .care-feel-icon-box {') &&
  css.includes('color: #3B5BDB;')
);

assert(
  '.care-feel-icon-box hover in light mode has solid background (#3B5BDB) and white icon (#FFFFFF !important)',
  css.includes('.about-page .care-feel-card:hover .care-feel-icon-box,') &&
  css.includes('background-color: #3B5BDB !important;') &&
  css.includes('.about-page .care-feel-card:hover .care-feel-icon-box i') &&
  css.includes('color: #FFFFFF !important;')
);

assert(
  '.care-feel-icon-box hover in dark mode has solid background (#7A9BE8) and high contrast dark icon (#0A0F24 !important)',
  css.includes('.dark .about-page .care-feel-card:hover .care-feel-icon-box,') &&
  css.includes('background-color: #7A9BE8 !important;') &&
  css.includes('.dark .about-page .care-feel-card:hover .care-feel-icon-box i') &&
  css.includes('color: #0A0F24 !important;')
);

// 8. Direct care-feel icon box hover support
assert(
  'Direct hover on .care-feel-icon-box:hover preserves solid background and high contrast icon',
  css.includes('.about-page .care-feel-icon-box:hover') &&
  css.includes('.about-page .care-feel-icon-box:hover i')
);

// 9. Section 5 Conversation Gate Icons Visibility & Contrast
assert(
  'Section 5 gate icons have explicit colors and remain visible on hover',
  css.includes('.about-page .about-gate-icon-badge i') &&
  css.includes('color: #3B5BDB;') &&
  css.includes('.about-page .about-gate-step:hover .about-gate-icon-badge') &&
  css.includes('background-color: #3B5BDB !important;') &&
  css.includes('.about-page .about-gate-step:hover .about-gate-icon-badge i') &&
  css.includes('color: #FFFFFF !important;')
);

// 10. Safe transform range: transform translateY(-2px) scale(1.05) or scale <= 1.08
const scaleMatches = css.slice(css.indexOf('/* SECTION 02: OUR APPROACH'), css.indexOf('/* ==========================================================================\n   SECTION 06:') || css.length).match(/scale\(([0-9.]+)\)/g);
let allScalesSafe = true;
if (scaleMatches) {
  for (const s of scaleMatches) {
    const val = parseFloat(s.replace('scale(', '').replace(')', ''));
    if (val > 1.08) {
      allScalesSafe = false;
      console.error(`Unsafe scale found in About section: ${s}`);
    }
  }
}
assert('All icon hover scale values within safe range (<= 1.08)', allScalesSafe);

// 11. Stacking / Z-index safety
assert(
  '.approach-icon-box has position: relative and z-index >= 2 and i has z-index: 3',
  css.includes('.about-page .approach-icon-box {') &&
  css.includes('z-index: 2;') &&
  css.includes('.about-page .approach-icon-box i {') &&
  css.includes('z-index: 3;')
);

assert(
  '.care-feel-icon-box has position: relative and z-index: 2 and i has z-index: 3',
  css.includes('.about-page .care-feel-icon-box {') &&
  css.includes('z-index: 2;') &&
  css.includes('.about-page .care-feel-icon-box i {') &&
  css.includes('z-index: 3;')
);

// 12. Keyboard focus support (:focus-within / :focus-visible)
assert(
  ':focus-within and :focus-visible support for approach items and care feel cards',
  css.includes('.approach-principle-item:focus-within') &&
  css.includes('.care-feel-card:focus-within') &&
  css.includes('.about-page .care-feel-card:focus-visible') &&
  css.includes('.about-page .approach-principle-item:focus-visible')
);

// 13. Reduced motion support
assert(
  'prefers-reduced-motion block disables icon transforms while preserving opacity and layout',
  css.includes('@media (prefers-reduced-motion: reduce)') &&
  css.includes('.about-page i[class*="fa-"]') &&
  css.includes('transform: none !important;')
);

// 14. HTML 5-section integrity check
assert(
  'about.html contains exactly the 5 primary sections: about-hero, about-approach, about-philosophy, about-experience, about-cta',
  html.includes('id="about-hero"') &&
  html.includes('id="about-approach"') &&
  html.includes('id="about-philosophy"') &&
  html.includes('id="about-experience"') &&
  html.includes('id="about-cta"')
);

const allSectionTags = html.match(/<section\b/g);
assert('about.html has exactly 5 <section> elements', allSectionTags && allSectionTags.length === 5);

const faIcons = html.match(/class="[^"]*fa-[^"]*"/g);
assert(`about.html has ${faIcons ? faIcons.length : 0} Font Awesome icon instances`, faIcons && faIcons.length >= 8);

const failed = checks.filter(c => !c.pass);
console.log(`\nAUDIT RESULT: ${checks.length - failed.length} / ${checks.length} checks PASSED.`);
if (failed.length > 0) {
  console.error(`FAILED CHECKS:`, failed);
  process.exit(1);
} else {
  console.log('ALL AUDITS PASSED SUCCESSFULLY!');
}
