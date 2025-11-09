# Daskom Laboratory Web Application - Exploration Summary

**Date**: November 8, 2025  
**Explorer**: GitHub Copilot  
**Base URL**: http://localhost:8000

---

## Application Architecture

### Technology Stack
- **Backend**: Laravel 11 (PHP 8.3.11)
- **Frontend**: React 18 + Inertia.js v1
- **Styling**: Tailwind CSS v3
- **Authentication**: Laravel Sanctum v4
- **Testing**: PHPUnit 11, Playwright

### Key Frameworks & Libraries
- **inertiajs/inertia-laravel** - SPA-like experience without API
- **tightenco/ziggy** - Route helper for JavaScript
- **React Hot Toast** - Notification system
- **Laravel Breeze** - Authentication scaffolding

---

## Application Structure

### User Roles
1. **Praktikan** (Students/Practicum Participants)
   - Student ID (NIM) based login
   - Access to practicum modules
   - Submit assignments and get graded
   
2. **Asisten** (Laboratory Assistants)
   - Username/email based login
   - Grade praktikan submissions
   - Manage modules and schedules
   - Different dashboard and permissions

### Authentication System

#### Separate Guard Contexts
```php
auth:praktikan  // For student authentication
auth:asisten    // For assistant authentication
```

#### Login Endpoints
- **Praktikan**: `POST /login/praktikan`
- **Asisten**: `POST /login/asisten`

#### Registration Endpoints (Currently Disabled)
- `POST /register/praktikan` - Commented out
- `POST /register/asisten` - Commented out

#### Logout Endpoints
- **Praktikan**: `POST /praktikan/logout`
- **Asisten**: `POST /asisten/logout`

---

## Pages & Routes

### Public Pages
1. **Landing Page** (`/`)
   - Component: `LandingPage.jsx`
   - Features: Navigation, Hero section, Social media links, CTAs
   - Modal-based authentication

2. **Login Page** (`/login`)
   - Component: `LoginPage.jsx`
   - Mode parameter: `?mode=praktikan` or `?mode=asisten`
   - Dynamic form switching based on mode
   - Sub-components:
     - `LoginFormPraktikan`
     - `LoginFormAssistant`

3. **Registration Page** (`/register`)
   - Component: `RegistPage.jsx`
   - Mode parameter: `?mode=praktikan` or `?mode=asisten`
   - Dynamic form switching
   - Sub-components:
     - `RegistFormPraktikan`
     - `RegistFormAssistant`

### Protected Pages (Examples from codebase)
- Praktikan Dashboard
- Asisten Dashboard
- Module Management
- Grading Interface (`ContentNilai.jsx`)
- Schedule Management
- Feedback System

---

## Key Features Discovered

### 1. Mode Switching System
The application uses a clever mode parameter to toggle between Praktikan and Asisten views:

- Single page components handle both modes
- URL parameter: `?mode=praktikan` or `?mode=asisten`
- `ButtonGroup` component for mode switching
- Mode persists across navigation
- State managed via React hooks and URL sync

### 2. Modal-Based Authentication
From the landing page, authentication can be handled via modals:

- `AuthModal` component
- Type switching: 'login' vs 'register'
- URL updates without page reload using `window.history.pushState`
- Validation errors keep modal open
- Close returns to landing page

### 3. Dual Authentication Guards
Laravel uses separate authentication guards:

```php
// Middleware examples
['auth:praktikan', 'can:logout-praktikan']
['auth:asisten', 'can:change-password']
```

### 4. Permission System
Gates and policies control access:
- `can:change-password` (Asisten)
- `can:ganti-password` (Praktikan)
- `can:logout-praktikan`
- `can:logout` (Asisten)

### 5. Inertia.js Form Handling
Forms use Inertia's router instead of traditional submission:

```javascript
router.post('/users', values)
// Instead of: <form method="POST">
```

---

## Form Fields Analysis

### Praktikan Login
- **NIM** (Student ID) - Required
- **Password** - Required, hidden

### Praktikan Registration
- **NIM** - Required, unique
- **Nama** (Name) - Required
- **Email** - Required, unique, valid format
- **Password** - Required, min length
- **Confirm Password** - Must match password
- **Kelas** (Class) - Required, dropdown selection

### Asisten Login
- **Username/Email** - Required
- **Password** - Required, hidden

