# Generate OG Image

To create the PNG for Twitter:

1. Open https://ordvibehq.com/og-image.html in your browser
2. Take a screenshot (1200x630px)
3. Save as `og-preview.png` in the public folder

Or use a tool like Puppeteer/Playwright:

```bash
# Install puppeteer
npm install puppeteer

# Create screenshot script
node -e "
const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 630 });
  await page.goto('file://${__dirname}/public/og-image.html');
  await page.screenshot({ path: 'public/og-preview.png' });
  await browser.close();
})();
"
```

The image should look like:
- Black background
- Terminal style "> reaction imminent..."
- "an alkanes.experiment( )" below
- Subtle blue glow
- Minimal test tube icon at bottom