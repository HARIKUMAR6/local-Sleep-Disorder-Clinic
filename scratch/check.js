const fs = require('fs');
const files = [
  'index.html',
  'home2.html',
  'about.html',
  'services.html',
  'doctors.html',
  'faq.html',
  'contact.html',
  'booking.html',
  'specialists.html'
];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf-8');
  const heroMatch = content.match(/id="([^"]*hero[^"]*)"/i);
  console.log(f.padEnd(18), '-> Hero Element ID:', heroMatch ? heroMatch[1] : 'NOT FOUND');
});
