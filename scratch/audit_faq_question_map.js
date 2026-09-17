const fs = require('fs');
const path = require('path');

const faqHtmlPath = path.join(__dirname, '..', 'faq.html');
const styleCssPath = path.join(__dirname, '..', 'css', 'style.css');

const faqHtml = fs.readFileSync(faqHtmlPath, 'utf8');
const styleCss = fs.readFileSync(styleCssPath, 'utf8');

console.log('=== FAQ QUESTION MAP AUDIT ===\n');

// 1. Verify exact 5 major sections in faq.html
const sectionRegex = /<section\s+[^>]*id=["']([^"']+)["'][^>]*>/g;
let match;
const sections = [];
while ((match = sectionRegex.exec(faqHtml)) !== null) {
    sections.push(match[1]);
}
console.log('Detected Sections (' + sections.length + '):', sections);
if (sections.length === 5 &&
    sections[0] === 'faq-hero' &&
    sections[1] === 'faq-navigator' &&
    sections[2] === 'faq-answers' &&
    sections[3] === 'faq-before-visit' &&
    sections[4] === 'faq-cta') {
    console.log('✅ PASS: Exactly 5 major sections preserved in correct order.');
} else {
    console.error('❌ FAIL: Expected 5 sections (faq-hero, faq-navigator, faq-answers, faq-before-visit, faq-cta), got:', sections);
    process.exit(1);
}

// 2. Check for duplicate image usage
const imgMatches = [...faqHtml.matchAll(/<img[^>]+src=["']([^"']+)["']/g)].map(m => m[1]);
console.log('\nImages in faq.html (' + imgMatches.length + '):', imgMatches);
const imgCounts = {};
imgMatches.forEach(src => {
    imgCounts[src] = (imgCounts[src] || 0) + 1;
});
let hasDuplicateImg = false;
for (const [src, count] of Object.entries(imgCounts)) {
    if (count > 1) {
        console.error(`❌ FAIL: Duplicate image detected: ${src} used ${count} times!`);
        hasDuplicateImg = true;
    }
}
if (!hasDuplicateImg) {
    console.log('✅ PASS: Zero duplicate images on faq.html. (Each image used <= 1 time).');
} else {
    process.exit(1);
}

// 3. Verify Question Map elements in #faq-navigator
console.log('\nVerifying #faq-navigator Question Map Structure:');
const navSectionMatch = faqHtml.match(/<section id="faq-navigator"[\s\S]*?<\/section>/);
if (!navSectionMatch) {
    console.error('❌ FAIL: #faq-navigator not found.');
    process.exit(1);
}
const navHtml = navSectionMatch[0];

const requiredStrings = [
    'TOPIC NAVIGATOR',
    'What Would You Like to Know?',
    'Start with a topic to explore the questions people commonly have about sleep care.',
    '01',
    'SLEEP STUDIES',
    'fa-wave-square',
    '02',
    'CPAP &amp; SLEEP APNEA CARE',
    'fa-lungs',
    '03',
    'INSOMNIA &amp; SLEEP HABITS',
    'fa-moon',
    '04',
    'APPOINTMENTS &amp; FOLLOW-UP',
    'fa-calendar-check',
    'faq-qmap-panel-studies',
    'faq-qmap-panel-cpap',
    'faq-qmap-panel-insomnia',
    'faq-qmap-panel-appointments',
    'QUESTIONS',
    'navigateToFaqQuestion'
];

let allStringsFound = true;
requiredStrings.forEach(str => {
    if (!navHtml.includes(str)) {
        console.error(`❌ FAIL: Missing required element/string: "${str}"`);
        allStringsFound = false;
    }
});
if (allStringsFound) {
    console.log('✅ PASS: All required Question Map topics, headings, icons, panels, and callbacks present.');
} else {
    process.exit(1);
}

// 4. Verify CSS rules in style.css
console.log('\nVerifying Scoped CSS:');
const requiredCss = [
    '#faq-navigator h2',
    'clamp(2.25rem, 4vw, 3.375rem)',
    '.faq-qmap-topic-row',
    '.faq-qmap-indicator',
    '.faq-qmap-preview-container',
    '.faq-qmap-panel',
    '.faq-qmap-question-item',
    '[dir="rtl"] .faq-qmap-topic-row',
    '[dir="rtl"] .faq-qmap-question-item',
    '#faq-navigator i'
];
let allCssFound = true;
requiredCss.forEach(cssRule => {
    if (!styleCss.includes(cssRule)) {
        console.error(`❌ FAIL: Missing required CSS rule: "${cssRule}"`);
        allCssFound = false;
    }
});
if (allCssFound) {
    console.log('✅ PASS: All required scoped CSS rules, typography clamp, RTL, and icon visibility rules present.');
} else {
    process.exit(1);
}

// 5. Verify Script Syntax in faq.html
console.log('\nValidating Embedded Scripts:');
const scriptMatches = [...faqHtml.matchAll(/<script>([\s\S]*?)<\/script>/g)];
let scriptError = false;
scriptMatches.forEach((m, idx) => {
    try {
        new Function(m[1]);
    } catch (e) {
        console.error(`❌ FAIL: JavaScript syntax error in script block ${idx}:`, e.message);
        scriptError = true;
    }
});
if (!scriptError) {
    console.log('✅ PASS: All script blocks in faq.html have valid JavaScript syntax.');
} else {
    process.exit(1);
}

console.log('\n✨ ALL AUDIT CHECKS PASSED SUCCESSFULLY! ✨');
