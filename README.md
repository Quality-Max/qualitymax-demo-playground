# QualityMax GitHub Actions Demo Playground

This demo repository showcases how to integrate QualityMax test automation with your GitHub CI/CD pipeline.

## Overview

This playground demonstrates:
- Running QualityMax tests via GitHub Actions
- Automatic test reporting on pull requests
- Integration with your existing Playwright tests

## Quick Start

### 1. Get Your API Key

1. Log into [QualityMax](https://app.qamax.co)
2. Go to **Settings** > **API Keys**
3. Click **Generate API Key**
4. Copy your key (it won't be shown again!)

### 2. Configure GitHub Secrets

In your GitHub repository:
1. Go to **Settings** > **Secrets and variables** > **Actions**
2. Click **New repository secret**
3. Add `QAMAX_API_KEY` with your API key

### 3. Add the Workflow

Copy `.github/workflows/qamax-tests.yml` to your repository.

### 4. Run Tests

Tests will automatically run on:
- Push to `main` or `master`
- Pull request events
- Manual dispatch

## Project Structure

```
demo-playground/
├── .github/
│   └── workflows/
│       └── qamax-tests.yml      # GitHub Actions workflow
├── tests/
│   ├── login.spec.ts            # Login test example
│   ├── navigation.spec.ts       # Navigation test example
│   └── form-validation.spec.ts  # Form validation example
├── playwright.config.ts          # Playwright configuration
├── package.json                  # Dependencies
└── README.md                     # This file
```

## Sample Tests

### Login Test (`tests/login.spec.ts`)
Tests basic authentication flow with form submission and validation.

### Navigation Test (`tests/navigation.spec.ts`)
Tests page navigation, URL changes, and breadcrumb functionality.

### Form Validation Test (`tests/form-validation.spec.ts`)
Tests client-side form validation including required fields and email format.

## GitHub Actions Workflow

The workflow (`.github/workflows/qamax-tests.yml`) includes:

```yaml
- name: Run QualityMax Tests
  uses: qualitymax/test-runner@v1
  with:
    api_key: ${{ secrets.QAMAX_API_KEY }}
    project_id: ${{ vars.QAMAX_PROJECT_ID }}
    suite: smoke  # Options: all, smoke, regression, custom
    browser: chromium  # Options: chromium, firefox, webkit
    base_url: ${{ env.DEPLOY_URL }}
```

### Configuration Options

| Option | Description | Default |
|--------|-------------|---------|
| `api_key` | Your QualityMax API key (required) | - |
| `project_id` | Your QualityMax project ID (required) | - |
| `suite` | Test suite to run: `all`, `smoke`, `regression`, `custom` | `all` |
| `browser` | Browser to use: `chromium`, `firefox`, `webkit` | `chromium` |
| `base_url` | Base URL for tests (e.g., staging URL) | Project default |
| `timeout` | Test timeout in minutes | `30` |
| `test_ids` | Specific test IDs (comma-separated, for `custom` suite) | - |

## Test Results

After tests complete:
- **GitHub Actions UI**: View summary in the Actions tab
- **PR Comments**: Automatic test result summary posted to pull requests
- **QualityMax Dashboard**: Detailed results at `app.qamax.co/results/{execution_id}`

### Example PR Comment

```markdown
## QualityMax Test Results

| Status | Passed | Tests |
|--------|--------|-------|
| Passed | 5/5 | 100% |

Duration: 2m 34s | Browser: Chromium

[View Full Report](https://app.qamax.co/results/gha_abc123)
```

## Local Development

Run tests locally:

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install

# Run all tests
npm test

# Run specific test
npx playwright test tests/login.spec.ts

# Run with UI mode
npx playwright test --ui

# Run headed (visible browser)
npx playwright test --headed
```

## Troubleshooting

### Tests Fail with "Invalid API Key"
- Verify your API key is correct
- Check that the secret `QAMAX_API_KEY` is set in your repository

### Tests Timeout
- Increase the `timeout` option in the workflow
- Check if your `base_url` is accessible from GitHub Actions runners

### No PR Comment Posted
- Ensure the workflow has `pull-requests: write` permission
- Check that the GitHub token has the necessary scopes

## Support

- [QualityMax Documentation](https://app.qamax.co/docs)
- [GitHub Issues](https://github.com/qualitymax/qa-rag-app/issues)
- Email: support@qamax.co
