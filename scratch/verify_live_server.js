const http = require('http');

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, body: data, headers: res.headers }));
    }).on('error', reject);
  });
}

async function verify() {
  console.log('--- Fetching Live HTTP Assets ---');
  const page = await fetchUrl('http://127.0.0.1:3847/index.html');
  console.log(`index.html: Status ${page.status}, Size ${page.body.length} bytes`);

  const css = await fetchUrl('http://127.0.0.1:3847/css/style.css');
  console.log(`css/style.css: Status ${css.status}, Size ${css.body.length} bytes`);

  const motion = await fetchUrl('http://127.0.0.1:3847/css/motion.css');
  console.log(`css/motion.css: Status ${motion.status}, Size ${motion.body.length} bytes`);

  console.log('\n--- Verifying Section by Section Typography on Live Response ---');

  // Section 01
  const hasHeroTitle = page.body.includes('id="hero-title"');
  const hasHeroCSS = css.body.includes('#hero-title') && css.body.includes('3.75rem !important; /* ~60px desktop');
  console.log(`Section 01 Hero Title: ${hasHeroTitle && hasHeroCSS ? 'VALID' : 'INVALID'}`);

  // Section 02
  const hasIntroStatement = page.body.includes('class="sleep-intro-statement"');
  const hasCardTitle = css.body.includes('.sleep-indication-card .card-title') && css.body.includes('1.22rem; /* ~19.5px desktop');
  const hasCardDesc = css.body.includes('.sleep-indication-card .card-desc') && css.body.includes('0.97rem; /* ~15.5px desktop');
  console.log(`Section 02 Indication Cards: ${hasIntroStatement && hasCardTitle && hasCardDesc ? 'VALID' : 'INVALID'}`);

  // Section 03
  const hasScopeTitle = css.body.includes('.scope-row-title') && css.body.includes('1.22rem; /* ~19.5px');
  const hasScopeDesc = css.body.includes('.scope-row-desc') && css.body.includes('0.97rem; /* ~15.5px desktop');
  console.log(`Section 03 Scope Navigator: ${hasScopeTitle && hasScopeDesc ? 'VALID' : 'INVALID'}`);

  // Section 04
  const hasPathwayTitles = page.body.includes('class="timeline-step-title"') && css.body.includes('1.2rem !important; /* ~19.2px desktop');
  const hasPathwayDescs = page.body.includes('class="timeline-step-desc"') && css.body.includes('0.97rem !important; /* ~15.5px desktop');
  const hasPathwayNums = page.body.includes('class="step-marker-num"') && css.body.includes('0.8125rem !important; /* ~13px restrained');
  console.log(`Section 04 Clinical Pathway: ${hasPathwayTitles && hasPathwayDescs && hasPathwayNums ? 'VALID' : 'INVALID'}`);

  // Section 05
  const hasSpecialistTitles = page.body.includes('class="specialist-comp-title"') && css.body.includes('1.18rem !important; /* ~18.8px desktop');
  const hasSpecialistDescs = page.body.includes('class="specialist-comp-desc"') && css.body.includes('0.97rem !important; /* ~15.5px desktop');
  console.log(`Section 05 Specialists: ${hasSpecialistTitles && hasSpecialistDescs ? 'VALID' : 'INVALID'}`);

  // Section 06
  const hasCtaTitle = page.body.includes('id="cta-title" class="home1-section-heading');
  const hasCtaBadges = page.body.includes('cta-trust-badge') && css.body.includes('0.875rem !important; /* ~14px (target 13-15px)');
  console.log(`Section 06 Final CTA: ${hasCtaTitle && hasCtaBadges ? 'VALID' : 'INVALID'}`);

  // Supporting paragraphs
  const supportingParagraphsCount = (page.body.match(/home1-supporting-paragraph/g) || []).length;
  console.log(`Home 1 Supporting Paragraphs assigned: ${supportingParagraphsCount} occurrences`);

  // Eyebrows
  const eyebrowsCount = (page.body.match(/home1-eyebrow/g) || []).length;
  console.log(`Home 1 Eyebrows assigned: ${eyebrowsCount} occurrences`);
}

verify();
