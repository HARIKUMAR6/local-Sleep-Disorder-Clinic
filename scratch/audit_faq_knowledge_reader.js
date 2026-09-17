const fs = require('fs');
const path = require('path');

const faqPath = path.join(__dirname, '..', 'faq.html');
const cssPath = path.join(__dirname, '..', 'css', 'style.css');

const faqHtml = fs.readFileSync(faqPath, 'utf8');
const cssText = fs.readFileSync(cssPath, 'utf8');

let errors = [];

// 1. Check exactly 5 major sections in faq.html
const sectionMatches = faqHtml.match(/<section\b[^>]*id="([^"]+)"/g) || [];
const sectionIds = sectionMatches.map(m => m.match(/id="([^"]+)"/)[1]);

console.log(`Found ${sectionIds.length} sections in faq.html:`, sectionIds);

if (sectionIds.length !== 5) {
    errors.push(`Expected exactly 5 sections in faq.html, found ${sectionIds.length}: ${sectionIds.join(', ')}`);
}

const expectedSections = ['faq-hero', 'faq-navigator', 'faq-answers', 'faq-before-visit', 'faq-cta'];
expectedSections.forEach(id => {
    if (!sectionIds.includes(id)) {
        errors.push(`Missing expected section id: ${id}`);
    }
});

// 2. Check Section 03 Introduction Eyebrow, Heading, and Copy
if (!faqHtml.includes('CLINICAL KNOWLEDGE')) {
    errors.push('Missing eyebrow: CLINICAL KNOWLEDGE');
}
if (!faqHtml.includes('Clear Answers to Common Sleep Questions.')) {
    errors.push('Missing heading: Clear Answers to Common Sleep Questions.');
}
if (!faqHtml.includes('Explore practical information about sleep evaluation, treatment, appointments, and ongoing care.')) {
    errors.push('Missing supporting copy');
}

// 3. Check All 16 Questions in Left Index
for (let i = 1; i <= 16; i++) {
    if (!faqHtml.includes(`id="faq-index-item-${i}"`)) {
        errors.push(`Missing Question Index button for question ${i} (faq-index-item-${i})`);
    }
}

// 4. Check All 16 Questions and Answers in JavaScript FAQ_DATA
for (let i = 1; i <= 16; i++) {
    if (!faqHtml.includes(`id: "faq-ans-${i}"`)) {
        errors.push(`Missing id: "faq-ans-${i}" in FAQ_DATA`);
    }
}

// Check key medical answers verbatim
const sampleAnswers = [
    'A sleep study (such as overnight in-lab polysomnography or home sleep apnea testing) evaluates physiologic signals during sleep',
    'Continuous Positive Airway Pressure delivers a steady, calibrated stream of gentle, filtered air through a mask interface',
    'Sharing your sleep onset latency (how long it takes to fall asleep)',
    'You can request an evaluation directly through our online consultation modal, our website contact form'
];

sampleAnswers.forEach((ans, idx) => {
    if (!faqHtml.includes(ans)) {
        errors.push(`Sample medical answer ${idx + 1} was modified or is missing!`);
    }
});

// 5. Check Category Icons in HTML and CSS
const requiredIcons = ['fa-wave-square', 'fa-lungs', 'fa-moon', 'fa-calendar-check', 'fa-arrow-right', 'fa-arrow-left'];
requiredIcons.forEach(icon => {
    if (!faqHtml.includes(icon)) {
        errors.push(`Missing required icon: ${icon} in faq.html`);
    }
});

// 6. Check Bulletproof Icon Visibility in CSS
if (!cssText.includes('#faq-answers i') || !cssText.includes('opacity: 1 !important') || !cssText.includes('visibility: visible !important')) {
    errors.push('Missing bulletproof icon visibility guarantees for #faq-answers in style.css');
}

// 7. Check Typography Clamps in CSS
if (!cssText.includes('.faq-reader-heading') || !cssText.includes('.faq-reader-question-title') || !cssText.includes('.faq-reader-answer-text')) {
    errors.push('Missing scoped typography clamp classes in style.css');
}

// 8. Check Navigation Bridge Functions
if (!faqHtml.includes('function navigateToFaqQuestion(targetAnsId, category)') || !faqHtml.includes('function scrollToFaqCategory(category)')) {
    errors.push('Missing bridge functions navigateToFaqQuestion or scrollToFaqCategory');
}
if (!faqHtml.includes('function selectFaqQuestion(index') || !faqHtml.includes('function stepFaqQuestion(delta)')) {
    errors.push('Missing Knowledge Reader navigation functions selectFaqQuestion or stepFaqQuestion');
}

// 9. Check Accessibility Attributes
if (!faqHtml.includes('role="tablist"') || !faqHtml.includes('role="tab"') || !faqHtml.includes('aria-selected') || !faqHtml.includes('aria-live="polite"')) {
    errors.push('Missing ARIA accessibility roles or live regions');
}

// 10. Check Reduced Motion & RTL support in CSS
if (!cssText.includes('[dir="rtl"] .faq-reader-item') || !cssText.includes('.faq-reader-content.animating')) {
    errors.push('Missing RTL or animation transition styles in style.css');
}

if (errors.length === 0) {
    console.log('✅ ALL 10 FAQ KNOWLEDGE READER AUDIT CHECKS PASSED PERFECTLY!');
    process.exit(0);
} else {
    console.error('❌ AUDIT FAILED with errors:\n' + errors.join('\n'));
    process.exit(1);
}
