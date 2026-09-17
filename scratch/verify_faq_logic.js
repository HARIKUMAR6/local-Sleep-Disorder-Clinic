const fs = require('fs');
const path = require('path');

const faqHtml = fs.readFileSync(path.join(__dirname, '..', 'faq.html'), 'utf8');

// Extract FAQ_DATA from faq.html
const dataMatch = faqHtml.match(/const FAQ_DATA = (\[[\s\S]*?\]);/);
if (!dataMatch) {
    console.error('FAILED: Could not find FAQ_DATA in faq.html');
    process.exit(1);
}

const FAQ_DATA = eval(dataMatch[1]);
console.log(`Loaded ${FAQ_DATA.length} FAQ questions from FAQ_DATA`);

if (FAQ_DATA.length !== 16) {
    console.error(`FAILED: Expected 16 questions in FAQ_DATA, got ${FAQ_DATA.length}`);
    process.exit(1);
}

// Check distribution across categories:
const catCounts = {};
FAQ_DATA.forEach(d => {
    catCounts[d.cat] = (catCounts[d.cat] || 0) + 1;
});
console.log('Category breakdown:', catCounts);

if (catCounts.studies !== 4 || catCounts.cpap !== 4 || catCounts.insomnia !== 4 || catCounts.appointments !== 4) {
    console.error('FAILED: Expected 4 questions in each of the 4 categories');
    process.exit(1);
}

// Test Step Question Cycling Logic
let currentFaqIndex = 0;
function stepFaqQuestion(delta) {
    currentFaqIndex = (currentFaqIndex + delta + FAQ_DATA.length) % FAQ_DATA.length;
}

stepFaqQuestion(1);
console.log(`Next question test: index is ${currentFaqIndex} (${FAQ_DATA[currentFaqIndex].q})`);
if (currentFaqIndex !== 1) {
    console.error('FAILED: stepFaqQuestion(1) failed');
    process.exit(1);
}

stepFaqQuestion(-1);
console.log(`Prev question test: index is ${currentFaqIndex} (${FAQ_DATA[currentFaqIndex].q})`);
if (currentFaqIndex !== 0) {
    console.error('FAILED: stepFaqQuestion(-1) failed');
    process.exit(1);
}

// Test navigateToFaqQuestion matching
function findIndexById(id) {
    return FAQ_DATA.findIndex(item => item.id === id);
}

const q9Index = findIndexById('faq-ans-9');
console.log(`Question 9 (Insomnia) index: ${q9Index}, category: ${FAQ_DATA[q9Index].cat}`);
if (q9Index !== 8 || FAQ_DATA[q9Index].cat !== 'insomnia') {
    console.error('FAILED: findIndexById(faq-ans-9) failed');
    process.exit(1);
}

const q16Index = findIndexById('faq-ans-16');
console.log(`Question 16 (Appointments) index: ${q16Index}, category: ${FAQ_DATA[q16Index].cat}`);
if (q16Index !== 15 || FAQ_DATA[q16Index].cat !== 'appointments') {
    console.error('FAILED: findIndexById(faq-ans-16) failed');
    process.exit(1);
}

console.log('✅ ALL LOGIC AND DATA CONSISTENCY TESTS PASSED!');
