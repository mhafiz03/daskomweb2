# Asisten Authentication Flow - Test Plan

## Overview

Complete authentication workflow for **Asisten** users including login, password change, logout, and re-login verification.

**Components:**
- `LoginPage.jsx` - Login interface with mode parameter
- `LoginFormAssistant.jsx` - Kode/password form with validation
- `ModalPassword.jsx` - Password change modal (shared component)
- `ModalLogout.jsx` - Logout confirmation (Assistants)

**API Endpoints:**
- `POST /login/asisten` - Authenticate asisten
- `PUT /asisten/password` - Change password (requires `can:change-password`)
- `POST /asisten/confirm-password` - Confirm password (requires `can:change-password`)
- `POST /asisten/logout` - Destroy session (requires `can:logout`)

**Routes:**
- Login page: `/login?mode=asisten`
- Protected routes: `/assistants/*` (requires `auth:asisten`)

---

## Test Scenarios

### 1. Login Flow

#### 1.1 Successful Login
**Seed:** Create asisten with kode `B0T` and password `AsistenPass123`

**Steps:**
1. Navigate to `/login?mode=asisten`
2. Enter Kode: `B0T` (or `bot`, case-insensitive)
3. Enter Password: `AsistenPass123`
4. Click "Login" button

**Expected:**
- Input field auto-converts kode to uppercase
- Button shows loading state during submission
- API: `POST /login/asisten` with `{kode: "B0T", password: "AsistenPass123"}`
- Success toast: "Login successful!"
- Redirects to asisten default page
- Navigation sidebar displays asisten menu items
- Session established (`auth:asisten`)

#### 1.2 Invalid Credentials
**Steps:**
1. Navigate to `/login?mode=asisten`
2. Enter Kode: `B0T`
3. Enter Password: `WrongPassword`
4. Click "Login"

**Expected:**
- Login fails
- Error toast shows backend validation message
- Remains on login page
- Kode field retains value
- Password field cleared
- No session created

#### 1.3 Empty Fields - Client Validation
**Steps:**
1. Navigate to login page
2. Leave Kode empty
3. Enter Password: `SomePass123`
4. Click "Login"

**Expected:**
- Form submission prevented
- Toast error or validation message shown
- No API request sent

#### 1.4 Kode Field Length Limit
**Steps:**
1. Kode field: Try entering more than 3 characters
2. Observe behavior

**Expected:**
- Input field has `maxLength={3}` attribute
- Cannot type more than 3 characters
- Input converts to uppercase automatically
- Placeholder shows "B0T" as example

#### 1.5 Password Visibility Toggle
**Steps:**
1. Enter password in password field
2. Click eye icon to show password
3. Click eye icon again to hide

**Expected:**
- Password initially masked with dots
- Clicking eye icon displays plaintext
- Clicking again masks password
- Toggle preserves input value

---

### 2. Password Change Flow

#### 2.1 Open Password Change Modal
**Preconditions:** Logged in as asisten with `change-password` permission

**Steps:**
1. In navigation footer, click "Ubah Password" button
2. Observe modal

**Expected:**
- `ModalPassword` opens as overlay (z-50)
- Modal title: "Ganti Password"
- Close button (X) visible in header
- Two input fields:
  - "Password Saat Ini" (current_password)
  - "Password Baru" (password)
- Hint text: "Password minimal 8 karakter"
- "Simpan" button enabled

**Note:** Permission `can:change-password` required to access this feature

#### 2.2 Successful Password Change
**Steps:**
1. Modal is open
2. Password Saat Ini: `AsistenPass123`
3. Password Baru: `NewAsistenPass456`
4. Click "Simpan"

**Expected:**
- Client validation passes (>= 8 characters)
- API: `PUT /asisten/password` with `{current_password, password}`
- Loading state: Button text changes to "Menyimpan..."
- Success modal displays (z-60):
  - Green checkmark icon
  - "Berhasil!" title
  - "Password berhasil diubah" message
- Success modal auto-closes after 1.5 seconds
- Main modal closes
- Session remains active
- Password updated in database

