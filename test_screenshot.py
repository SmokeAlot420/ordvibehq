from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1280, 'height': 900})
    page.goto('http://localhost:7773')
    page.wait_for_load_state('networkidle')
    page.wait_for_timeout(2000)  # Wait for animations to settle
    page.screenshot(path='E:/v2 repo/alkanes-coming-soon/screenshot.png', full_page=True)
    print("Screenshot saved to screenshot.png")
    browser.close()
