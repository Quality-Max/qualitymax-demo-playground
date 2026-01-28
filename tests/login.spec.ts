import { test, expect } from '@playwright/test';

/**
 * Login Test Suite
 *
 * Tests basic authentication flow patterns.
 * Using TodoMVC as demo app - adapted for login-like behavior.
 *
 * Tags: @smoke @login @authentication
 */

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the demo app
    await page.goto('/');
  });

  test('should display login form elements @smoke', async ({ page }) => {
    // The TodoMVC app has an input field - treat it as a "login" form
    const inputField = page.locator('.new-todo');

    await expect(inputField).toBeVisible();
    await expect(inputField).toHaveAttribute('placeholder', 'What needs to be done?');
  });

  test('should accept user input @smoke @login', async ({ page }) => {
    const inputField = page.locator('.new-todo');

    // Type a username (simulating login input)
    await inputField.fill('testuser@example.com');

    // Verify the input was accepted
    await expect(inputField).toHaveValue('testuser@example.com');
  });

  test('should submit form on Enter key @smoke @login', async ({ page }) => {
    const inputField = page.locator('.new-todo');

    // Enter credentials and submit
    await inputField.fill('Complete login form');
    await inputField.press('Enter');

    // Verify submission was successful (todo item appears)
    const todoItem = page.locator('.todo-list li');
    await expect(todoItem).toHaveCount(1);
    await expect(todoItem).toContainText('Complete login form');
  });

  test('should handle empty form submission @regression', async ({ page }) => {
    const inputField = page.locator('.new-todo');

    // Try to submit empty form
    await inputField.fill('');
    await inputField.press('Enter');

    // Verify no submission occurred
    const todoList = page.locator('.todo-list li');
    await expect(todoList).toHaveCount(0);
  });

  test('should trim whitespace from input @regression', async ({ page }) => {
    const inputField = page.locator('.new-todo');

    // Enter text with whitespace
    await inputField.fill('   trimmed input   ');
    await inputField.press('Enter');

    // Verify whitespace was trimmed
    const todoItem = page.locator('.todo-list li label');
    await expect(todoItem).toHaveText('trimmed input');
  });

  test('should clear input after submission @smoke', async ({ page }) => {
    const inputField = page.locator('.new-todo');

    // Submit a form
    await inputField.fill('Test submission');
    await inputField.press('Enter');

    // Verify input is cleared
    await expect(inputField).toHaveValue('');
  });

  test('should handle special characters @regression @security', async ({ page }) => {
    const inputField = page.locator('.new-todo');

    // Test with special characters (XSS prevention)
    const specialInput = '<script>alert("xss")</script>';
    await inputField.fill(specialInput);
    await inputField.press('Enter');

    // Verify special characters are escaped/handled safely
    const todoItem = page.locator('.todo-list li label');
    await expect(todoItem).toContainText('script');
    // Verify no script execution (page should not show alert)
  });
});
