import { test, expect } from '@playwright/test';

/**
 * Todo CRUD Operations
 *
 * Tests creating, reading, updating, and deleting todo items.
 * Target: https://demo.playwright.dev/todomvc/
 *
 * Tags: @smoke @crud
 */

test.describe('Todo CRUD Operations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://demo.playwright.dev/todomvc/#/');
  });

  test('should add a new todo item @smoke', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');

    await input.fill('Buy groceries');
    await input.press('Enter');

    const todoItems = page.locator('.todo-list li');
    await expect(todoItems).toHaveCount(1);
    await expect(todoItems).toContainText('Buy groceries');
  });

  test('should add multiple todo items @smoke', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');

    const todos = ['Buy milk', 'Walk the dog', 'Finish report'];

    for (const todo of todos) {
      await input.fill(todo);
      await input.press('Enter');
    }

    const todoItems = page.locator('.todo-list li');
    await expect(todoItems).toHaveCount(3);
  });

  test('should mark a todo as completed @smoke', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');

    // Add a todo
    await input.fill('Complete this task');
    await input.press('Enter');

    // Mark it as complete
    const checkbox = page.getByRole('checkbox', { name: 'Toggle Todo' });
    await checkbox.click();

    // Verify it's marked as completed
    const todoItem = page.locator('.todo-list li');
    await expect(todoItem).toHaveClass(/completed/);
  });

  test('should delete a todo item @smoke', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');

    // Add a todo
    await input.fill('Delete me');
    await input.press('Enter');

    // Hover to reveal delete button and click it
    const todoItem = page.locator('.todo-list li');
    await todoItem.hover();

    const deleteButton = page.locator('.todo-list li .destroy');
    await deleteButton.click();

    // Verify deletion
    await expect(page.locator('.todo-list li')).toHaveCount(0);
  });

  test('should clear input field after adding todo @smoke', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');

    await input.fill('New todo item');
    await input.press('Enter');

    // Input should be cleared
    await expect(input).toHaveValue('');
  });
});
