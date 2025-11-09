# Daskom Laboratory - Web Application Test Plan
## Landing Page, Login & Registration Flow Documentation

**Test Date**: November 8, 2025  
**Base URL**: http://localhost:8000  
**Application**: Daskom Laboratory Management System

---

## Application Overview

The Daskom Laboratory application is a Laravel + Inertia.js + React application that manages:
- **Praktikan** (Students) - Laboratory practicum participants
- **Asisten** (Assistants) - Laboratory teaching assistants

### Key Features Identified
- Dual-role authentication system (Praktikan/Asisten)
- Separate login endpoints and dashboards for each role
- Registration flows for both roles
- Modal-based authentication on landing page
- Mode switching (toggle between Praktikan and Asisten views)

---

## Test Scenarios

### 1. Landing Page Exploration

#### 1.1 Landing Page Load
**URL**: `http://localhost:8000/`

**Steps:**
1. Navigate to the landing page
2. Verify page loads successfully
3. Check for main navigation bar
4. Verify "About" and "Contact" sections/buttons are visible
5. Verify main CTA (Call-to-Action) buttons exist
6. Check for social media section (LandingSosmed component)
7. Verify footer is present

**Expected Results:**
- Page title: "Daskom Laboratory"
- Navigation bar is visible with proper styling
- Main landing section (MainLanding) displays prominently
- Social media links/section is visible
- Footer contains relevant links and information
- No console errors

**Components Tested:**
- `LandingNavbar`
- `MainLanding`
- `LandingSosmed`
- `LandingFooter`

---

#### 1.2 Get Started Flow
**Steps:**
1. From landing page, click "Get Started" or similar CTA button
2. Observe modal or navigation behavior

**Expected Results:**
- Either opens login modal (`AuthModal`) OR navigates to `/login`
- URL updates to `/login` with optional `?mode=praktikan` parameter
- Login form is visible

---

### 2. Login Flow - Praktikan

#### 2.1 Display Praktikan Login Form
**URL**: `http://localhost:8000/login?mode=praktikan`

**Steps:**
1. Navigate directly to login page with praktikan mode
2. Verify page title
3. Check all form elements are present

**Expected Form Fields:**
- **NIM** input (Student ID number)
- **Password** input (password type, hidden characters)
- **Login/Masuk** submit button
- Link to Register page ("Belum punya akun?" / "Don't have an account?")
- Mode toggle buttons (Praktikan/Asisten)

**Expected Results:**
- Page title: "Login - Praktikan"
- Praktikan mode is visually active/selected
- All form fields are visible and functional
- Form uses Inertia.js `router.post` (not traditional form submit)
- Vector illustration displayed on right side

**API Endpoint**: `POST /login/praktikan`

---

#### 2.2 Validation - Empty Fields
**Steps:**
1. Navigate to `/login?mode=praktikan`
2. Click submit button without filling any fields
3. Observe validation messages

**Expected Results:**
- Form shows validation errors for required fields
- NIM field shows "required" error
- Password field shows "required" error
- Form does not submit
- No API call is made

---

#### 2.3 Validation - Invalid Credentials
**Steps:**
1. Navigate to `/login?mode=praktikan`
2. Enter invalid NIM: `000000000000`
3. Enter invalid password: `wrongpassword`
4. Submit form

**Expected Results:**
- API call is made to `POST /login/praktikan`
- Error response returned (401 Unauthorized or 422 Validation)
- Error message displayed: "Invalid credentials" or similar
- Form remains on login page
- User is not authenticated

---

#### 2.4 Successful Login (If Valid Credentials Available)
**Steps:**
1. Navigate to `/login?mode=praktikan`
2. Enter valid NIM: `101022400284` (from your screenshot)
3. Enter valid password
4. Submit form

**Expected Results:**
- API call succeeds with 200/302 status
- User is redirected to praktikan dashboard
- Session/token is stored (Sanctum)
- URL changes to praktikan dashboard route
- User sees authenticated view

