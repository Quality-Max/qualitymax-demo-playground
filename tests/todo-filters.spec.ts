import { test, expect } from '@playwright/test';

/**
 * Todo Filtering
 *
 * Tests the All/Active/Completed filter functionality.
 * Target: https://demo.playwright.dev/todomvc/
 *
 * Tags: @smoke @filters
 */

test.describe('Todo Filters', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc/#/');

    // Add some todos for filtering tests
    const input = page.getByPlaceholder('What needs to be done?');
    const todos = ['Active task 1', 'Completed task', 'Active task 2'];

    for (const todo of todos) {
      await input.fill(todo);
      await input.press('Enter');
    }

    // Mark the second one as completed
    const secondCheckbox = page.locator('.todo-list li').nth(1).getByRole('checkbox');
    await secondCheckbox.click();
  });

  test('should show all todos by default @smoke', async ({ page }) => {
    const todoItems = page.locator('.todo-list li');
    await expect(todoItems).toHaveCount(3);
  });

  test('should filter to show only active todos @smoke', async ({ page }) => {
    // Click Active filter
    await page.getByRole('link', { name: 'Active' }).click();

    const todoItems = page.locator('.todo-list li');
    await expect(todoItems).toHaveCount(2);
  });

  test('should filter to show only completed todos @smoke', async ({ page }) => {
    // Click Completed filter
    await page.getByRole('link', { name: 'Completed' }).click();

    const todoItems = page.locator('.todo-list li');
    await expect(todoItems).toHaveCount(1);
    await expect(todoItems.first()).toContainText('Completed task');
  });

  test('should update item count correctly @smoke', async ({ page }) => {
    // Should show 2 items left (only active items)
    const todoCount = page.locator('.todo-count');
    await expect(todoCount).toContainText('2 items left');

    // Complete another item
    await page.locator('.todo-list li').first().getByRole('checkbox').click();

    // Count should update
    await expect(todoCount).toContainText('1 item left');
  });

  test('should clear completed todos @regression', async ({ page }) => {
    // Click "Clear completed" button
    const clearButton = page.getByRole('button', { name: 'Clear completed' });
    await clearButton.click();

    // Only 2 active items should remain
    const todoItems = page.locator('.todo-list li');
    await expect(todoItems).toHaveCount(2);
  });
});
