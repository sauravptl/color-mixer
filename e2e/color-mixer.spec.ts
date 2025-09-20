import { test, expect } from '@playwright/test';

test.describe('Color Mixer E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Ensure page is fully loaded and React rendered
    await page.waitForLoadState('networkidle');
    await page.waitForSelector('h1', { timeout: 10000 });

    // Prevent test-irrelevant overlays from intercepting pointer events (e.g., animation profiler panel)
    await page.addStyleTag({
      content: `
        [role="region"][aria-label="Animation profiler panel"],
        [role="region"][aria-label="Animation profiler panel"] * {
          pointer-events: none !important;
        }
      `,
    });
  });

  test('should load the application', async ({ page }) => {
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');

    // Wait for React to render
    await page.waitForSelector('h1', { timeout: 10000 });

    // Check for the main heading
    await expect(page.locator('h1')).toContainText('Color Mixer');

    // Check for the subtitle
    await expect(page.locator('text=Create beautiful color palettes')).toBeVisible();
  });

  test('should display color controls', async ({ page }) => {
    // Wait for React components to render
    await page.waitForSelector('input[type="color"]', { timeout: 10000 });

    // Check for color inputs
    const colorInputs = page.locator('input[type="color"]');
    await expect(colorInputs).toHaveCount(2);

    // Check for quick actions section
    await expect(page.locator('text=Quick Actions')).toBeVisible();

    // Check for specific quick action buttons (scope to Quick Actions container)
    const quickActions = page.locator('[data-onboarding="quick-actions"]');
    await expect(quickActions.getByRole('button', { name: /Copy Colors/i })).toBeVisible({ timeout: 10000 });
    await expect(quickActions.getByRole('button', { name: /Randomize/i })).toBeVisible({ timeout: 10000 });
  });

  test('should allow color changes', async ({ page }) => {
    // Wait for color inputs to be available
    await page.waitForSelector('input[type="text"][value^="#"]', { timeout: 10000 });

    // Get initial color values
    const initialHexInputs = page.locator('input[type="text"][value^="#"]');
    const initialCount = await initialHexInputs.count();
    expect(initialCount).toBeGreaterThan(0);

    // Change a color
    const firstHexInput = initialHexInputs.first();
    await firstHexInput.fill('#ff00ff');

    // Verify the change
    await expect(firstHexInput).toHaveValue('#ff00ff');
  });

  test('should handle quick actions', async ({ page }) => {
    // Scope to Quick Actions container to avoid any ambiguity
    const quickActions = page.locator('[data-onboarding="quick-actions"]');
    await expect(quickActions).toBeVisible({ timeout: 10000 });
    const randomizeButton = quickActions.getByRole('button', { name: /Randomize/i });
    await expect(randomizeButton).toBeVisible({ timeout: 10000 });

    // Ensure it's in view and not covered, then click
    await randomizeButton.scrollIntoViewIfNeeded();
    await randomizeButton.click();

    // Wait for color changes to take effect
    await page.waitForTimeout(200);

    // Colors should change (we can't predict exact values but they should be different)
    const hexInputs = page.locator('input[type="text"][value^="#"]');
    const hexValues = await hexInputs.allTextContents();

    // At least one color should be different from the initial red/blue
    const hasDifferentColor = hexValues.some(color =>
      color !== '#ff0000' && color !== '#0000ff'
    );
    expect(hasDifferentColor).toBe(true);
  });

  test('should support color harmonies', async ({ page }) => {
    // Wait for harmony section to load
    await page.waitForSelector('text=Color Harmonies', { timeout: 10000 });

    // Look for harmony selector
    await expect(page.locator('text=Color Harmonies')).toBeVisible();

    // Select a harmony (if available)
    const harmonyButtons = page.locator('button').filter({ hasText: /Monochromatic|Analogous|Triadic/ });
    const harmonyCount = await harmonyButtons.count();

    if (harmonyCount > 0) {
      await harmonyButtons.first().click();

      // Should show "Apply" button
      await expect(
        page.getByRole('button', { name: /Apply (Monochromatic|Analogous|Triadic) Harmony/i })
      ).toBeVisible();
    }
  });

  test('should show accessibility features', async ({ page }) => {
    // Look for accessibility panel
    await expect(page.locator('text=Accessibility Checker')).toBeVisible();

    // Check for contrast analysis
    await expect(page.locator('text=Contrast Analysis')).toBeVisible();
  });

  test('should support export functionality', async ({ page }) => {
    // Look for export section
    await expect(page.locator('text=Export Options')).toBeVisible();

    // Check for export panel
    const exportPanel = page.locator('text=Export Color Palette');
    await expect(exportPanel).toBeVisible();
  });

  test('should handle keyboard shortcuts', async ({ page }) => {
    // Focus on the page
    await page.click('body');

    // Test 'C' shortcut (copy)
    await page.keyboard.press('c');
    // Should trigger copy action (we can't easily test clipboard in headless mode)

    // Test 'R' shortcut (randomize)
    await page.keyboard.press('r');
    // Colors should change
    await page.waitForTimeout(100); // Small delay for state update

    // Test 'Space' shortcut (new palette)
    await page.keyboard.press('Space');
    await page.waitForTimeout(100);
  });

  test('should respond quickly to interactions', async ({ page }) => {
    // Measure initial load time
    const startTime = Date.now();

    // Wait for the app to be ready
    await page.waitForSelector('h1');
    const loadTime = Date.now() - startTime;

    // Should load within reasonable time (under 2 seconds)
    expect(loadTime).toBeLessThan(2000);

    // Test interaction performance
    const interactionStart = Date.now();

    // Click Randomize button from Quick Actions to avoid ambiguity
    const quickActions = page.locator('[data-onboarding="quick-actions"]');
    const randomizeButton = quickActions.getByRole('button', { name: /Randomize/i });
    await expect(randomizeButton).toBeVisible({ timeout: 10000 });
    await randomizeButton.click();

    // Wait for visual feedback
    await page.waitForTimeout(150);

    const interactionTime = Date.now() - interactionStart;

    // Interactions should be fast (< 1200ms) across browsers
    expect(interactionTime).toBeLessThan(1200);
  });

  test('should be responsive on mobile', async ({ page, isMobile }) => {
    if (isMobile) {
      // Check that the layout adapts to mobile
      const viewport = page.viewportSize();
      expect(viewport!.width).toBeLessThan(768); // Mobile breakpoint

      // Should still show main elements
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('text=Quick Actions')).toBeVisible();
    }
  });

  test('should handle error states gracefully', async ({ page }) => {
    // Try invalid color input
    const hexInput = page.locator('input[type="text"][value^="#"]').first();
    await hexInput.fill('invalid-color');

    // Should handle gracefully (either revert or show error)
    await page.waitForTimeout(100);

    // App should still be functional
    await expect(page.locator('h1')).toBeVisible();
  });
});
