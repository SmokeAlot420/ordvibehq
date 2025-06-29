import { test, expect } from '@playwright/test';

test.describe('Mobile Test Tube Centering', () => {
  test('test tube should be centered on mobile viewport', async ({ page }) => {
    // Navigate to the site
    await page.goto('http://localhost:5173');
    
    // Set mobile viewport (iPhone 12 dimensions)
    await page.setViewportSize({ width: 390, height: 844 });
    
    // Wait for the test tube to be visible
    await page.waitForSelector('.relative.inline-block.cursor-pointer');
    
    // Get the test tube container
    const testTube = await page.locator('.relative.inline-block.cursor-pointer').first();
    
    // Get the parent container (h1)
    const parentContainer = await page.locator('h1').first();
    
    // Get bounding boxes
    const testTubeBounds = await testTube.boundingBox();
    const parentBounds = await parentContainer.boundingBox();
    
    if (testTubeBounds && parentBounds) {
      // Calculate center positions
      const testTubeCenter = testTubeBounds.x + (testTubeBounds.width / 2);
      const parentCenter = parentBounds.x + (parentBounds.width / 2);
      
      // Log the positions for debugging
      console.log('Test Tube Center:', testTubeCenter);
      console.log('Parent Center:', parentCenter);
      console.log('Difference:', Math.abs(testTubeCenter - parentCenter));
      
      // Take a screenshot for visual verification
      await page.screenshot({ path: 'mobile-test-tube-before.png' });
      
      // Check if centered (within 5px tolerance)
      expect(Math.abs(testTubeCenter - parentCenter)).toBeLessThan(5);
    }
  });
  
  test('test tube should be centered on desktop viewport', async ({ page }) => {
    // Navigate to the site
    await page.goto('http://localhost:5173');
    
    // Set desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 });
    
    // Wait for the test tube to be visible
    await page.waitForSelector('.relative.inline-block.cursor-pointer');
    
    // Get the test tube container
    const testTube = await page.locator('.relative.inline-block.cursor-pointer').first();
    
    // Get the parent container (h1)
    const parentContainer = await page.locator('h1').first();
    
    // Get bounding boxes
    const testTubeBounds = await testTube.boundingBox();
    const parentBounds = await parentContainer.boundingBox();
    
    if (testTubeBounds && parentBounds) {
      // Calculate center positions
      const testTubeCenter = testTubeBounds.x + (testTubeBounds.width / 2);
      const parentCenter = parentBounds.x + (parentBounds.width / 2);
      
      // Log the positions for debugging
      console.log('Test Tube Center:', testTubeCenter);
      console.log('Parent Center:', parentCenter);
      console.log('Difference:', Math.abs(testTubeCenter - parentCenter));
      
      // Take a screenshot for visual verification
      await page.screenshot({ path: 'desktop-test-tube-before.png' });
      
      // Check if centered (within 5px tolerance)
      expect(Math.abs(testTubeCenter - parentCenter)).toBeLessThan(5);
    }
  });
});