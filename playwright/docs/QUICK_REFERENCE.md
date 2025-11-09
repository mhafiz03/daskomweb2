# Quick Reference - Daskom Laboratory Testing

## 🚀 Quick Start

```fish
# 1. Start the application
php artisan serve

# 2. Run tests
npx playwright test tests-playwright/seed.spec.ts --ui
```

## 📋 Test URLs

| Page | Praktikan | Asisten |
|------|-----------|---------|
| Landing | `http://localhost:8000/` | - |
| Login | `http://localhost:8000/login?mode=praktikan` | `http://localhost:8000/login?mode=asisten` |
| Register | `http://localhost:8000/register?mode=praktikan` | `http://localhost:8000/register?mode=asisten` |

## 🧪 Test Commands

```fish
# All tests
npx playwright test tests-playwright/seed.spec.ts

# Interactive UI
npx playwright test tests-playwright/seed.spec.ts --ui

# Specific test
npx playwright test -g "praktikan login"

# With browser visible
npx playwright test --headed

# Debug mode
npx playwright test --debug

# Generate report
npx playwright test --reporter=html
npx playwright show-report
```

## 📝 Sample Test Data

### Praktikan
- **NIM**: `240100000001`
- **Name**: ATC1
- **Class**: TOT-DASKOM
- **Password**: (from database)

### Asisten
- **Username**: `BOT`
- **Password**: (from database)

## 🔧 Common Issues

### Application not running
```fish
# Check if running
curl http://localhost:8000

# Start if needed
php artisan serve
```

### Database not seeded
```fish
php artisan migrate:fresh --seed
```

### Frontend not built
```fish
# Development
bun run dev
# or
npm run dev

# Production
bun run build
```

### Playwright not installed
```fish
npm install -D @playwright/test
npx playwright install
```

## 📂 File Structure

```
tests-playwright/
├── seed.spec.ts              # Test specification
├── TEST_PLAN.md              # Full test plan (600+ lines)
├── EXPLORATION_SUMMARY.md    # Application exploration
├── README.md                 # Getting started guide
├── run-tests.fish            # Helper script
├── QUICK_REFERENCE.md        # This file
└── screenshots/              # Test outputs
```

## 🎯 Test Groups

1. **Landing Page** (2 tests)
   - Page load
   - CTA interactions

2. **Login - Praktikan** (5 tests)
   - Form display
   - Validation
   - Login attempts
   - Mode switching

3. **Login - Asisten** (4 tests)
   - Form display
   - Validation
   - Login attempts

4. **Register - Praktikan** (6 tests)
   - Form display
   - Validation
   - Password mismatch
   - Complete flow
   - Mode switching

5. **Register - Asisten** (4 tests)
   - Form display
   - Validation
   - Complete flow

6. **Navigation** (3 tests)
   - Login ↔ Register
   - Back to landing

## 🔑 Key Components

### Praktikan
- `LoginFormPraktikan`
- `RegistFormPraktikan`
- NIM-based authentication

### Asisten
- `LoginFormAssistant`
- `RegistFormAssistant`
- Username-based authentication

### Common
- `ButtonGroup` - Mode switcher
- `AuthModal` - Modal authentication
- `Vector` - Illustration component

## 📊 API Endpoints

```
POST   /login/praktikan      # Praktikan login
POST   /login/asisten         # Asisten login
POST   /praktikan/logout      # Praktikan logout
POST   /asisten/logout        # Asisten logout
PUT    /praktikan/password    # Change praktikan password
PUT    /asisten/password      # Change asisten password
```

## 🎨 Form Fields

### Praktikan Login
- NIM (required)
- Password (required)

### Praktikan Register
- NIM (required, unique)
- Nama (required)
- Email (required, valid)
- Password (required)
- Confirm Password (must match)
- Kelas (required)

### Asisten Login
- Username/Email (required)
- Password (required)

### Asisten Register
- Username (required, unique)
- Nama (required)
- Email (required, valid)
- Password (required)
- Confirm Password (must match)

## ⚠️ Important Notes

1. **Registration is disabled** - Routes commented out in backend
2. **Need valid credentials** - From seeded database
3. **Mode parameter required** - `?mode=praktikan` or `?mode=asisten`
4. **Frontend must be running** - Dev server or built assets
5. **Database must be seeded** - For realistic test data

## 📖 Documentation

- **Full Test Plan**: `TEST_PLAN.md`
- **App Exploration**: `EXPLORATION_SUMMARY.md`
- **Getting Started**: `README.md`
- **This Guide**: `QUICK_REFERENCE.md`

## 🔍 Debugging

```fish
# View test in slow motion
npx playwright test --headed --slow-mo=1000

# Step through test
npx playwright test --debug

# View trace after failure
npx playwright show-trace trace.zip

# Check application logs
tail -f storage/logs/laravel.log
```

## ✅ Pre-Test Checklist

- [ ] Application running (`php artisan serve`)
- [ ] Database seeded (`php artisan migrate:fresh --seed`)
- [ ] Frontend built or dev server running
- [ ] Playwright installed (`npx playwright install`)
- [ ] Port 8000 available

## 🎯 Success Criteria

### Landing Page
- ✓ Page loads without errors
- ✓ Navigation visible
- ✓ CTA buttons work
- ✓ Modal opens/closes

### Login
- ✓ Form displays correctly
- ✓ Validation works
- ✓ Mode switching functional
- ✓ Navigation links work

### Registration
- ✓ All fields present
- ✓ Validation catches errors
- ✓ Password confirmation works
- ✓ Mode switching functional

## 🚦 Next Steps

1. Run tests and review results
2. Capture screenshots
3. Identify failing tests
4. Update credentials if needed
5. Expand to dashboard testing
6. Add authenticated user tests
7. Test permissions and roles

---

**Last Updated**: November 8, 2025
