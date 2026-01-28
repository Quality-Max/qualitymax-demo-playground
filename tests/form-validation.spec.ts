import { test, expect } from '@playwright/test';

/**
 * Form Validation Test Suite
 *
 * Tests client-side form validation including required fields,
 * input constraints, and error handling.
 *
 * Tags: @smoke @validation @forms
 */

test.describe('Form Validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should validate required input is not empty @smoke @validation', async ({ page }) => {
    const inputField = page.locator('.new-todo');

    // Verify input field is required (attempting empty submission)
    await inputField.fill('');
    await inputField.press('Enter');

    // No todo should be added
    const todoList = page.locator('.todo-list li');
    await expect(todoList).toHaveCount(0);
  });

  test('should accept valid input @smoke @validation', async ({ page }) => {
    const inputField = page.locator('.new-todo');

    // Enter valid input
    await inputField.fill('Valid todo item');
    await inputField.press('Enter');

    // Todo should be added
    const todoItem = page.locator('.todo-list li');
    await expect(todoItem).toHaveCount(1);
    await expect(todoItem.locator('label')).toHaveText('Valid todo item');
  });

  test('should handle maximum length input @regression @validation', async ({ page }) => {
    const inputField = page.locator('.new-todo');

    // Enter a very long string
    const longText = 'A'.repeat(500);
    await inputField.fill(longText);
    await inputField.press('Enter');

    // Verify the long text was accepted
    const todoItem = page.locator('.todo-list li label');
    await expect(todoItem).toBeVisible();
  });

  test('should preserve input on focus loss without submission @regression', async ({ page }) => {
    const inputField = page.locator('.new-todo');

    // Enter text but don't submit
    await inputField.fill('Unsubmitted text');

    // Click elsewhere to lose focus
    await page.locator('h1').click();

    // Verify input is preserved
    await expect(inputField).toHaveValue('Unsubmitted text');

    // Verify no todo was created
    const todoList = page.locator('.todo-list li');
    await expect(todoList).toHaveCount(0);
  });

  test('should edit existing todo item @smoke @validation', async ({ page }) => {
    const inputField = page.locator('.new-todo');

    // Create a todo
    await inputField.fill('Original text');
    await inputField.press('Enter');

    // Double-click to edit
    const todoLabel = page.locator('.todo-list li label');
    await todoLabel.dblclick();

    // Edit the text
    const editInput = page.locator('.todo-list li.editing .edit');
    await editInput.fill('Edited text');
    await editInput.press('Enter');

    // Verify the edit was saved
    await expect(page.locator('.todo-list li label')).toHaveText('Edited text');
  });

  test('should cancel edit on Escape key @regression', async ({ page }) => {
    const inputField = page.locator('.new-todo');

    // Create a todo
    await inputField.fill('Original text');
    await inputField.press('Enter');

    // Double-click to edit
    const todoLabel = page.locator('.todo-list li label');
    await todoLabel.dblclick();

    // Start editing
    const editInput = page.locator('.todo-list li.editing .edit');
    await editInput.fill('Changed text');

    // Press Escape to cancel
    await editInput.press('Escape');

    // Verify original text is preserved
    await expect(page.locator('.todo-list li label')).toHaveText('Original text');
  });

  test('should delete todo if edited to empty @regression @validation', async ({ page }) => {
    const inputField = page.locator('.new-todo');

    // Create a todo
    await inputField.fill('To be deleted');
    await inputField.press('Enter');

    // Double-click to edit
    const todoLabel = page.locator('.todo-list li label');
    await todoLabel.dblclick();

    // Clear the input and submit
    const editInput = page.locator('.todo-list li.editing .edit');
    await editInput.fill('');
    await editInput.press('Enter');

    // Verify todo was deleted
    const todoList = page.locator('.todo-list li');
    await expect(todoList).toHaveCount(0);
  });

  test('should validate checkbox toggle @smoke @validation', async ({ page }) => {
    const inputField = page.locator('.new-todo');

    // Create a todo
    await inputField.fill('Toggle test');
    await inputField.press('Enter');

    // Toggle completion
    const toggle = page.locator('.todo-list li .toggle');
    await toggle.click();

    // Verify todo is marked as completed
    const todoItem = page.locator('.todo-list li');
    await expect(todoItem).toHaveClass(/completed/);

    // Toggle back
    await toggle.click();

    // Verify todo is no longer completed
    await expect(todoItem).not.toHaveClass(/completed/);
  });

  test('should handle multiple rapid submissions @regression', async ({ page }) => {
    const inputField = page.locator('.new-todo');

    // Rapidly add multiple items
    for (let i = 1; i <= 5; i++) {
      await inputField.fill(`Rapid item ${i}`);
      await inputField.press('Enter');
    }

    // Verify all items were added
    const todoItems = page.locator('.todo-list li');
    await expect(todoItems).toHaveCount(5);

    // Verify each item has correct text
    for (let i = 1; i <= 5; i++) {
      await expect(todoItems.nth(i - 1).locator('label')).toHaveText(`Rapid item ${i}`);
    }
  });

  test('should handle Unicode characters @regression @i18n', async ({ page }) => {
    const inputField = page.locator('.new-todo');

    // Test with Unicode characters
    const unicodeText = 'Test avec des accents: cafe, resume, naive';
    await inputField.fill(unicodeText);
    await inputField.press('Enter');

    // Verify Unicode was preserved
    const todoLabel = page.locator('.todo-list li label');
    await expect(todoLabel).toHaveText(unicodeText);
  });

  test('should handle emoji characters @regression @i18n', async ({ page }) => {
    const inputField = page.locator('.new-todo');

    // Test with emoji
    const emojiText = 'Fix bug in login page';
    await inputField.fill(emojiText);
    await inputField.press('Enter');

    // Verify emoji was preserved
    const todoLabel = page.locator('.todo-list li label');
    await expect(todoLabel).toContainText('Fix bug');
  });
});
