const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  await page.goto('http://localhost:8093/preview.html', { waitUntil: 'load' });
  await new Promise(r => setTimeout(r, 2000));
  
  // Fill login
  await page.type('input[type="email"]', 'admin@example.com');
  await page.type('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  console.log('Clicked login...');
  await new Promise(r => setTimeout(r, 2000)); // wait for login and transition
  
  console.log('Clicking on BrandKit...');
  await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const btn = btns.find(b => b.textContent.includes('品牌套件'));
      if (btn) btn.click();
  });
  
  await new Promise(r => setTimeout(r, 2000));
  
  console.log('Clicking on Material (材质) card...');
  await page.evaluate(() => {
      const h3s = Array.from(document.querySelectorAll('h3'));
      const mat = h3s.find(h => h.textContent.includes('材质'));
      if (mat && mat.parentElement) mat.parentElement.click();
  });
  
  await new Promise(r => setTimeout(r, 2000));
  
  await browser.close();
})();