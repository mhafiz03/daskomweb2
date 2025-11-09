# Praktikan Authentication Flow - Test Plan

## Overview

Complete authentication workflow for **Praktikan** users including login, password change, logout, and re-login verification.

**Components:**
- `LoginPage.jsx` - Login interface with mode parameter
- `LoginFormPraktikan.jsx` - NIM/password form with validation
- `ModalPassword.jsx` - Password change modal (shared component)
- `ModalLogout.jsx` - Logout confirmation (Praktikans)

**API Endpoints:**
- `POST /login/praktikan` - Authenticate praktikan
- `PUT /praktikan/password` - Change password (requires `can:ganti-password`)
- `POST /praktikan/logout` - Destroy session (requires `can:logout-praktikan`)

**Routes:**
- Login page: `/login?mode=praktikan`
- Protected routes: `/praktikan/*` (requires `auth:praktikan`)

---

## Test Scenarios

### 1. Login Flow

#### 1.1 Successful Login
**Seed:** Create praktikan with NIM `1234567890` and password `TestPass123`

**Steps:**
1. Navigate to `/login?mode=praktikan`
2. Enter NIM: `1234567890`
3. Enter Password: `TestPass123`
4. Click "Login" button

**Expected:**
- Button shows loading state during submission
- API: `POST /login/praktikan` with `{nim: "1234567890", password: "TestPass123"}`
- Success toast: "Login successful!"
- Redirects to praktikan dashboard
- Navigation sidebar displays praktikan menu
- Session established (`auth:praktikan`)

#### 1.2 Invalid Credentials
**Steps:**
1. Navigate to `/login?mode=praktikan`
2. Enter NIM: `1234567890`
3. Enter Password: `WrongPassword`
4. Click "Login"

**Expected:**
- Login fails
- Error toast shows backend validation message
- Remains on login page
- NIM field retains value
- Password field cleared
- No session created

#### 1.3 Empty Fields Client Validation
**Steps:**
1. Navigate to login page
2. Leave NIM empty
3. Enter Password: `SomePass123`
4. Click "Login"

**Expected:**
- Client-side validation triggers
- Error toast: "NIM and Password are required."
- No API request sent
- Form not submitted

#### 1.4 Password Visibility Toggle
**Steps:**
1. Enter password in password field
2. Click eye icon to show password
3. Click eye icon again to hide

**Expected:**
- Password initially masked with dots/asterisks
- Clicking eyeOpen icon displays plaintext
- Clicking eyeClose icon masks password again
- Toggle works without losing input value

---

### 2. Password Change Flow

#### 2.1 Open Password Change Modal
**Preconditions:** Logged in as praktikan

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

#### 2.2 Successful Password Change
**Steps:**
1. Modal is open
2. Password Saat Ini: `TestPass123`
3. Password Baru: `NewPass456`
4. Click "Simpan"

**Expected:**
- Client validation passes (>= 8 characters)
- API: `PUT /praktikan/password` with `{current_password, password}`
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
1. Password Saat Ini: `TestPass123`
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
- API request sent: `PUT /praktikan/password`
- Backend validation fails
- Error modal displays with server error message
- Password not changed
- Can correct and retry

#### 2.6 Cancel Password Change
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
**Steps:**
1. In navigation footer, click "Keluar" button (red)
2. Observe modal

**Expected:**
- `ModalLogout` opens (fixed position, z-50)
- Background overlay: semi-transparent black
- Modal content:
  - Title: "Apakah Kamu Yakin?"
  - "Ya" button (green, deepForestGreen)
  - "Tidak" button (red, softRed)
- Close button available

#### 3.2 Confirm Logout
**Steps:**
1. Logout modal is open
2. Click "Ya" button

**Expected:**
- API: `POST /praktikan/logout`
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
2. Manually navigate to `/praktikan/praktikum`

**Expected:**
- `auth:praktikan` middleware blocks access
- Redirect to login page
- Message prompting to login

---

### 4. Re-Login Verification

#### 4.1 Attempt Login with Old Password
**Preconditions:** Password was changed from `TestPass123` to `NewPass456`