---

#### 2.5 Switch to Asisten Mode
**Steps:**
1. Navigate to `/login?mode=praktikan`
2. Click "Asisten" mode button in the button group
3. Observe changes

**Expected Results:**
- URL updates to `/login?mode=asisten`
- Form switches to Asisten login form
- Fields change from NIM to Username/Email
- Page title updates to "Login - Asisten"
- No page reload (client-side state change)

---

### 3. Login Flow - Asisten

#### 3.1 Display Asisten Login Form
**URL**: `http://localhost:8000/login?mode=asisten`

**Expected Form Fields:**
- **Username or Email** input
- **Password** input
- **Login/Masuk** submit button
- Link to Register page (if registration is enabled)
- Mode toggle buttons (Praktikan/Asisten)

**Expected Results:**
- Page title: "Login - Asisten"
- Asisten mode is visually active/selected
- Form uses different field names than Praktikan
- Vector illustration displayed

**API Endpoint**: `POST /login/asisten`

---

#### 3.2 Validation - Empty Fields
**Steps:**
1. Navigate to `/login?mode=asisten`
2. Submit form without filling fields
3. Check validation errors

**Expected Results:**
- Username/Email field shows "required" error
- Password field shows "required" error
- Form does not submit

---

#### 3.3 Validation - Invalid Credentials
**Steps:**
1. Enter invalid username: `nonexistent`
2. Enter invalid password: `wrongpass`
3. Submit form

**Expected Results:**
- Error message displayed
- User remains on login page
- No authentication occurs

---

#### 3.4 Successful Login (If Valid Credentials Available)
**Steps:**
1. Enter valid asisten credentials
2. Submit form

**Expected Results:**
- Redirect to asisten dashboard
- Different dashboard than praktikan
- Asisten-specific features visible

---

### 4. Registration Flow - Praktikan

#### 4.1 Display Praktikan Registration Form
**URL**: `http://localhost:8000/register?mode=praktikan`

**Expected Form Fields:**
- **NIM** input (Student ID)
- **Nama/Name** input (Full name)
- **Email** input
- **Password** input
- **Confirm Password** input
- **Kelas/Class** dropdown/select (likely)
- **Register/Daftar** submit button
- Link to Login page ("Sudah punya akun?" / "Already have account?")

**Expected Results:**
- Page title: "Register - Praktikan"
- All registration fields visible
- Password fields have visibility toggle (eye icon)
- Mode switcher available
- Vector illustration displayed

**Note**: Registration might be disabled (commented out in auth.php routes)

---

#### 4.2 Validation - Empty Fields
**Steps:**
1. Navigate to `/register?mode=praktikan`
2. Submit without filling fields

**Expected Results:**
- All required fields show validation errors
- Form does not submit

---

#### 4.3 Validation - Password Mismatch
**Steps:**
1. Fill all fields correctly
2. Password: `Password123!`
3. Confirm Password: `DifferentPassword`
4. Submit form

**Expected Results:**
- Validation error: "Passwords do not match"
- Form does not submit

---

#### 4.4 Validation - Invalid Email Format
**Steps:**
1. Fill NIM, name correctly
2. Email: `invalidemail`
3. Fill passwords correctly
4. Submit

**Expected Results:**
- Email field validation error: "Invalid email format"

---

#### 4.5 Validation - Duplicate NIM
**Steps:**
1. Fill form with existing NIM (e.g., `101022400284`)
2. Fill other fields correctly
3. Submit

**Expected Results:**
- Server validation error: "NIM already exists"
- User remains on registration page

---

#### 4.6 Complete Registration Form Filling
**Sample Data:**
- NIM: `101022400999`
- Nama: `Test Praktikan`
- Email: `testpraktikan@example.com`
- Password: `Password123!`
- Confirm Password: `Password123!`
- Kelas: Select from dropdown

**Steps:**
1. Fill all fields with valid data
2. Submit form

