// Comprehensive QA and Validation for Home 2 Diagnostic Methodology: The Sleep Investigation
const fs = require('fs');
const path = require('path');

const home2Html = fs.readFileSync(path.join(__dirname, '../home2.html'), 'utf8');
const styleCss = fs.readFileSync(path.join(__dirname, '../css/style.css'), 'utf8');

const checks = [];

function assert(condition, message) {
  checks.push({ passed: !!condition, message });
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
  } else {
    console.log(`✅ PASS: ${message}`);
  }
}

console.log('=== 1. HOME 2 SECTION STRUCTURE & EXACT COUNT ===');
const requiredSections = ['#hero-home2', '#sleep-disorders', '#sleep-pathway', '#care-philosophy', '#sleep-environment', '#home2-cta'];
requiredSections.forEach(sec => {
  assert(home2Html.includes(`id="${sec.replace('#', '')}"`), `Home 2 includes required section ${sec}`);
});
assert(home2Html.includes('id="sleep-pathway"'), 'Section 03 has ID sleep-pathway and is ONE major section');

console.log('\n=== 2. EDITORIAL CLINICAL STORYTELLING CONTENT ===');
assert(home2Html.includes('Diagnostic Methodology'), 'Contains Diagnostic Methodology eyebrow');
assert(home2Html.includes('The Sleep Investigation'), 'Contains The Sleep Investigation main heading');
assert(home2Html.includes('class="home2-investigation-heading'), 'Heading uses home2-investigation-heading class');
assert(home2Html.includes('class="home2-investigation-paragraph'), 'Paragraph uses home2-investigation-paragraph class');
assert(home2Html.includes('investigation-editorial-callout'), 'Contains editorial metadata callout block');
assert(home2Html.includes('Investigation Standard'), 'Callout features Investigation Standard label');
assert(home2Html.includes('Objective nocturnal metrics paired with patient-reported sleep architecture'), 'Callout contains clinical principles note');

console.log('\n=== 3. FOUR METHODOLOGY STEPS VALIDATION ===');
const steps = [
  { num: '01', title: 'Observe', desc: 'Understand sleep patterns, concerns and everyday experiences.', icon: 'fa-eye' },
  { num: '02', title: 'Assess', desc: 'Consider the appropriate clinical assessment based on the concerns being explored.', icon: 'fa-magnifying-glass' },
  { num: '03', title: 'Study', desc: 'Sleep may be evaluated through appropriate diagnostic methods when needed.', icon: 'fa-wave-square' },
  { num: '04', title: 'Understand', desc: 'Findings are explained clearly to help shape the next step in care.', icon: 'fa-lightbulb' }
];

steps.forEach(st => {
  assert(home2Html.includes(`>${st.num}</span>`), `Step ${st.num} contains oversized number: ${st.num}`);
  assert(home2Html.includes(st.title), `Step ${st.num} contains title: ${st.title}`);
  assert(home2Html.includes(st.desc), `Step ${st.num} contains exact description: ${st.desc}`);
  assert(home2Html.includes(st.icon), `Step ${st.num} uses semantic icon: ${st.icon}`);
  assert(home2Html.includes(`aria-label="Step ${parseInt(st.num)}: ${st.title}"`), `Step ${st.num} has accessible aria-label`);
});

console.log('\n=== 4. DEDICATED IMAGE ASSET & DUPLICATE CHECK ===');
const imgFilename = 'home2-methodology-editorial.jpg';
const imgPath = path.join(__dirname, '../assets/images', imgFilename);
assert(fs.existsSync(imgPath), `Image asset exists: ${imgFilename}`);
const stat = fs.statSync(imgPath);
assert(stat.size > 200000, `Image asset is high-resolution (${(stat.size / 1024).toFixed(1)} KB)`);
assert(home2Html.includes(imgFilename), `home2.html references ${imgFilename}`);