#### 2.3 Password Too Short (Client Validation)
**Steps:**
1. Password Saat Ini: `AsistenPass123`
2. Password Baru: `short` (5 chars)
3. Click "Simpan"

**Expected:**
- Client validation error
- Error modal displays (z-60):
  - Red "Error" title
  - Failed icon
  - Message: "Password baru harus minimal 8 karakter."
- No API request sent
- Can close error modal and retry
- Main modal remains open

#### 2.4 Empty Fields (Client Validation)
**Steps:**
1. Leave Password Saat Ini empty
2. Password Baru: `ValidPass123`
3. Click "Simpan"

**Expected:**
- Error modal displays
- Message: "Semua kolom harus diisi."
- No API request
- Main modal remains open

#### 2.5 Incorrect Current Password (Server Validation)
**Steps:**
1. Password Saat Ini: `WrongPassword`
2. Password Baru: `ValidPass123`
3. Click "Simpan"

**Expected:**
- API request sent: `PUT /asisten/password`
- Backend validation fails
- Error modal displays with server error message
- Password not changed
- Can correct and retry

#### 2.6 Permission Check
**Steps:**
1. Login as asisten without `change-password` permission
2. Attempt to access password change feature

**Expected:**
- "Ubah Password" button not visible in navigation OR
- Clicking triggers permission error
- API request blocked by `can:change-password` middleware
- User notified of insufficient permissions

#### 2.7 Cancel Password Change
**Steps:**
1. Fill both fields with valid data
2. Click close button (X) or click outside modal overlay

**Expected:**
- Modal closes without saving
- No API request sent
- Password unchanged
- Can reopen modal later

---

### 3. Logout Flow

#### 3.1 Open Logout Confirmation
**Preconditions:** Logged in with `logout` permission

**Steps:**
1. In navigation footer, click "Keluar" button (red)
2. Observe modal

**Expected:**
- `ModalLogout` opens (fixed position, z-50)
- Background overlay: semi-transparent black
- Modal content:
  - Title: "Apakah Kamu Yakin?"
  - "Ya" button (green)
  - "Tidak" button (red)
- Close button available

#### 3.2 Confirm Logout
**Steps:**
1. Logout modal is open
2. Click "Ya" button

**Expected:**
- API: `POST /asisten/logout`
- On success: `window.location.href = '/'`
- Hard redirect to landing page
- Session destroyed
- Auth cookie/token removed
- Cannot access protected routes

#### 3.3 Cancel Logout
**Steps:**
1. Logout modal is open
2. Click "Tidak" button or close button

**Expected:**
- Modal closes
- No API request sent
- Session remains active
- Still logged in

#### 3.4 Verify Protected Route Access Blocked
**Steps:**
1. After successful logout
2. Manually navigate to `/assistants/start-praktikum`

**Expected:**
- `auth:asisten` middleware blocks access
- Redirect to login page
- Message prompting to login

#### 3.5 Permission Check
**Steps:**
1. Login as asisten without `logout` permission (edge case)
2. Attempt to logout

**Expected:**
- Logout functionality requires `can:logout` permission
- Middleware enforces permission
- Unauthorized users blocked

---

### 4. Re-Login Verification

#### 4.1 Attempt Login with Old Password
**Preconditions:** Password was changed from `AsistenPass123` to `NewAsistenPass456`

**Steps:**
1. Navigate to `/login?mode=asisten`
2. Kode: `B0T`
3. Password: `AsistenPass123` (old password)
4. Click "Login"

**Expected:**
- Login fails
- Error toast with authentication failure message
- Remains on login page
- Old password no longer valid

#### 4.2 Login with New Password
**Steps:**
1. Kode: `B0T`
2. Password: `NewAsistenPass456` (new password)
3. Click "Login"

**Expected:**
- Login succeeds
- Success toast: "Login successful!"
- Redirect to asisten dashboard
- Session created
- Confirms password change was successful

---

### 5. Permission-Based Features

#### 5.1 Login with Different Permission Sets
**Steps:**
1. Create asisten with limited permissions (e.g., only `start praktikum`)
2. Login successfully
3. Check navigation menu

**Expected:**
- Only permitted features visible in navigation
- Restricted features not shown
- Attempting to access restricted route redirects or shows error