**Expected Results (if enabled):**
- Success message or redirect to login
- User can now login with credentials
- Database record created in `praktikans` table

**API Endpoint**: `POST /register/praktikan` (currently commented out)

---

### 5. Registration Flow - Asisten

#### 5.1 Display Asisten Registration Form
**URL**: `http://localhost:8000/register?mode=asisten`

**Expected Form Fields:**
- **Username** input
- **Nama/Name** input
- **Email** input
- **Password** input
- **Confirm Password** input
- **Register/Daftar** submit button
- Link to Login page

**Note**: Asisten registration might also be disabled

---

#### 5.2 Validation Scenarios
Similar to Praktikan registration:
- Empty fields validation
- Password mismatch
- Invalid email format
- Duplicate username

---

#### 5.3 Complete Registration
**Sample Data:**
- Username: `testasisten01`
- Nama: `Test Asisten`
- Email: `testasisten@example.com`
- Password: `Password123!`
- Confirm Password: `Password123!`

**API Endpoint**: `POST /register/asisten` (currently commented out)

---

### 6. Navigation & Mode Switching

#### 6.1 Login to Register Navigation
**Steps:**
1. Start on `/login?mode=praktikan`
2. Click "Register" or "Belum punya akun?" link
3. Verify navigation

**Expected Results:**
- URL changes to `/register?mode=praktikan`
- Mode parameter is preserved
- Registration form loads

---

#### 6.2 Register to Login Navigation
**Steps:**
1. Start on `/register?mode=praktikan`
2. Click "Login" or "Sudah punya akun?" link
3. Verify navigation

**Expected Results:**
- URL changes to `/login?mode=praktikan`
- Mode parameter is preserved
- Login form loads

---

#### 6.3 Mode Persistence Across Navigation
**Steps:**
1. Start on `/login?mode=asisten`
2. Navigate to register
3. Check if asisten mode is maintained

**Expected Results:**
- Registration page opens with `mode=asisten`
- Asisten registration form is displayed

---

#### 6.4 Back to Landing Page
**Steps:**
1. From login or register page, look for:
   - Logo link to home
   - Back button
   - Browser back button
2. Navigate back to landing

**Expected Results:**
- Landing page loads
- URL is `/`
- No authentication state conflicts

---

### 7. Modal-Based Authentication (From Landing Page)

#### 7.1 Open Login Modal from Landing
**Steps:**
1. From landing page (`/`)
2. Click "Get Started" or "Login" button
3. Modal opens OR page navigates

**Expected Behavior:**
- `AuthModal` component opens with `type: 'login'`
- URL updates to `/login` (via `window.history.pushState`)
- Login form is shown within modal
- Background landing page is still visible but dimmed

---

#### 7.2 Switch Between Login and Register in Modal
**Steps:**
1. Open login modal
2. Click "Register" link within modal
3. Observe behavior

**Expected Results:**
- Modal content switches to registration form
- URL updates to `/register`
- Modal remains open (no page reload)

---

#### 7.3 Close Modal Returns to Landing
**Steps:**
1. Open any auth modal
2. Click close button or press ESC
3. Verify behavior

**Expected Results:**
- Modal closes
- URL returns to `/`
- Landing page is fully visible again

---

#### 7.4 Validation Errors Keep Modal Open
**Steps:**
1. Open login modal
2. Submit invalid credentials
3. Check if modal stays open

**Expected Results:**
- Modal remains open after validation error
- Error message is displayed within modal
- User can correct and resubmit

---

### 8. Authentication Guards & Middleware

#### 8.1 Guest Middleware
**Routes Protected:**
- `/login`
- `/register`

**Test:**
1. Attempt to access login while already authenticated
2. Verify redirect to appropriate dashboard

**Expected Results:**
- `check.auth` middleware redirects based on user type
- Authenticated praktikan redirected to praktikan dashboard
- Authenticated asisten redirected to asisten dashboard

---