const allOtherPages = ['index.html', 'about.html', 'services.html', 'doctors.html', 'faq.html', 'contact.html', 'dashboard.html'];
let otherOccurrences = 0;
allOtherPages.forEach(p => {
  const content = fs.readFileSync(path.join(__dirname, '..', p), 'utf8');
  if (content.includes(imgFilename)) otherOccurrences++;
});
assert(otherOccurrences === 0, `home2-methodology-editorial.jpg has duplicate count = 0 across all other pages`);

console.log('\n=== 5. ORGANIC FLOW LINE & VISUAL STAGE ===');
assert(home2Html.includes('investigation-stage'), 'Markup defines investigation-stage container');
assert(home2Html.includes('class="investigation-photo-frame"'), 'Markup defines investigation-photo-frame');
assert(home2Html.includes('class="investigation-flow-svg'), 'Markup defines SVG flowing connector line');
assert(home2Html.includes('id="investigation-svg-path"'), 'Markup defines investigation-svg-path');
assert(home2Html.includes('investigation-photo-badge'), 'Visual frame contains clinical telemetry badge');

console.log('\n=== 6. CSS SYSTEM & RESPONSIVE SCALES ===');
assert(styleCss.includes('.home2-investigation-heading'), 'style.css defines .home2-investigation-heading');
assert(styleCss.includes('3.35rem !important; /* ~54px desktop (target 50-58px)'), 'Desktop heading target 50-58px met');
assert(styleCss.includes('2.75rem !important; /* ~44px tablet'), 'Tablet heading target 42-48px met');
assert(styleCss.includes('2.35rem !important; /* ~38px mobile (target 36-42px)'), 'Mobile heading target 36-42px met');
assert(styleCss.includes('.home2-investigation-paragraph'), 'style.css defines .home2-investigation-paragraph');
assert(styleCss.includes('.investigation-photo-frame'), 'style.css defines .investigation-photo-frame');
assert(styleCss.includes('border-radius: 48px 18px 64px 22px;'), 'Asymmetric organic border-radius styled');
assert(styleCss.includes('border-radius: 18px 48px 22px 64px;'), 'RTL asymmetric organic border-radius styled');
assert(styleCss.includes('.investigation-step-node'), 'style.css defines .investigation-step-node');
assert(styleCss.includes('.investigation-step-num'), 'style.css defines .investigation-step-num');
assert(styleCss.includes('.investigation-flow-path.highlighted'), 'Interactive SVG highlight path defined');
assert(styleCss.includes('.dark .investigation-step-node'), 'Dark mode step styles defined');
assert(styleCss.includes('[dir="rtl"] .investigation-step-node'), 'RTL step styles defined');
assert(styleCss.includes('@media (prefers-reduced-motion: reduce)') && styleCss.includes('.investigation-flow-path'), 'Reduced motion rules defined');

console.log('\n=== 7. INTERACTIVE SCRIPT & ACCESSIBILITY ===');
assert(home2Html.includes('investigationNodes.forEach'), 'Script registers event listeners for methodology nodes');
assert(home2Html.includes("investigationPath.classList.add('highlighted')"), 'Hover/focus highlights SVG path');
assert(home2Html.includes('tabindex="0"'), 'Step nodes have tabindex="0" for keyboard accessibility');

console.log('\n=== 8. SCOPE INTEGRITY & OBSOLETE CSS CLEANUP ===');
const home1Html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
assert(!home1Html.includes('investigation-step-node'), 'Home 1 does not contain investigation-step-node');
assert(!home1Html.includes('home2-investigation-heading'), 'Home 1 does not contain home2-investigation-heading');
assert(!styleCss.includes('.pathway-node-card'), 'Obsolete .pathway-node-card was cleanly replaced');
assert(!styleCss.includes('.pathway-progress-line'), 'Obsolete .pathway-progress-line was cleanly replaced');

const passed = checks.filter(c => c.passed).length;
const total = checks.length;
console.log(`\n========================================`);
console.log(`AUDIT RESULTS: ${passed}/${total} checks passed (${(passed/total*100).toFixed(1)}%)`);
console.log(`========================================`);

if (passed !== total) {
  process.exit(1);
}
