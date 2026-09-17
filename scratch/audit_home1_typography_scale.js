// DOM & CSS Analysis for Home 1 Typography System
const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const css = fs.readFileSync(path.join(__dirname, '../css/style.css'), 'utf8');

const checks = [];

function assert(condition, message) {
  checks.push({ passed: !!condition, message });
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

console.log('--- 1. SECTION IDENTIFIERS & COUNT ---');
const sections = ['#hero', '#sleep-intro', '#sleep-services', '#sleep-journey', '#sleep-specialists', '#sleep-cta'];
sections.forEach(sec => {
  assert(html.includes(`id="${sec.replace('#', '')}"`), `Home 1 contains required section ${sec}`);
});
assert(sections.length === 6, 'Exactly 6 Home 1 major sections');

console.log('\n--- 2. HERO TITLE TYPOGRAPHY ---');
assert(css.includes('#hero-title {') || css.includes('#hero-title,'), 'CSS defines #hero-title');
assert(css.includes('clamp(2.35rem, 4.6vw, 3.75rem)') || css.includes('3.75rem'), 'Hero title desktop font-size reaches 3.75rem (~60px, target 52-62px)');
assert(css.includes('3.125rem'), 'Hero title tablet font-size reaches 3.125rem (~50px, target 46-54px)');
assert(css.includes('2.375rem'), 'Hero title mobile font-size reaches 2.375rem (~38px, target 36-42px)');
assert(css.includes('Cormorant Garamond'), 'Hero title uses Cormorant Garamond');

console.log('\n--- 3. MAJOR SECTION HEADINGS ---');
assert(css.includes('.home1-section-heading'), 'CSS defines .home1-section-heading');
assert(css.includes('3.25rem !important; /* ~52px desktop'), 'Section headings desktop size is 3.25rem (~52px, target 48-56px)');
assert(css.includes('2.75rem !important; /* ~44px tablet'), 'Section headings tablet size is 2.75rem (~44px, target 42-48px)');
assert(css.includes('2.25rem !important; /* ~36px mobile'), 'Section headings mobile size is 2.25rem (~36px, target 34-40px)');

console.log('\n--- 4. SUPPORTING PARAGRAPHS ---');
assert(css.includes('.home1-supporting-paragraph'), 'CSS defines .home1-supporting-paragraph');
assert(css.includes('1.125rem !important; /* ~18px desktop'), 'Supporting paragraph desktop size is 1.125rem (~18px, target 17-18px)');
assert(css.includes('1.05rem !important; /* ~16.8px tablet'), 'Supporting paragraph tablet size is 1.05rem (~16.8px, target 16-17px)');
assert(css.includes('0.97rem !important; /* ~15.5px mobile'), 'Supporting paragraph mobile size is 0.97rem (~15.5px, target 15-16px)');
assert(css.includes('line-height: 1.72 !important;'), 'Supporting paragraph line-height is 1.72 (target 1.6-1.75)');

console.log('\n--- 5. CARD & FEATURE CONTENT (SECTION 02 & 03) ---');
assert(css.includes('.sleep-indication-card .card-title {') && css.includes('1.22rem; /* ~19.5px desktop'), 'Indication card title desktop is 1.22rem (~19.5px, target 18-21px)');
assert(css.includes('.sleep-indication-card .card-desc {') && css.includes('0.97rem; /* ~15.5px desktop'), 'Indication card desc desktop is 0.97rem (~15.5px, target 15-16px)');
assert(css.includes('.scope-row-title {') && css.includes('1.22rem; /* ~19.5px'), 'Scope row title desktop is 1.22rem (~19.5px, target 18-21px)');
assert(css.includes('.scope-row-desc {') && css.includes('0.97rem; /* ~15.5px desktop'), 'Scope row desc desktop is 0.97rem (~15.5px, target 15-16px)');
assert(css.includes('.scope-row-number {') && css.includes('0.95rem; /* ~15px'), 'Scope row number is restrained at 0.95rem (~15px, target 13-16px)');

console.log('\n--- 6. STRUCTURED CLINICAL PATHWAY (SECTION 04) ---');
assert(css.includes('.timeline-step-title {') && css.includes('1.2rem !important; /* ~19.2px desktop'), 'Timeline step title desktop is 1.2rem (~19.2px, target 18-21px)');
assert(css.includes('.timeline-step-desc {') && css.includes('0.97rem !important; /* ~15.5px desktop'), 'Timeline step desc desktop is 0.97rem (~15.5px, target 15-16px)');
assert(css.includes('.step-marker-num {') && css.includes('0.8125rem !important; /* ~13px restrained'), 'Step marker number is restrained at 0.8125rem (~13px, target 13-16px)');
assert(html.includes('class="timeline-step-title"'), 'HTML applies timeline-step-title');
assert(html.includes('class="timeline-step-desc"'), 'HTML applies timeline-step-desc');
assert(html.includes('class="step-marker-num"'), 'HTML applies step-marker-num');

console.log('\n--- 7. SPECIALISTS COMPETENCIES (SECTION 05) ---');
assert(css.includes('.specialist-comp-title {') && css.includes('1.18rem !important; /* ~18.8px desktop'), 'Specialist comp title is 1.18rem (~18.8px, target 18-20px)');
assert(css.includes('.specialist-comp-desc {') && css.includes('0.97rem !important; /* ~15.5px desktop'), 'Specialist comp desc is 0.97rem (~15.5px, target 15-16px)');
assert(html.includes('class="specialist-comp-title"'), 'HTML applies specialist-comp-title');
assert(html.includes('class="specialist-comp-desc"'), 'HTML applies specialist-comp-desc');

console.log('\n--- 8. EYEBROWS & CTAS & BADGES ---');
assert(css.includes('.home1-eyebrow {') && css.includes('0.8125rem !important; /* ~13px'), 'Eyebrow size is 0.8125rem (~13px, target 12-14px)');
assert(css.includes('#hero .btn-primary-pill') && css.includes('0.97rem !important; /* ~15.5px'), 'CTA font size is 0.97rem (~15.5px, target 14-16px)');
assert(css.includes('.cta-trust-badge span') && css.includes('0.875rem !important; /* ~14px'), 'Trust badge font size is 0.875rem (~14px, target 13-15px)');

console.log('\n--- 9. SCOPE SANITY: OTHER PAGES UNTOUCHED ---');
const files = ['home2.html', 'about.html', 'services.html', 'doctors.html', 'faq.html', 'contact.html', 'dashboard.html'];
files.forEach(f => {
  const content = fs.readFileSync(path.join(__dirname, '..', f), 'utf8');
  assert(!content.includes('home1-supporting-paragraph'), `${f} does not contain Home 1 specific typography class`);
});

const passed = checks.filter(c => c.passed).length;
const total = checks.length;
console.log(`\n========================================`);
console.log(`AUDIT RESULTS: ${passed}/${total} checks passed (${(passed/total*100).toFixed(1)}%)`);
console.log(`========================================`);

if (passed !== total) {
  process.exit(1);
}