#### 8.2 Auth Middleware
**Test:**
1. Logout (if logged in)
2. Try to access protected routes directly

**Expected Results:**
- Redirect to `/login`
- Cannot access dashboard without authentication

---

### 9. Password Management

#### 9.1 Change Password - Praktikan
**Endpoint**: `PUT /praktikan/password`
**Middleware**: `auth:praktikan`, `can:ganti-password`

---

#### 9.2 Change Password - Asisten
**Endpoint**: `PUT /asisten/password`
**Middleware**: `auth:asisten`, `can:change-password`

---

### 10. Logout Functionality

#### 10.1 Logout - Praktikan
**Endpoint**: `POST /praktikan/logout`
**Route Name**: `logout.req.praktikan`
**Middleware**: `auth:praktikan`, `can:logout-praktikan`

---

#### 10.2 Logout - Asisten
**Endpoint**: `POST /asisten/logout`
**Route Name**: `logout.req.asisten`
**Middleware**: `auth:asisten`, `can:logout`

---

## Technical Details

### Authentication Architecture
- **Laravel Sanctum** for API token management
- **Separate guard contexts**: `auth:praktikan` and `auth:asisten`
- **Inertia.js** for SPA-like routing without page reloads
- **React** components for forms
- **Laravel Permissions** via gates and policies

### Form Submission
- Uses Inertia.js `router.post()` instead of traditional forms
- Client-side state management with React `useState`
- React Hot Toast for notifications

### Database Models
- **Praktikan** model (`praktikans` table)
- **Asisten** model (`asistens` table)
- Separate authentication tables for each role

---

## Test Data Samples

### Praktikan (from screenshots)
- NIM: `101022400284`, `101022500243`, `101022540003`
- Names: Fachry Muhammad Raffa, Aghnia Sayyida Alimi, Pande Gede Radhya Putra
- Classes: EL-49-INT, EL-49-06

### Asisten
- Need to query database or create test accounts
- Username pattern likely: `asisten01`, `asisten02`, etc.

---

## Playwright Test Commands

```bash
# Run all tests
npx playwright test tests-playwright/seed.spec.ts

# Run with UI
npx playwright test tests-playwright/seed.spec.ts --ui

# Run specific test
npx playwright test tests-playwright/seed.spec.ts -g "praktikan login"

# Debug mode
npx playwright test tests-playwright/seed.spec.ts --debug

# Generate screenshots
npx playwright test tests-playwright/seed.spec.ts --reporter=html
```

### Screenshot Output Location
`tests-playwright/screenshots/`

---

## Known Issues / Notes

1. **Registration routes are commented out** in `routes/auth.php`:
   - `Route::post('register/asisten', ...)`
   - `Route::post('register/praktikan', ...)`
   - Registration might be admin-only or disabled

2. **CORS Configuration**: 
   - Allowed origins: `localhost:5173`, `localhost:8000`, `127.0.0.1:5173`, `127.0.0.1:8000`
   - Sanctum stateful domains configured

3. **Session Domain**: Set to `localhost` in config

4. **Vite/Frontend**: 
   - Frontend might need to be running (`bun run dev` or `npm run dev`)
   - Check if `public/build/manifest.json` exists for production builds

---

## Prerequisites for Testing

1. **Application Running**: 
   ```bash
   php artisan serve
   # Runs on http://localhost:8000
   ```

2. **Database Seeded**: 
   ```bash
   php artisan migrate:fresh --seed
   ```

3. **Frontend Built** (if not using dev server):
   ```bash
   bun run build
   # or npm run build
   ```

4. **Playwright Installed**:
   ```bash
   npm install -D @playwright/test
   npx playwright install
   ```

---

## Next Steps

1. Run the test suite to explore actual UI behavior
2. Capture screenshots for documentation
3. Identify any missing test scenarios
4. Test authenticated dashboard features
5. Test role-specific permissions
6. Test module management, grading, feedback flows

---

**End of Test Plan Document**
