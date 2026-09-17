const http = require('http');

http.get('http://127.0.0.1:3847/about.html', res => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    console.log('HTTP Status:', res.statusCode);
    console.log('Body length:', data.length);
    console.log('Contains about-hero:', data.includes('id="about-hero"'));
    console.log('Contains about-approach:', data.includes('id="about-approach"'));
    console.log('Contains about-philosophy:', data.includes('id="about-philosophy"'));
    console.log('Contains about-experience:', data.includes('id="about-experience"'));
    console.log('Contains about-cta:', data.includes('id="about-cta"'));
  });
}).on('error', err => console.error('Error fetching about.html:', err.message));