**Steps:**
1. Navigate to `/login?mode=praktikan`
2. NIM: `1234567890`
3. Password: `TestPass123` (old password)
4. Click "Login"

**Expected:**
- Login fails
- Error toast with authentication failure message
- Remains on login page
- Old password no longer valid

#### 4.2 Login with New Password
**Steps:**
1. NIM: `1234567890`
2. Password: `NewPass456` (new password)
3. Click "Login"

**Expected:**
- Login succeeds
- Success toast: "Login successful!"
- Redirect to praktikan dashboard
- Session created
- Confirms password change was successful

---

### 5. Security Testing

#### 5.1 SQL Injection Prevention
**Steps:**
1. Navigate to login page
2. NIM: `' OR '1'='1`
3. Password: `' OR '1'='1`
4. Click "Login"

**Expected:**
- Login fails
- Input sanitized by backend
- Error toast shows invalid credentials
- No SQL injection vulnerability

#### 5.2 XSS Prevention
**Steps:**
1. NIM: `<script>alert('XSS')</script>`
2. Password: `test123`
3. Submit form

**Expected:**
- Input escaped/sanitized
- No script execution
- Form handles input safely

#### 5.3 HTTPS Transmission
**Steps:**
1. Open DevTools > Network tab
2. Submit login form
3. Inspect request details

**Expected:**
- Request sent via HTTPS
- Password in request body (not URL)
- Secure transmission (encrypted)

#### 5.4 Password Field Masking
**Steps:**
1. Type password in any password field
2. Observe display

**Expected:**
- Password masked by default (type="password")
- Only reveals when toggle clicked
- No plaintext exposure

---

### 6. Session Management

#### 6.1 Multi-Tab Logout Synchronization
**Steps:**
1. Login in Tab A
2. Open same site in Tab B
3. Logout in Tab A
4. Attempt action in Tab B

**Expected:**
- Tab B redirects to login on next protected action
- Session shared via server-side auth
- Auth middleware enforces logout state

#### 6.2 Session Timeout
**Steps:**
1. Login successfully
2. Remain idle for configured timeout period
3. Attempt navigation

**Expected:**
- Session expires
- Redirect to login page
- Must re-authenticate

---

### 7. Edge Cases

#### 7.1 Numeric-Only NIM Input
**Steps:**
1. NIM field: Try entering non-numeric characters
2. Observe behavior

**Expected:**
- Input field has `inputMode="numeric"` and `pattern="[0-9]*"`
- Mobile keyboards show numeric layout
- Backend validates NIM format

#### 7.2 Password Change During Active Session
**Steps:**
1. Open app in 2 tabs with same praktikan logged in
2. Change password in Tab A
3. Try to change password again in Tab B

**Expected:**
- Tab B session still valid
- Tab B can change password
- Latest change takes effect

#### 7.3 Login After Session Destruction
**Steps:**
1. Login successfully
2. Backend manually destroys session
3. User attempts navigation

**Expected:**
- Auth middleware detects invalid session
- Redirect to login
- No crash or unexpected behavior

---

## Test Data

**Praktikan Account:**
- NIM: `1234567890`
- Initial Password: `TestPass123`
- Changed Password: `NewPass456`
- Permission: `ganti-password`, `logout-praktikan`

---

## Success Criteria

✅ Valid login creates session and redirects to dashboard  
✅ Invalid credentials rejected with appropriate error  
✅ Password change validates minimum 8 characters  
✅ Password change updates successfully with correct current password  
✅ Empty fields show client-side validation error  
✅ Incorrect current password rejected by server  
✅ Logout destroys session and redirects to landing page  
✅ Old password invalid after change  
✅ New password works for subsequent login  
✅ Security: SQL injection prevented  
✅ Security: XSS prevented  
✅ Security: Passwords transmitted over HTTPS  

---

**Seed File:** `tests/seed-praktikan-auth.spec.ts`  
**Backend Middleware:** `auth:praktikan`, `can:ganti-password`, `can:logout-praktikan`  
**Frontend Components:** LoginFormPraktikan, ModalPassword, ModalLogout (Praktikans)
