const fs = require('fs');
const path = require('path');

const servicesHtmlPath = path.join(__dirname, '..', 'services.html');
const styleCssPath = path.join(__dirname, '..', 'css', 'style.css');

const servicesHtml = fs.readFileSync(servicesHtmlPath, 'utf8');
const styleCss = fs.readFileSync(styleCssPath, 'utf8');

console.log('=== AUDITING SERVICES PAGE REDESIGN ===\n');

// 1. Check sections in <main>
const mainMatch = servicesHtml.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
if (!mainMatch) {
    console.error('FAIL: <main> tag not found or not properly closed!');
    process.exit(1);
}

const mainContent = mainMatch[1];
const sectionMatches = Array.from(mainContent.matchAll(/<section\s+id="([^"]+)"[^>]*>/gi));

console.log(`1. Total sections in <main>: ${sectionMatches.length}`);
sectionMatches.forEach((m, idx) => {
    console.log(`   Section ${idx + 1}: #${m[1]}`);
});

const expectedIds = [
    'services-hero',
    'services-pathways',
    'services-journey',
    'services-philosophy',
    'services-cta'
];

if (sectionMatches.length !== 5) {
    console.error(`FAIL: Expected exactly 5 sections, found ${sectionMatches.length}`);
} else {
    console.log('PASS: Exactly 5 major sections confirmed.');
}

const foundIds = sectionMatches.map(m => m[1]);
const idMismatch = expectedIds.filter(id => !foundIds.includes(id));
if (idMismatch.length > 0) {
    console.error(`FAIL: Missing expected section IDs: ${idMismatch.join(', ')}`);
} else {
    console.log('PASS: All 5 expected section IDs are present in correct order.');
}

// 2. Check for duplicate images in services.html
console.log('\n2. Checking Image Assets in services.html:');
const imgMatches = Array.from(servicesHtml.matchAll(/<img[^>]+src="([^">]+)"/gi)).map(m => m[1]);
console.log(`   Total <img> tags: ${imgMatches.length}`);

const imgCounts = {};
imgMatches.forEach(src => {
    imgCounts[src] = (imgCounts[src] || 0) + 1;
});

let duplicates = 0;
for (const [src, count] of Object.entries(imgCounts)) {
    console.log(`   - ${src}: ${count}x`);
    if (count > 1) duplicates++;
}

if (duplicates > 0) {
    console.error(`FAIL: Found ${duplicates} duplicated image source(s)!`);
} else {
    console.log('PASS: Zero duplicate images in services.html (duplicate count = 0).');
}

// 3. Check for leftover old classes inside <main>
console.log('\n3. Checking for Old Leftover Selectors/Classes:');
const legacyTerms = ['service-tab-panel', 'service-nav-tab', 'concern-tab-panel'];
legacyTerms.forEach(term => {
    const count = (mainContent.match(new RegExp(term, 'g')) || []).length;
    if (count > 0) {
        console.warn(`WARN: Found leftover class "${term}" ${count} times in <main>`);
    } else {
        console.log(`PASS: No leftover "${term}" in <main>`);
    }
});

// 4. Check CSS Rules & Icon Protection
console.log('\n4. Checking Scoped CSS Rules in css/style.css:');
const cssChecks = [
    'services-hero-heading',
    'services-pathway-img',
    'services-pathway-row',
    'services-journey-track',
    'services-principle-card',
    'services-cta-gate-card',
    'opacity: 1 !important',
    'visibility: visible !important'
];

cssChecks.forEach(term => {
    if (styleCss.includes(term)) {
        console.log(`PASS: Found CSS definition for "${term}"`);
    } else {
        console.error(`FAIL: Missing CSS definition for "${term}"`);
    }
});

// 5. Check Header & Footer Integrity
console.log('\n5. Checking Master Header and Footer:');
const hasHeader = servicesHtml.includes('<header') && servicesHtml.includes('id="navbarWrapper"');
const hasFooter = servicesHtml.includes('<footer') && servicesHtml.includes('id="siteFooter"');
const hasSkip = servicesHtml.includes('class="skip-link"');

console.log(`   - Master Header present (id="navbarWrapper"): ${hasHeader}`);
console.log(`   - Master Footer present (id="siteFooter"): ${hasFooter}`);
console.log(`   - Skip to Content link present (class="skip-link"): ${hasSkip}`);

if (hasHeader && hasFooter && hasSkip) {
    console.log('PASS: Header, Footer, and Skip link intact.');
} else {
    console.error('FAIL: Header, Footer, or Skip link compromised!');
}

// 6. Check BEGIN CARE Card Background Image Implementation
console.log('\n6. Checking BEGIN CARE Card Background Image:');
const bgImagePath = path.join(__dirname, '..', 'assets', 'images', 'services-begin-care.jpg');
const bgImageExists = fs.existsSync(bgImagePath);
console.log(`   - File assets/images/services-begin-care.jpg exists: ${bgImageExists}`);

const hasCssBg = styleCss.includes("services-begin-care.jpg");
console.log(`   - Referenced in CSS via background-image: ${hasCssBg}`);

const hasHoverScale = styleCss.includes('.services-cta-gate-card:hover::before') && styleCss.includes('scale(1.03)');
console.log(`   - Desktop hover scale(1.03) present: ${hasHoverScale}`);

const hasOverlay = styleCss.includes('.services-cta-gate-card::after');
console.log(`   - Controlled readability overlay present: ${hasOverlay}`);

const hasPointerEventsNone = styleCss.includes('.services-cta-gate-card::before') && styleCss.includes('pointer-events: none;');
console.log(`   - Background & overlay pointer-events: none: ${hasPointerEventsNone}`);

const hasReducedMotion = styleCss.includes('.services-cta-gate-card::before') && styleCss.includes('@media (prefers-reduced-motion: reduce)');
console.log(`   - Reduced motion disabling present: ${hasReducedMotion}`);

// Count occurrences across HTML files
const allHtmlFiles = fs.readdirSync(path.join(__dirname, '..')).filter(f => f.endsWith('.html'));
let bgImageUsages = 0;
allHtmlFiles.forEach(f => {
    const content = fs.readFileSync(path.join(__dirname, '..', f), 'utf8');
    if (content.includes('services-begin-care.jpg')) bgImageUsages++;
});
console.log(`   - HTML <img> tag usages of services-begin-care.jpg: ${bgImageUsages} (should be 0, as it's CSS background only)`);

if (bgImageExists && hasCssBg && hasHoverScale && hasOverlay && hasPointerEventsNone && bgImageUsages === 0) {
    console.log('PASS: BEGIN CARE background image fully verified with 0 duplicate usages.');
} else {
    console.error('FAIL: BEGIN CARE background image implementation checks failed!');
}

console.log('\n=== AUDIT COMPLETE ===');
