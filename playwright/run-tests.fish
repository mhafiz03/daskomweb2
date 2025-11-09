#!/usr/bin/env fish
# Quick test runner script for Daskom Laboratory Playwright tests
# Usage: ./run-tests.fish [option]

set BASE_DIR (dirname (status -f))

function show_help
    echo "Daskom Laboratory - Playwright Test Runner"
    echo ""
    echo "Usage: ./run-tests.fish [option]"
    echo ""
    echo "Options:"
    echo "  all            Run all tests"
    echo "  ui             Run tests with interactive UI"
    echo "  landing        Test landing page only"
    echo "  praktikan      Test praktikan auth flows"
    echo "  asisten        Test asisten auth flows"
    echo "  navigation     Test navigation flows"
    echo "  headed         Run in headed mode (visible browser)"
    echo "  debug          Run in debug mode"
    echo "  report         Generate and open HTML report"
    echo "  help           Show this help message"
    echo ""
    echo "Prerequisites:"
    echo "  - Application running on http://localhost:8000"
    echo "  - Run: php artisan serve"
    echo ""
end

function check_server
    echo "Checking if application is running..."
    if curl -s -o /dev/null -w "%{http_code}" http://localhost:8000 | grep -q "200\|301\|302"
        echo "✓ Application is running on http://localhost:8000"
        return 0
    else
        echo "✗ Application is not running on http://localhost:8000"
        echo "  Please start the application with: php artisan serve"
        return 1
    end
end

# Main script
if not test (count $argv) -gt 0
    show_help
    exit 0
end

set option $argv[1]

switch $option
    case all
        check_server; or exit 1
        echo "Running all tests..."
        npx playwright test tests-playwright/seed.spec.ts

    case ui
        check_server; or exit 1
        echo "Opening Playwright UI..."
        npx playwright test tests-playwright/seed.spec.ts --ui

    case landing
        check_server; or exit 1
        echo "Running landing page tests..."
        npx playwright test tests-playwright/seed.spec.ts -g "Landing Page"

    case praktikan
        check_server; or exit 1
        echo "Running praktikan authentication tests..."
        npx playwright test tests-playwright/seed.spec.ts -g "Praktikan"

    case asisten
        check_server; or exit 1
        echo "Running asisten authentication tests..."
        npx playwright test tests-playground/seed.spec.ts -g "Asisten"

    case navigation
        check_server; or exit 1
        echo "Running navigation tests..."
        npx playwright test tests-playwright/seed.spec.ts -g "Navigation"

    case headed
        check_server; or exit 1
        echo "Running tests in headed mode..."
        npx playwright test tests-playwright/seed.spec.ts --headed

    case debug
        check_server; or exit 1
        echo "Running tests in debug mode..."
        npx playwright test tests-playwright/seed.spec.ts --debug

    case report
        echo "Generating HTML report..."
        npx playwright show-report

    case help
        show_help

    case '*'
        echo "Unknown option: $option"
        echo ""
        show_help
        exit 1
end
