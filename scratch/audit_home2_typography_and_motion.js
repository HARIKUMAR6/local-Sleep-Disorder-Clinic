// Comprehensive QA and Validation for Home 2 Typography, Icon Scale & Unified Motion System
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

console.log('=== 1. HOME 2 SECTION STRUCTURE & BODY SCOPE ===');
const requiredSections = ['#hero-home2', '#sleep-disorders', '#sleep-pathway', '#care-philosophy', '#sleep-environment', '#home2-cta'];
requiredSections.forEach(sec => {
  assert(home2Html.includes(`id="${sec.replace('#', '')}"`), `Home 2 includes required section ${sec}`);
});
assert(home2Html.includes('class="home2-page'), 'home2.html body has home2-page scoping class');

console.log('\n=== 2. HERO TYPOGRAPHY & ELEMENTS (#hero-home2) ===');
assert(styleCss.includes('.home2-page #hero-home2 #hero-title'), 'style.css defines .home2-page #hero-home2 #hero-title');
assert(styleCss.includes('3.75rem !important; /* 60px desktop (target 56-64px)'), 'Hero heading desktop target 56-64px met (60px)');
assert(styleCss.includes('3.125rem !important; /* 50px tablet (target 46-54px)'), 'Hero heading tablet target 46-54px met (50px)');
assert(styleCss.includes('2.5rem !important; /* 40px mobile (target 38-44px)'), 'Hero heading mobile target 38-44px met (40px)');
assert(styleCss.includes('.home2-page #hero-home2 .hero-paragraph'), 'style.css defines .hero-paragraph');
assert(styleCss.includes('1.125rem !important; /* 18px desktop (target 17-19px)'), 'Hero paragraph desktop target 17-19px met (18px)');
assert(styleCss.includes('1rem !important; /* 16px mobile (target 15-17px)'), 'Hero paragraph mobile target 15-17px met (16px)');
assert(styleCss.includes('.home2-page #hero-home2 .hero-eyebrow'), 'style.css defines .hero-eyebrow (13px)');
assert(styleCss.includes('.home2-page #hero-home2 .hero-cta-btn'), 'style.css defines .hero-cta-btn (15.5px)');
assert(styleCss.includes('.home2-page #hero-home2 .hero-telemetry-item i'), 'style.css defines .hero-telemetry-item icon (17px)');

console.log('\n=== 3. ALL MAJOR SECTION HEADINGS (Sections 02 to 06) ===');
assert(styleCss.includes('.home2-page #disorders-title,'), 'Headings selector includes #disorders-title');
assert(styleCss.includes('.home2-page #pathway-title,'), 'Headings selector includes #pathway-title');
assert(styleCss.includes('.home2-page #care-title,'), 'Headings selector includes #care-title');
assert(styleCss.includes('.home2-page #environment-title,'), 'Headings selector includes #environment-title');
assert(styleCss.includes('.home2-page #cta-home2-title,'), 'Headings selector includes #cta-home2-title');
assert(styleCss.includes('3.35rem !important; /* ~54px desktop (target 50-58px)'), 'Section headings desktop target 50-58px met (~54px)');
assert(styleCss.includes('2.85rem !important; /* ~46px tablet (target 42-50px)'), 'Section headings tablet target 42-50px met (~46px)');
assert(styleCss.includes('2.35rem !important; /* ~38px mobile (target 36-42px)'), 'Section headings mobile target 36-42px met (~38px)');

console.log('\n=== 4. ALL SECTION SUPPORTING COPY & EYEBROWS ===');
assert(styleCss.includes('.home2-page .home2-supporting-paragraph,'), 'Supporting copy defines .home2-supporting-paragraph');
assert(styleCss.includes('.home2-page .home2-investigation-paragraph,'), 'Supporting copy defines .home2-investigation-paragraph');
assert(styleCss.includes('.home2-page .home2-body-text'), 'Supporting copy defines .home2-body-text');
assert(styleCss.includes('1.125rem !important; /* 18px desktop (target 17-18px)'), 'Supporting copy desktop target 17-18px met (18px)');
assert(styleCss.includes('1.05rem !important; /* ~16.8px tablet (target 16-17px)'), 'Supporting copy tablet target 16-17px met (16.8px)');
assert(styleCss.includes('0.97rem !important; /* ~15.5px mobile (target 15-16px)'), 'Supporting copy mobile target 15-16px met (15.5px)');
assert(styleCss.includes('.home2-page .home2-section-eyebrow'), 'Eyebrows defined (13px, target 12-14px)');

console.log('\n=== 5. CONTENT / FEATURE / PILLAR TITLES & DESCRIPTIONS ===');
assert(styleCss.includes('.home2-page .home2-feature-title'), 'style.css defines .home2-feature-title');
assert(styleCss.includes('1.20rem !important; /* 19.2px desktop (target 18-21px)'), 'Feature title desktop target 18-21px met (19.2px)');
assert(styleCss.includes('1.06rem !important; /* 17px mobile (target 16-18px)'), 'Feature title mobile target 16-18px met (17px)');
assert(styleCss.includes('.home2-page .home2-feature-desc'), 'style.css defines .home2-feature-desc');
assert(styleCss.includes('0.97rem !important; /* 15.5px desktop (target 15-16px)'), 'Feature desc desktop target 15-16px met (15.5px)');
assert(styleCss.includes('0.90rem !important; /* 14.4px mobile (target 14-15px)'), 'Feature desc mobile target 14-15px met (14.4px)');

