// Comprehensive QA and Validation for Home 2 Sleep Signal Explorer
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

console.log('=== 1. HOME 2 SECTION STRUCTURE & COUNT ===');
const requiredSections = ['#hero-home2', '#sleep-disorders', '#sleep-pathway', '#care-philosophy', '#sleep-environment', '#home2-cta'];
requiredSections.forEach(sec => {
  assert(home2Html.includes(`id="${sec.replace('#', '')}"`), `Home 2 includes required section ${sec}`);
});
assert(home2Html.includes('id="sleep-disorders"'), 'Section 02 has ID sleep-disorders and is ONE major section');

console.log('\n=== 2. SLEEP SIGNAL EXPLORER DOM COMPOSITION ===');
assert(home2Html.includes('Clinical Indications'), 'Contains Clinical Indications eyebrow');
assert(home2Html.includes('What Your Sleep May Be'), 'Contains What Your Sleep May Be Telling You heading');
assert(home2Html.includes('class="home2-section-heading'), 'Heading has home2-section-heading class');
assert(home2Html.includes('class="home2-supporting-paragraph'), 'Supporting paragraph has home2-supporting-paragraph class');
assert(home2Html.includes('role="tablist"'), 'Navigator list has role="tablist"');
assert(home2Html.includes('id="signal-visual-stage"'), 'Visual stage exists with id signal-visual-stage');
assert(home2Html.includes('id="signal-badge-label"'), 'Floating clinical telemetry badge exists');

console.log('\n=== 3. FOUR CLINICAL CONCERN ITEMS ===');
const concerns = [
  { num: '01', title: 'Sleep Apnea &amp; Airway Resistance', icon: 'fa-lungs', img: 'home2-clinical-apnea.jpg' },
  { num: '02', title: 'Chronic Insomnia &amp; Latency', icon: 'fa-moon', img: 'home2-clinical-insomnia.jpg' },
  { num: '03', title: 'Disrupted Sleep Architecture', icon: 'fa-wave-square', img: 'home2-clinical-disrupted.jpg' },
  { num: '04', title: 'Daytime Exhaustion &amp; Fog', icon: 'fa-sun', img: 'home2-clinical-fatigue.jpg' }
];

concerns.forEach((c, i) => {
  const targetId = i + 1;
  assert(home2Html.includes(`data-signal-target="${targetId}"`), `Concern ${c.num} has data-signal-target="${targetId}"`);
  assert(home2Html.includes(c.title), `Concern ${c.num} has title: ${c.title}`);
  assert(home2Html.includes(c.icon), `Concern ${c.num} uses semantic icon: ${c.icon}`);
  assert(home2Html.includes(`data-signal-img="${targetId}"`), `Stage image ${targetId} exists`);
  assert(home2Html.includes(c.img), `Markup references dedicated image: ${c.img}`);
  assert(home2Html.includes(`data-signal-panel="${targetId}"`), `Content panel ${targetId} exists`);
});

console.log('\n=== 4. DEDICATED IMAGE ASSETS VERIFICATION ===');
concerns.forEach(c => {
  const imgPath = path.join(__dirname, '../assets/images', c.img);
  assert(fs.existsSync(imgPath), `Image asset exists: ${c.img}`);
  const stat = fs.statSync(imgPath);
  assert(stat.size > 200000, `Image asset ${c.img} is high-resolution (${(stat.size / 1024).toFixed(1)} KB)`);
});

console.log('\n=== 5. DUPLICATE IMAGE COUNT CHECK ===');
const allPages = ['index.html', 'about.html', 'services.html', 'doctors.html', 'faq.html', 'contact.html', 'dashboard.html'];
concerns.forEach(c => {
  let countInOtherPages = 0;
  allPages.forEach(p => {
    const content = fs.readFileSync(path.join(__dirname, '..', p), 'utf8');
    if (content.includes(c.img)) countInOtherPages++;
  });
  assert(countInOtherPages === 0, `${c.img} is uniquely dedicated to Home 2 Section 02 (duplicate count = 0)`);
});

console.log('\n=== 6. OBSERVABLE PATTERNS & CTA VERIFICATION ===');
assert(home2Html.includes('What you may observe:'), 'Content panels feature "What you may observe:"');
assert(home2Html.includes('Chronic loud snoring, witnessed gasping episodes'), 'Contains neutral observable airway patterns');
assert(home2Html.includes('Sleep latency consistently exceeding 30 to 45 minutes'), 'Contains neutral observable insomnia patterns');
assert(home2Html.includes('Waking multiple times per night with persistent difficulty'), 'Contains neutral observable disrupted sleep patterns');
assert(home2Html.includes('Midday energy crashes, concentration lapses'), 'Contains neutral observable daytime fatigue patterns');
assert(home2Html.includes('href="services.html"'), 'Explore Sleep Care CTA links directly to services.html');

console.log('\n=== 7. CSS SYSTEM VALIDATION ===');
assert(styleCss.includes('.home2-section-heading'), 'style.css defines .home2-section-heading');
assert(styleCss.includes('3.35rem !important; /* ~54px desktop (target 50-58px)'), 'Desktop heading target 50-58px met');
assert(styleCss.includes('2.85rem !important; /* ~46px tablet (target 44-50px)'), 'Tablet heading target 44-50px met');
assert(styleCss.includes('2.35rem !important; /* ~38px mobile (target 36-40px)'), 'Mobile heading target 36-40px met');
assert(styleCss.includes('.home2-supporting-paragraph'), 'style.css defines .home2-supporting-paragraph');
assert(styleCss.includes('.signal-nav-row'), 'style.css defines .signal-nav-row');
assert(styleCss.includes('.signal-nav-row.active::before'), 'Active indicator bar styled');
assert(styleCss.includes('.signal-visual-frame'), 'style.css defines .signal-visual-frame');
assert(styleCss.includes('.signal-stage-img'), 'style.css defines .signal-stage-img');
assert(styleCss.includes('.signal-content-card'), 'style.css defines .signal-content-card');
assert(styleCss.includes('.signal-panel-content.active'), 'style.css defines .signal-panel-content.active');
assert(styleCss.includes('.dark .signal-nav-row.active'), 'Dark mode active states defined');
assert(styleCss.includes('[dir="rtl"] .signal-nav-row'), 'RTL direction styles defined');
assert(styleCss.includes('@media (prefers-reduced-motion: reduce)') && styleCss.includes('.signal-stage-img'), 'Reduced motion support implemented');

console.log('\n=== 8. INTERACTIVE CONTROLLER SCRIPT ===');
assert(home2Html.includes('activateSignal(targetId)'), 'Interactive controller function activateSignal exists');
assert(home2Html.includes("row.addEventListener('mouseenter'"), 'Desktop hover activation supported');
assert(home2Html.includes("row.addEventListener('click'"), 'Click / Touch activation supported');
assert(home2Html.includes("e.key === 'ArrowDown'"), 'Keyboard arrow navigation supported');

console.log('\n=== 9. SCOPE INTEGRITY: NO GLOBAL OR HOME 1 BLEED ===');
const home1Html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
assert(!home1Html.includes('signal-nav-row'), 'Home 1 does not contain signal-nav-row');
assert(!home1Html.includes('home2-section-heading'), 'Home 1 does not contain home2-section-heading');

const passed = checks.filter(c => c.passed).length;
const total = checks.length;
console.log(`\n========================================`);
console.log(`AUDIT RESULTS: ${passed}/${total} checks passed (${(passed/total*100).toFixed(1)}%)`);
console.log(`========================================`);

if (passed !== total) {
  process.exit(1);
}
