# QualityMax Demo Playground

Demo repository showcasing QualityMax GitHub Action integration for automated Playwright testing in CI/CD pipelines.

## Overview

This playground demonstrates:
- Running Playwright tests via GitHub Actions
- Automatic test result comments on pull requests
- Integration with [QualityMax GitHub Action](https://github.com/Quality-Max/qualitymax-github-action)

## Project Structure

```
.github/workflows/
  qamax-tests.yml          # Playwright CI workflow
  qualitymax.yml           # QualityMax AI-powered test runner
tests/
  todo-crud.spec.ts        # CRUD operations (add, complete, delete)
  todo-filters.spec.ts     # Filter functionality (all, active, completed)
playwright.config.ts       # Playwright configuration
package.json               # Dependencies
```

## Test Suites

### Todo CRUD (`tests/todo-crud.spec.ts`)
Tests basic CRUD operations on the TodoMVC demo app:
- Add a new todo item
- Add multiple items
- Mark todo as completed
- Delete a todo item
- Verify input clears after adding

### Todo Filters (`tests/todo-filters.spec.ts`)
Tests filter and count functionality:
- Show all todos by default
- Filter active todos
- Filter completed todos
- Update item count on completion
- Clear completed todos

## CI/CD Integration

### Playwright Tests (built-in)

The `qamax-tests.yml` workflow runs Playwright tests directly and posts results as PR comments.

### QualityMax AI Testing

The `qualitymax.yml` workflow uses the [QualityMax GitHub Action](https://github.com/marketplace/actions/qualitymax-e2e-tests) to run AI-powered tests:

```yaml
- name: Run QualityMax Tests
  uses: Quality-Max/qualitymax-github-action@v1
  with:
    api-key: ${{ secrets.QUALITYMAX_API_KEY }}
    project-name: 'Demo Playground'
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

## Local Development

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Run all tests
npm test

# Run smoke tests only
npm run test:smoke

# Run with UI mode
npm run test:ui

# Run headed (visible browser)
npm run test:headed
```

## Setup for Your Own Project

1. Get your API key at [app.qualitymax.io](https://app.qualitymax.io) > Settings > API Keys
2. Add `QUALITYMAX_API_KEY` as a repository secret
3. Copy `.github/workflows/qualitymax.yml` to your repo
4. Push and watch tests run automatically

## Support

- [QualityMax Documentation](https://qualitymax.io)
- [GitHub Action](https://github.com/Quality-Max/qualitymax-github-action)
- [Report Issues](https://github.com/Quality-Max/qualitymax-demo-playground/issues)
- Email: [contact@qualitymax.io](mailto:contact@qualitymax.io)

## License

MIT
