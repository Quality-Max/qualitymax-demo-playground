import { test, expect } from '@playwright/test';

/**
 * Navigation Test Suite
 *
 * Tests page navigation, URL changes, and routing functionality.
 *
 * Tags: @smoke @navigation @routing
 */

test.describe('Navigation Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');

    // Add some items to test navigation filters
    const inputField = page.locator('.new-todo');
    await inputField.fill('First task');
    await inputField.press('Enter');
    await inputField.fill('Second task');
    await inputField.press('Enter');
    await inputField.fill('Third task');
    await inputField.press('Enter');

    // Complete one task to test filters
    const firstTodo = page.locator('.todo-list li').first();
    await firstTodo.locator('.toggle').click();
  });

  test('should navigate to All filter @smoke @navigation', async ({ page }) => {
    // Click on All filter
    await page.locator('.filters a[href="#/"]').click();

    // Verify URL
    await expect(page).toHaveURL(/.*#\/$/);

    // Verify all items are visible
    const todoItems = page.locator('.todo-list li');
    await expect(todoItems).toHaveCount(3);
  });

  test('should navigate to Active filter @smoke @navigation', async ({ page }) => {
    // Click on Active filter
    await page.locator('.filters a[href="#/active"]').click();

    // Verify URL contains active
    await expect(page).toHaveURL(/.*#\/active$/);

    // Verify only active items are visible
    const todoItems = page.locator('.todo-list li');
    await expect(todoItems).toHaveCount(2);
  });

  test('should navigate to Completed filter @smoke @navigation', async ({ page }) => {
    // Click on Completed filter
    await page.locator('.filters a[href="#/completed"]').click();

    // Verify URL contains completed
    await expect(page).toHaveURL(/.*#\/completed$/);

    // Verify only completed items are visible
    const todoItems = page.locator('.todo-list li');
    await expect(todoItems).toHaveCount(1);
  });

  test('should highlight active filter @regression', async ({ page }) => {
    // Navigate to Active filter
    await page.locator('.filters a[href="#/active"]').click();

    // Verify Active filter is highlighted
    const activeFilter = page.locator('.filters a[href="#/active"]');
    await expect(activeFilter).toHaveClass(/selected/);

    // Verify other filters are not highlighted
    const allFilter = page.locator('.filters a[href="#/"]');
    await expect(allFilter).not.toHaveClass(/selected/);
  });

  test('should persist state on page refresh @regression', async ({ page }) => {
    // Navigate to Completed filter
    await page.locator('.filters a[href="#/completed"]').click();

    // Refresh the page
    await page.reload();

    // Verify we're still on Completed filter
    await expect(page).toHaveURL(/.*#\/completed$/);
    const todoItems = page.locator('.todo-list li');
    await expect(todoItems).toHaveCount(1);
  });

  test('should handle direct URL navigation @regression', async ({ page }) => {
    // Navigate directly to active filter via URL
    await page.goto('/#/active');

    // Verify only active items are visible
    const todoItems = page.locator('.todo-list li');
    await expect(todoItems).toHaveCount(2);

    // Verify Active filter is selected
    const activeFilter = page.locator('.filters a[href="#/active"]');
    await expect(activeFilter).toHaveClass(/selected/);
  });

  test('should use browser back/forward navigation @regression', async ({ page }) => {
    // Navigate through filters
    await page.locator('.filters a[href="#/active"]').click();
    await page.locator('.filters a[href="#/completed"]').click();

    // Use browser back button
    await page.goBack();

    // Verify we're back on Active filter
    await expect(page).toHaveURL(/.*#\/active$/);
    const activeFilter = page.locator('.filters a[href="#/active"]');
    await expect(activeFilter).toHaveClass(/selected/);

    // Use browser forward button
    await page.goForward();

    // Verify we're on Completed filter
    await expect(page).toHaveURL(/.*#\/completed$/);
    const completedFilter = page.locator('.filters a[href="#/completed"]');
    await expect(completedFilter).toHaveClass(/selected/);
  });

  test('should show correct item count in footer @smoke', async ({ page }) => {
    // Check item count on All filter
    const itemCount = page.locator('.todo-count strong');
    await expect(itemCount).toHaveText('2'); // 2 active items

    // Navigate to Active filter
    await page.locator('.filters a[href="#/active"]').click();

    // Count should still show active items
    await expect(itemCount).toHaveText('2');
  });
});