### Asisten Registration
- **Username** - Required, unique
- **Nama** (Name) - Required
- **Email** - Required, unique, valid format
- **Password** - Required
- **Confirm Password** - Must match

---

## Validation Rules (Inferred)

### Client-Side
- Empty field validation
- Email format validation
- Password match confirmation
- React Hook Form or custom validation

### Server-Side (Laravel)
- Required field validation
- Unique constraints (NIM, username, email)
- Email format validation
- Min/max length constraints
- Custom validation rules via Form Requests

---

## Data Models Identified

### Praktikan
- `praktikans` table
- Fields: nim, nama, email, password, kelas_id, etc.
- Relationships: kelas, nilai, jawaban_*, praktikum

### Asisten
- `asistens` table  
- Fields: username, nama, email, password, foto, etc.
- Relationships: jadwal_jaga, nilai, feedback

### Other Models
- Modul (Modules)
- Kelas (Classes)
- Nilai (Grades)
- JadwalJaga (Duty Schedule)
- Praktikum
- Feedback
- LaporanPraktikan (Student Reports)
- Various answer types (JawabanTP, JawabanTA, etc.)

---

## Frontend Components Structure

### Praktikan Components
Located in: `resources/js/Components/Praktikans/`

- **Forms**: `LoginFormPraktikan`, `RegistFormPraktikan`
- **Layout**: `LandingNavbar`, `LandingFooter`
- **Sections**: `MainLanding`, `LandingSosmed`, `Vector`
- **Modals**: `ModalAuth`, `ModalAbout`, `ModalContact`
- **Buttons**: `ButtonGroup` (mode switcher)

### Asisten Components  
Located in: `resources/js/Components/Assistants/`

- **Forms**: `LoginFormAssistant`, `RegistFormAssistant`
- **Content**: `ContentNilai` (grading interface)
- **Tables**: `TableModule` (module management)
- **Modals**: `ModalInputNilai`, `ModalEditModule`, etc.
- **Common**: Shared depth-themed UI components

---

## Styling System

### Depth Theme
Custom CSS variables for consistent theming:
- `--depth-color-primary`
- `--depth-background`
- `--depth-card`
- `--depth-interactive`
- `--depth-border`
- Depth-based shadows and borders

### Tailwind Classes
- `rounded-depth-lg`, `rounded-depth-md`
- `shadow-depth-lg`, `shadow-depth-md`
- `bg-depth-card`, `bg-depth-interactive`
- `text-depth-primary`, `text-depth-secondary`

### Dark Mode Support
- Using Tailwind's `dark:` variant
- Depth variables adapt to theme

---

## API Endpoints Summary

### Authentication
- `POST /login/praktikan`
- `POST /login/asisten`
- `POST /praktikan/logout`
- `POST /asisten/logout`
- `PUT /praktikan/password`
- `PUT /asisten/password`

### Modules
- `GET /api-v1/modul` - List modules
- `PATCH /api-v1/modul/:id` - Update module
- `DELETE /api-v1/modul/:id` - Delete module
- `PATCH /api-v1/modul/bulk-update` - Bulk update

### Grading
- Assigned praktikan queries
- Nilai (grade) submission
- Feedback management

---

## Test Coverage Created

### Test Specification
**File**: `tests-playwright/seed.spec.ts`

**Test Groups**:
1. Landing Page Exploration (2 tests)
2. Login Flow - Praktikan (5 tests)
3. Login Flow - Asisten (4 tests)
4. Registration Flow - Praktikan (6 tests)
5. Registration Flow - Asisten (4 tests)
6. Navigation Between Pages (3 tests)

**Total**: ~24 comprehensive test scenarios