#### 5.2 Admin Role Features
**Steps:**
1. Login as asisten with admin role (SOFTWARE, KORDAS, WAKORDAS, ADMIN)
2. Observe navigation

**Expected:**
- Admin-only menu items visible:
  - Configuration
  - Manage Asisten
  - Manage Praktikan
  - Plotting Jadwal
  - etc.
- Role-based access control enforced

---

### 6. Security Testing

#### 6.1 SQL Injection Prevention
**Steps:**
1. Navigate to login page
2. Kode: `' OR '1'='1`
3. Password: `' OR '1'='1`
4. Click "Login"

**Expected:**
- Login fails
- Input sanitized by backend
- Error toast shows invalid credentials
- No SQL injection vulnerability

#### 6.2 XSS Prevention
**Steps:**
1. Kode: `<script>alert('XSS')</script>` (will be truncated to 3 chars)
2. Password: `test123`
3. Submit form

**Expected:**
- Input escaped/sanitized
- No script execution
- Form handles input safely

#### 6.3 HTTPS Transmission
**Steps:**
1. Open DevTools > Network tab
2. Submit login form
3. Inspect request details

**Expected:**
- Request sent via HTTPS
- Password in request body (not URL)
- Secure transmission (encrypted)

#### 6.4 Password Field Masking
**Steps:**
1. Type password in any password field
2. Observe display

**Expected:**
- Password masked by default (type="password")
- Only reveals when toggle clicked
- No plaintext exposure

---

### 7. Session Management

#### 7.1 Multi-Tab Logout Synchronization
**Steps:**
1. Login in Tab A
2. Open same site in Tab B
3. Logout in Tab A
4. Attempt action in Tab B

**Expected:**
- Tab B redirects to login on next protected action
- Session shared via server-side auth
- Auth middleware enforces logout state

#### 7.2 Session Timeout
**Steps:**
1. Login successfully
2. Remain idle for configured timeout period
3. Attempt navigation

**Expected:**
- Session expires
- Redirect to login page
- Must re-authenticate

---

### 8. Edge Cases

#### 8.1 Kode Case Insensitivity
**Steps:**
1. Enter Kode: `bot` (lowercase)
2. Password: Correct password
3. Submit

**Expected:**
- Input field auto-converts to uppercase: `BOT`
- Login succeeds (backend handles case-insensitively)
- Kode displayed as uppercase

#### 8.2 Password Change During Active Session
**Steps:**
1. Open app in 2 tabs with same asisten logged in
2. Change password in Tab A
3. Try to use Tab B

**Expected:**
- Tab B session still valid initially
- Tab B can continue working
- Next login requires new password

#### 8.3 Forgot Password Link
**Steps:**
1. On login page, click "Forgot Password?" link
2. Observe modal

**Expected:**
- `ModalForgotPass` opens
- Password recovery interface shown
- Separate flow from main login

---

## Test Data

**Asisten Account:**
- Kode: `B0T`
- Initial Password: `AsistenPass123`
- Changed Password: `NewAsistenPass456`
- Permissions: `change-password`, `logout`

**Admin Asisten Account:**
- Kode: `ADM`
- Password: `AdminPass123`
- Role: `SOFTWARE` or `ADMIN`
- All permissions granted

---

## Success Criteria

✅ Valid login creates session and redirects to dashboard  
✅ Invalid credentials rejected with appropriate error  
✅ Kode field enforces 3-character limit and uppercase  
✅ Password change validates minimum 8 characters  
✅ Password change updates successfully with correct current password  
✅ Empty fields show client-side validation error  
✅ Incorrect current password rejected by server  
✅ Logout destroys session and redirects to landing page  
✅ Old password invalid after change  
✅ New password works for subsequent login  
✅ Permission-based access control enforced  
✅ Security: SQL injection prevented  
✅ Security: XSS prevented  
✅ Security: Passwords transmitted over HTTPS  

---

**Seed File:** `tests/seed-asisten-auth.spec.ts`  
**Backend Middleware:** `auth:asisten`, `can:change-password`, `can:logout`  
**Frontend Components:** LoginFormAssistant, ModalPassword, ModalLogout (Assistants)
