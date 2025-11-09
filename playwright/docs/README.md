# Playwright Test Suite for Daskom Laboratory

This directory contains end-to-end tests for the Daskom Laboratory management system using Playwright.

## Structure

```
tests-playwright/
├── seed.spec.ts          # Main test specification file
├── docs/TEST_PLAN.md          # Comprehensive test plan documentation
├── screenshots/          # Test screenshots output directory
└── README.md            # This file
```

## Quick Start

### Prerequisites

1. **Start the Laravel application**:
   ```fish
   php artisan serve
   ```
   Application will run on http://localhost:8000

2. **Ensure database is seeded**:
   ```fish
   php artisan migrate:fresh --seed
   ```

3. **Install Playwright** (if not already installed):
   ```fish
   npm install -D @playwright/test
   npx playwright install
   ```

### Running Tests

```fish
# Run all tests
npx playwright test tests-playwright/seed.spec.ts

# Run with interactive UI
npx playwright test tests-playwright/seed.spec.ts --ui

# Run specific test group
npx playwright test tests-playwright/seed.spec.ts -g "Login Flow - Praktikan"

# Debug mode
npx playwright test tests-playwright/seed.spec.ts --debug

# Generate HTML report
npx playwright test tests-playwright/seed.spec.ts --reporter=html
```

## Test Coverage

The test suite covers:

### 1. Landing Page
- Page load and navigation elements
- CTA buttons functionality
- Modal interactions

### 2. Authentication - Praktikan
- Login form validation
- Successful/failed login attempts
- Mode switching (Praktikan ↔ Asisten)
- Registration flow
- Form validation (empty fields, password mismatch, etc.)

### 3. Authentication - Asisten
- Login form validation
- Successful/failed login attempts  
- Mode switching
- Registration flow
- Form validation

### 4. Navigation
- Login ↔ Register navigation
- Back to landing page
- Mode persistence across pages

## Test Structure

Each test follows the pattern:

1. **Navigate** to the page
2. **Locate** elements using semantic selectors
3. **Interact** with form fields/buttons
4. **Assert** expected outcomes
5. **Capture** screenshots for documentation

## Screenshots

All test screenshots are saved to `tests-playwright/screenshots/` with descriptive filenames:

- `landing-page.png`
- `login-praktikan.png`
- `login-asisten.png`
- `register-praktikan.png`
- `register-asisten.png`
- And more...

## Configuration

### Base URL
Tests target `http://localhost:8000` by default. Update the `BASE_URL` constant in `seed.spec.ts` if your application runs on a different port.

### Timeouts
- Default action timeout: 30s
- Navigation timeout: 30s
- Wait timeouts: 1-5s depending on action

## Known Limitations

1. **Registration endpoints are disabled** in the backend (`routes/auth.php` has them commented out)
2. Tests use **flexible selectors** to handle both English and Indonesian text
3. Some tests may require **valid credentials** from the database to fully pass

## Debugging Tips

### View test in browser
```fish
npx playwright test --headed --project=chromium
```

### Slow motion for visibility
```fish
npx playwright test --headed --slow-mo=1000
```

### Inspector for step-through debugging
```fish
npx playwright test --debug
```

### View trace
```fish
npx playwright show-trace trace.zip
```

## Adding New Tests

1. Open `seed.spec.ts`
2. Add new `test.describe()` block for your feature
3. Write individual tests using `test('description', async ({ page }) => { ... })`
4. Use semantic selectors (`getByRole`, `getByLabel`, `getByText`)
5. Add assertions with `expect()`
6. Capture screenshots for documentation

## CI/CD Integration

To run tests in CI:

```yaml
# Example GitHub Actions workflow
- name: Run Playwright tests
  run: |
    npm ci
    npx playwright install --with-deps
    php artisan serve &
    npx playwright test tests-playwright/seed.spec.ts
```

## Documentation

For detailed test scenarios, expected results, and technical details, see:
- **[TEST_PLAN.md](./TEST_PLAN.md)** - Complete test plan documentation

## Support

For issues or questions:
1. Check the test plan documentation
2. Review Playwright documentation: https://playwright.dev
3. Check Laravel logs: `storage/logs/laravel.log`
4. Review browser console for frontend errors

---

**Last Updated**: November 8, 2025
