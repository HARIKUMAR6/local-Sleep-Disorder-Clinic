const fs = require('fs');
const path = require('path');

const servicesHtmlPath = path.join(__dirname, '..', 'services.html');
const styleCssPath = path.join(__dirname, '..', 'css', 'style.css');

const servicesHtml = fs.readFileSync(servicesHtmlPath, 'utf8');
const styleCss = fs.readFileSync(styleCssPath, 'utf8');

console.log('=== SERVICES TYPOGRAPHY, ICON & MOTION AUDIT ===\n');

// 1. Verify exact 5 major sections
const mainMatch = servicesHtml.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
if (!mainMatch) {
    console.error('❌ FAIL: <main> tag not found or not properly closed!');
    process.exit(1);
}

const sectionMatches = Array.from(mainMatch[1].matchAll(/<section\s+id="([^"]+)"[^>]*>/gi));
console.log(`1. Sections in <main> (${sectionMatches.length}):`);
sectionMatches.forEach((m, idx) => console.log(`   - Section ${idx + 1}: #${m[1]}`));

const expectedIds = [
    'services-hero',
    'services-pathways',
    'services-journey',
    'services-philosophy',
    'services-cta'
];

if (sectionMatches.length === 5 && expectedIds.every((id, idx) => sectionMatches[idx][1] === id)) {
    console.log('✅ PASS: Exactly 5 major sections preserved in correct order.');
} else {
    console.error('❌ FAIL: Sections mismatch expected:', expectedIds);
    process.exit(1);
}

// 2. Check for duplicate images in services.html
console.log('\n2. Image Assets in services.html:');
const imgMatches = Array.from(servicesHtml.matchAll(/<img[^>]+src="([^">]+)"/gi)).map(m => m[1]);
const imgCounts = {};
imgMatches.forEach(src => {
    imgCounts[src] = (imgCounts[src] || 0) + 1;
});
let hasDuplicate = false;
for (const [src, count] of Object.entries(imgCounts)) {
    console.log(`   - ${src}: ${count}x`);
    if (count > 1) hasDuplicate = true;
}
if (!hasDuplicate) {
    console.log('✅ PASS: Zero duplicate images on services.html.');
} else {
    console.error('❌ FAIL: Duplicate image found!');
    process.exit(1);
}

// 3. Verify Background Image in CSS for Section 05 Begin Care
console.log('\n3. Verifying Section 05 BEGIN CARE background image:');
if (styleCss.includes("url('../assets/images/services-begin-care.jpg')") ||
    styleCss.includes('url("../assets/images/services-begin-care.jpg")')) {
    console.log('✅ PASS: Background image assets/images/services-begin-care.jpg present in CSS.');
} else {
    console.error('❌ FAIL: Missing background image for services-begin-care in style.css');
    process.exit(1);
}

// 4. Verify Typography Clamp Tokens in style.css
console.log('\n4. Verifying Typography Hierarchy Clamps in style.css:');
const typographyTokens = [
    { label: 'Hero Heading (38-64px)', rule: 'clamp(2.375rem, 4.5vw, 4rem)' },
    { label: 'Hero Paragraph (15-18px)', rule: 'clamp(0.9375rem, 1.2vw, 1.125rem)' },
    { label: 'Section Eyebrow (12-14px)', rule: 'clamp(0.75rem, 0.9vw, 0.875rem)' },
    { label: 'Section Headings (36-58px)', rule: 'clamp(2.25rem, 3.8vw, 3.625rem)' },
    { label: 'Pathway Titles (17-22px)', rule: 'clamp(1.0625rem, 1.4vw, 1.375rem)' },
    { label: 'Pathway Descriptions (14-17px)', rule: 'clamp(0.875rem, 1.1vw, 1.0625rem)' },
    { label: 'Pathway Editorial Numbers', rule: 'clamp(2.5rem, 3.5vw, 3.25rem)' },
    { label: 'Principle Titles (16-21px)', rule: 'clamp(1rem, 1.4vw, 1.3125rem)' },
    { label: 'Principle Numbers', rule: 'clamp(1.75rem, 2vw, 2.25rem)' },
    { label: 'CTA Quote Title', rule: 'clamp(1.375rem, 2vw, 1.875rem)' }
];