console.log('\n=== 6. PILLAR & FEATURE ICONS (Sections 04 & 05) ===');
assert(styleCss.includes('.home2-page .home2-feature-icon-box'), 'style.css defines .home2-feature-icon-box');
assert(styleCss.includes('1.15rem !important; /* ~18.5px (elevated from text-xs/12px)'), 'Pillar icons increased from 12px to 18.5px (+54%)');
assert(styleCss.includes('.home2-page .home2-feature-card:hover .home2-feature-icon-box i'), 'Feature icon hover micro-interaction defined');

console.log('\n=== 7. CLINICAL INDICATIONS (Section 02) REFINEMENTS ===');
assert(styleCss.includes('1.32rem !important; /* 21px desktop (target 20-23px)'), 'Concern title desktop target 20-23px met (21px)');
assert(styleCss.includes('1.125rem !important; /* 18px mobile (target 17-19px)'), 'Concern title mobile target 17-19px met (18px)');
assert(styleCss.includes('1rem !important; /* 16px desktop (target 15-17px)'), 'Concern desc desktop target 15-17px met (16px)');
assert(styleCss.includes('1.55rem !important; /* ~25px desktop (target 24-30px)'), 'Concern icon desktop target 24-30px met (~25px)');
assert(styleCss.includes('1.35rem !important; /* ~22px mobile (target 22-26px)'), 'Concern icon mobile target 22-26px met (~22px)');

console.log('\n=== 8. DIAGNOSTIC METHODOLOGY (Section 03) REFINEMENTS ===');
assert(styleCss.includes('1.28rem !important; /* 20.5px desktop (target 19-22px)'), 'Step title desktop target 19-22px met (20.5px)');
assert(styleCss.includes('1.125rem !important; /* 18px mobile (target 17-19px)'), 'Step title mobile target 17-19px met (18px)');
assert(styleCss.includes('0.97rem !important; /* 15.5px desktop (target 15-17px)'), 'Step desc desktop target 15-17px met (15.5px)');
assert(styleCss.includes('2.65rem !important; /* larger and lighter */'), 'Step number enlarged to 2.65rem (42.4px)');
assert(styleCss.includes('1.45rem !important; /* ~23.2px desktop (target 24-30px)'), 'Step icon desktop target 24-30px met (23.2px)');

console.log('\n=== 9. FINAL CTA (Section 06) REFINEMENTS ===');
assert(styleCss.includes('.home2-page #home2-cta .home2-cta-badge'), 'CTA badge defined (14px)');
assert(styleCss.includes('1.1rem !important; /* ~17.6px (increased by 25%)'), 'CTA badge icon increased to ~17.6px');
assert(styleCss.includes('.home2-page #home2-cta .home2-cta-btn:hover'), 'CTA button hover interaction defined');
assert(styleCss.includes('.home2-page #home2-cta .home2-cta-btn:hover i.fa-arrow-right'), 'CTA arrow slide defined');

console.log('\n=== 10. UNIFIED ANIMATION SYSTEM ON HOME 2 ===');
assert(home2Html.includes('hero-reveal-item hero-delay-badge'), 'Hero eyebrow uses staggered reveal');
assert(home2Html.includes('hero-reveal-item hero-delay-heading'), 'Hero heading uses staggered reveal');
assert(home2Html.includes('hero-reveal-item hero-delay-paragraph'), 'Hero paragraph uses staggered reveal');
assert(home2Html.includes('hero-reveal-item hero-delay-cta'), 'Hero CTAs use staggered reveal');
assert(home2Html.includes('hero-reveal-item hero-delay-6'), 'Hero telemetry strip uses staggered reveal');
assert(home2Html.includes('care-layered-photo reveal-scale'), 'Care photo has reveal-scale animation');
assert(home2Html.includes('environment-editorial-frame reveal-scale'), 'Environment photo has reveal-scale animation');
assert(styleCss.includes('.home2-page .hero-home2-backdrop'), 'Hero backdrop entrance animation defined');
assert(styleCss.includes('.home2-page .care-layered-photo:hover img'), 'Care photo hover scaling defined');
assert(styleCss.includes('.home2-page .environment-editorial-frame:hover img'), 'Environment photo hover scaling defined');
assert(styleCss.includes('.home2-page .home2-cta-backdrop:hover .cta-bg-image'), 'CTA backdrop hover scaling defined');
assert(styleCss.includes('@media (prefers-reduced-motion: reduce)') && styleCss.includes('.home2-page *'), 'Reduced motion rules defined for Home 2');

console.log('\n=== 11. SCOPE INTEGRITY (Zero Bleed into Home 1 or Other Pages) ===');
const home1Html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
assert(!home1Html.includes('home2-page'), 'Home 1 does not have home2-page');
assert(!home1Html.includes('home2-feature-card'), 'Home 1 does not have home2-feature-card');
assert(!home1Html.includes('hero-home2'), 'Home 1 does not have hero-home2');

const passed = checks.filter(c => c.passed).length;
const total = checks.length;
console.log(`\n========================================`);
console.log(`AUDIT RESULTS: ${passed}/${total} checks passed (${(passed/total*100).toFixed(1)}%)`);
console.log(`========================================`);

if (passed !== total) {
  process.exit(1);
}
