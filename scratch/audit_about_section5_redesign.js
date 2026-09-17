const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, '..', 'css', 'style.css');
const aboutHtmlPath = path.join(__dirname, '..', 'about.html');

const css = fs.readFileSync(cssPath, 'utf8');
const html = fs.readFileSync(aboutHtmlPath, 'utf8');

console.log('--- COMPREHENSIVE AUDIT: ABOUT US SECTION 5 EDITORIAL CONVERSATION GATE ---');

const checks = [];

function assert(description, condition) {
  checks.push({ description, pass: !!condition });
  if (condition) {
    console.log(`  ✓ ${description}`);
  } else {
    console.error(`  ✗ FAIL: ${description}`);
  }
}

// 1. Exact Section Count & IDs
const allSections = html.match(/<section\b/g) || [];
assert('about.html has exactly 5 <section> tags', allSections.length === 5);

const expectedIds = ['about-hero', 'about-approach', 'about-philosophy', 'about-experience', 'about-cta'];
expectedIds.forEach(id => {
  assert(`about.html contains section #${id}`, html.includes(`id="${id}"`));
});

// Extract Section 5 HTML
const s5Start = html.indexOf('id="about-cta"');
const s5Html = html.slice(s5Start, html.indexOf('</main>'));

// 2. Section 5 Content Verification
assert(
  'Section 5 contains eyebrow "START WITH UNDERSTANDING"',
  s5Html.includes('START WITH UNDERSTANDING')
);

assert(
  'Section 5 contains headline "Begin With a Conversation."',
  s5Html.includes('Begin With a Conversation.')
);

assert(
  'Section 5 contains supporting narrative "Every sleep concern starts somewhere..."',
  s5Html.includes('Every sleep concern starts somewhere. A clear conversation can help you understand what to explore next.')
);

assert(
  'Section 5 contains vertical sequence: 01 Listen, 02 Understand, 03 Guide',
  s5Html.includes('01') && s5Html.includes('Listen') &&
  s5Html.includes('02') && s5Html.includes('Understand') &&
  s5Html.includes('03') && s5Html.includes('Guide')
);

assert(
  'Section 5 contains required Font Awesome icons: fa-ear-listen, fa-lightbulb, fa-compass',
  s5Html.includes('fa-ear-listen') &&
  s5Html.includes('fa-lightbulb') &&
  s5Html.includes('fa-compass')
);

assert(
  'Section 5 contains primary CTA "Start a Conversation" with modal trigger',
  s5Html.includes('Start a Conversation') &&
  s5Html.includes("openModal('sleepStudyModal')")
);

assert(
  'Section 5 contains secondary link "Explore Sleep Care"',
  s5Html.includes('Explore Sleep Care') &&
  s5Html.includes('href="services.html"')
);

assert(
  'Section 5 contains editorial statement "Clear questions lead to clearer next steps."',
  s5Html.includes('Clear questions lead to clearer next steps.')
);

assert(
  'Section 5 uses editorial portrait visual assets/images/about-cta-editorial.jpg',
  s5Html.includes('assets/images/about-cta-editorial.jpg')
);

// 3. Duplicate Image Check
const ctaImgMatches = html.match(/about-cta-editorial\.jpg/g) || [];
assert(
  'about-cta-editorial.jpg is used exactly once on the page (0 duplicate instances)',
  ctaImgMatches.length === 1
);

// 4. Section 5 CSS Verification
assert(
  'Section 5 headline uses Cormorant Garamond with clamp scale',
  css.includes('.about-page .about-gate-heading') &&
  css.includes("'Cormorant Garamond'") &&
  css.includes('clamp(2.25rem')
);

assert(
  'Section 5 supporting paragraph uses DM Sans',
  css.includes('.about-page .about-gate-paragraph') &&
  css.includes("'DM Sans'")
);

assert(
  'Section 5 editorial numbers use Cormorant Garamond',
  css.includes('.about-page .about-gate-num') &&
  css.includes("'Cormorant Garamond'")
);

assert(
  'Section 5 step titles use DM Sans',
  css.includes('.about-page .about-gate-step-title') &&
  css.includes("'DM Sans'")
);

assert(
  'Section 5 image frame features asymmetric rounded corners',
  css.includes('.about-page .about-gate-image-frame') &&
  css.includes('border-radius: 2rem 0.75rem 2rem 2rem;')
);

assert(
  'Section 5 image frame has RTL mirrored corners',
  css.includes('[dir="rtl"] .about-page .about-gate-image-frame') &&
  css.includes('border-radius: 0.75rem 2rem 2rem 2rem;')
);

// 5. Icon Hover & Interaction Safety
assert(
  'Step icon badge transitions smoothly and never disappears',
  css.includes('.about-page .about-gate-icon-badge') &&
  css.includes('.about-page .about-gate-icon-badge i') &&
  css.includes('opacity: 1 !important;') &&
  css.includes('visibility: visible !important;')
);

assert(
  'Step icon hover uses safe micro-interaction (scale 1.05 translateY -2px)',
  css.includes('.about-page .about-gate-step:hover .about-gate-icon-badge i') &&
  css.includes('transform: translateY(-2px) scale(1.05);')
);

assert(
  'Step icon hover has explicit light mode contrast (#3B5BDB background, #FFFFFF icon)',
  css.includes('.about-page .about-gate-step:hover .about-gate-icon-badge') &&
  css.includes('background-color: #3B5BDB !important;') &&
  css.includes('color: #FFFFFF !important;')
);

assert(
  'Step icon hover has explicit dark mode contrast (#7A9BE8 background, #0A0F24 icon)',
  css.includes('.dark .about-page .about-gate-step:hover .about-gate-icon-badge') &&
  css.includes('background-color: #7A9BE8 !important;') &&
  css.includes('color: #0A0F24 !important;')
);

// 6. Accessibility & Reduced Motion
assert(
  'Keyboard focus-visible styling defined for conversation steps',
  css.includes('.about-page .about-gate-step:focus-visible') &&
  css.includes('outline:')
);

assert(
  'prefers-reduced-motion block neutralizes transforms for Section 5 elements',
  css.includes('@media (prefers-reduced-motion: reduce)') &&
  css.includes('.about-page .about-gate-step') &&
  css.includes('.about-page .about-gate-icon-badge') &&
  css.includes('.about-page .about-gate-primary-btn') &&
  css.includes('transform: none !important;')
);

// 7. RTL Directional Flip for Secondary Link
assert(
  'Secondary link arrow flips in RTL',
  css.includes('[dir="rtl"] .about-page .about-gate-secondary-link:hover i') &&
  css.includes('transform: translateX(-4px);')
);

const failed = checks.filter(c => !c.pass);
console.log(`\nAUDIT RESULT: ${checks.length - failed.length} / ${checks.length} checks PASSED.`);
if (failed.length > 0) {
  console.error(`FAILED CHECKS:`, failed);
  process.exit(1);
} else {
  console.log('ALL SECTION 5 AUDITS PASSED SUCCESSFULLY!');
}