let allTokensFound = true;
typographyTokens.forEach(token => {
    if (styleCss.includes(token.rule)) {
        console.log(`   ✅ PASS: ${token.label} found (${token.rule})`);
    } else {
        console.error(`   ❌ FAIL: ${token.label} missing expected rule: ${token.rule}`);
        allTokensFound = false;
    }
});
if (!allTokensFound) process.exit(1);

// 5. Verify Icon Scaling and Containers in style.css
console.log('\n5. Verifying Icon Scaling and Containers in style.css:');
const iconChecks = [
    { label: 'Pathway Icon Container 3rem (48px)', rule: 'width: 3rem; /* Scaled container 48px */' },
    { label: 'Pathway Icon Font Size 1.625rem (26px)', rule: 'font-size: 1.625rem; /* Scaled icon 26px */' },
    { label: 'Journey Icon Box Container 3rem (48px)', rule: 'width: 3rem; /* Scaled container 48px */' },
    { label: 'Journey Icon Font Size 1.5rem (24px)', rule: 'font-size: 1.5rem; /* Scaled icon 24px */' },
    { label: 'Principle Icon Wrapper Container 3.25rem (52px)', rule: 'width: 3.25rem; /* Scaled container 52px */' },
    { label: 'Principle Icon Font Size 1.625rem (26px)', rule: 'font-size: 1.625rem; /* Scaled icon 26px */' },
    { label: 'Pathway Arrow Font Size 1.125rem (18px)', rule: 'font-size: 1.125rem; /* Scaled arrow 18px */' },
    { label: 'Hero Transition Arrow Container (36px)', rule: 'width: 2.25rem;\n  height: 2.25rem;' },
    { label: 'Bulletproof Icon Visibility', rule: 'opacity: 1 !important;\n  visibility: visible !important;\n  display: inline-block !important;' }
];

let allIconsFound = true;
iconChecks.forEach(check => {
    if (styleCss.includes(check.rule)) {
        console.log(`   ✅ PASS: ${check.label}`);
    } else {
        console.error(`   ❌ FAIL: Missing rule for: ${check.label}`);
        allIconsFound = false;
    }
});
if (!allIconsFound) process.exit(1);

// 6. Verify Full Page Animations in style.css & services.html
console.log('\n6. Verifying Full Page Animations & Progressive Drawing:');
const animationChecks = [
    { label: 'Hero Image Hover Scale 1.025', rule: 'transform: scale(1.025);' },
    { label: 'Pathway Row Hover Icon Scale 1.05', rule: '.services-pathway-row:hover .services-pathway-icon {\n  transform: scale(1.05);' },
    { label: 'Journey Track Initial scaleX(0)', rule: 'transform: scaleX(0);' },
    { label: 'Journey Track Active scaleX(1)', rule: '.services-journey-track.active {\n  transform: scaleX(1);' },
    { label: 'Journey Step Hover Icon Scale 1.05', rule: '.services-journey-card:hover .services-journey-icon-box {\n  transform: scale(1.05);' },
    { label: 'Principle Card Hover Icon Scale 1.05', rule: '.services-principle-card:hover .services-principle-icon-wrapper {\n  transform: scale(1.05);' },
    { label: 'Begin Care Background Hover Scale 1.03', rule: 'transform: scale(1.03);' },
    { label: 'Reduced Motion Overrides', rule: '@media (prefers-reduced-motion: reduce)' }
];

let allAnimationsFound = true;
animationChecks.forEach(check => {
    if (styleCss.includes(check.rule)) {
        console.log(`   ✅ PASS: ${check.label}`);
    } else {
        console.error(`   ❌ FAIL: Missing rule for: ${check.label}`);
        allAnimationsFound = false;
    }
});
if (!allAnimationsFound) process.exit(1);

// 7. Validate JavaScript in services.html
console.log('\n7. Validating JavaScript in services.html:');
const scriptMatches = Array.from(servicesHtml.matchAll(/<script>([\s\S]*?)<\/script>/gi));
let jsValid = true;
scriptMatches.forEach((m, idx) => {
    try {
        new Function(m[1]);
        console.log(`   ✅ PASS: Script block ${idx + 1} syntax is valid.`);
    } catch (err) {
        console.error(`   ❌ FAIL: Script block ${idx + 1} syntax error:`, err.message);
        jsValid = false;
    }
});
if (!jsValid) process.exit(1);

console.log('\n✨ ALL 7 AUDIT CHECKS PASSED WITH ZERO ERRORS! ✨');