### Documentation
- **TEST_PLAN.md** - 600+ line comprehensive test plan
- **README.md** - Quick start guide
- **run-tests.fish** - Test runner script
- **screenshots/** - Directory for test outputs

---

## Sample Test Data

### From Database/Screenshots
**Praktikan Examples**:
- NIM: `101022400004` - XXXXXX XXXXXX (EL-01-INT)
- NIM: `101022500003` - XXXXXX XXXXXX (EL-01-04)
- NIM: `101022640002` - XXXXXX XXXXXX (EL-01-05)
- NIM: `101022700001` - XXXXXX XXXXXX (EL-01-06)

**Grade Values** (from screenshots):
- TP: 0-100
- TA: 0-100
- D1-D4: 0-100
- I1-I2: 0-100

---

## Security Features

### CORS Configuration
```php
'allowed_origins' => [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:8000',
    'http://127.0.0.1:8000'
]
```

### Middleware Stack
- `guest` - Redirect authenticated users
- `check.auth` - Redirect based on auth state
- `auth:praktikan` - Require praktikan auth
- `auth:asisten` - Require asisten auth
- Permission gates via `can:action` or `permission`

---

## Known Issues & Notes

1. **Registration Disabled**
   - Both praktikan and asisten registration routes are commented out
   - Likely admin-only account creation
   - Tests will fail on actual registration submission

2. **Frontend Build Required**
   - Vite manifest needed for production
   - May need `bun run dev` or `npm run dev` running
   - Or `bun run build` for static assets

3. **Database Seeding**
   - Tests assume seeded database
   - `php artisan migrate:fresh --seed` required

4. **Session Configuration**
   - Domain: `localhost`
   - May cause issues with different hosts

---

## How to Run the Application

### Backend
```fish
# Start Laravel server
php artisan serve
# Runs on http://localhost:8000
```

### Frontend (Development)
```fish
# Option 1: Vite dev server
bun run dev
# or
npm run dev

# Option 2: Build for production
bun run build
# or
npm run build
```

### Database
```fish
# Migrate and seed
php artisan migrate:fresh --seed

# Or just migrate
php artisan migrate
```

---

## Test Execution

### Basic Commands
```fish
# Run all tests
npx playwright test tests-playwright/seed.spec.ts

# Interactive UI
npx playwright test tests-playwright/seed.spec.ts --ui

# Specific test group
npx playwright test tests-playwright/seed.spec.ts -g "Praktikan"

# With visible browser
npx playwright test tests-playwright/seed.spec.ts --headed

# Debug mode
npx playwright test tests-playwright/seed.spec.ts --debug
```

### Using Helper Script
```fish
# Make executable
chmod +x tests-playwright/run-tests.fish

# Run all tests
./tests-playwright/run-tests.fish all

# Run with UI
./tests-playwright/run-tests.fish ui

# Run specific group
./tests-playwright/run-tests.fish praktikan
```

---

## Next Steps for Testing

1. **Start Application**: `php artisan serve`
2. **Run Tests**: `npx playwright test tests-playwright/seed.spec.ts --ui`
3. **Review Screenshots**: Check `tests-playwright/screenshots/`
4. **Identify Issues**: Note any failing tests
5. **Expand Coverage**: Add authenticated dashboard tests
6. **Test Permissions**: Verify role-based access control
7. **Test Module Management**: CRUD operations for modules
8. **Test Grading Flow**: Complete assignment submission to grading
9. **Performance Testing**: Load times, API response times
10. **Mobile Responsiveness**: Test on various screen sizes

---

## File Locations Reference

### Test Files
- Main spec: `/tests-playwright/seed.spec.ts`
- Test plan: `/tests-playwright/TEST_PLAN.md`
- README: `/tests-playwright/README.md`
- Runner: `/tests-playwright/run-tests.fish`
- Screenshots: `/tests-playwright/screenshots/`

### Frontend Components
- Pages: `/resources/js/Pages/`
- Components: `/resources/js/Components/`
- Hooks: `/resources/js/hooks/`
- Layouts: `/resources/js/Layouts/`

### Backend
- Controllers: `/app/Http/Controllers/`
- Models: `/app/Models/`
- Routes: `/routes/web.php`, `/routes/auth.php`, `/routes/api.php`
- Middleware: `/app/Http/Middleware/`

### Configuration
- App: `/config/app.php`
- Auth: `/config/auth.php`
- CORS: `/config/cors.php`
- Sanctum: `/config/sanctum.php`

---

## Conclusion

The Daskom Laboratory application is a well-structured dual-role management system with:

✓ **Solid Architecture** - Separate authentication for different user types  
✓ **Modern Stack** - Laravel 11 + React + Inertia.js  
✓ **Good UX** - Modal-based auth, seamless mode switching  
✓ **Comprehensive Features** - Module management, grading, scheduling  
✓ **Test Coverage** - 24 E2E test scenarios documented  

**Ready for Testing**: All test files created, documentation complete, helper scripts available.

---

**Generated**: November 8, 2025  
**By**: GitHub Copilot AI Assistant
