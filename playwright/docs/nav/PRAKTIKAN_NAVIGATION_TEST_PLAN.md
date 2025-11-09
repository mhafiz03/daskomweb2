# Praktikan Navigation Test Plan

**Created**: November 9, 2025  
**Base URL**: http://localhost:8000  
**User Type**: Praktikan (Student)

---

## Overview

This test plan covers the complete navigation system for authenticated praktikan users in the Daskom Laboratory application. The praktikan navigation is a collapsible sidebar with 7 main menu items plus utility functions (password change and logout).

---

## Navigation Structure

### Main Navigation Component
**Component**: `PraktikanNav.jsx` (`resources/js/Components/Common/PraktikanNav.jsx`)  
**Layout**: `PraktikanAuthenticatedLayout.jsx`

### Navigation States
1. **Collapsed** (default) - Icons only, width: 48px
2. **Expanded** - Icons + labels, width: 230px
3. **Animating** - Transition between states (300ms)

### Local Storage
- **Key**: `praktikanNavCollapsed`
- **Values**: `'true'` (collapsed) or `'false'` (expanded)
- **Persistence**: Navigation state persists across sessions

---

## Navigation Menu Items

### 1. Profile
- **Route**: `/praktikan`
- **Icon**: Profile icon (person silhouette)
- **Label**: "Profile"
- **Page**: `ProfilePraktikan.jsx`
- **Permission**: `can:lihat-profile`
- **Middleware**: `auth:praktikan`

### 2. Praktikum
- **Route**: `/praktikum`
- **Icon**: Praktikum icon (lab equipment)
- **Label**: "Praktikum"
- **Page**: `PraktikumPage.jsx`
- **Permission**: `can:lihat-modul`
- **Middleware**: `auth:praktikan`

### 3. Modul
- **Route**: `/praktikan-modul`
- **Icon**: Module icon (book/document)
- **Label**: "Modul"
- **Page**: `ModulesPage.jsx`
- **Permission**: `can:lihat-modul`
- **Middleware**: `auth:praktikan`

### 4. Tugas Pendahuluan
- **Route**: `/tugas-pendahuluan`
- **Icon**: Report/Laporan icon
- **Label**: "Tugas Pendahuluan"
- **Page**: `TugasPendahuluanPage.jsx`
- **Permission**: `can:lihat-modul`
- **Middleware**: `auth:praktikan`

### 5. Nilai (Grades/Scores)
- **Route**: `/score-praktikan`
- **Icon**: Nilai icon (grade/score)
- **Label**: "Nilai"
- **Page**: `ScorePraktikan.jsx`
- **Permission**: `can:lihat-nilai`
- **Middleware**: `auth:praktikan`

### 6. Asisten (Contact Assistant)
- **Route**: `/contact-assistant`
- **Icon**: Asisten icon (person with badge)
- **Label**: "Asisten"
- **Page**: `ContactAssistant.jsx`
- **Permission**: `can:lihat-asisten`
- **Middleware**: `auth:praktikan`

### 7. Polling
- **Route**: `/polling-assistant`
- **Icon**: Polling icon (chart/survey)
- **Label**: "Polling"
- **Page**: `PollingPage.jsx`
- **Permission**: None specified
- **Middleware**: `auth:praktikan`

---

## Utility Functions

### Change Password
- **Action**: Opens `ModalPassword` modal
- **Icon**: Change password icon (key/lock)
- **Label**: "Change Password"
- **API**: `PUT /praktikan/password`
- **Component**: `ModalPassword` with `updatePraktikanPassword` action

### Logout
- **Action**: Opens `ModalLogout` confirmation modal
- **Icon**: Logout icon (exit/door)
- **Label**: "Logout"
- **API**: `POST /praktikan/logout`
- **Component**: `ModalLogout` with `logoutPraktikan` action
- **Redirect**: After logout → `/` (landing page)

---

## Test Scenarios

### 1. Navigation Sidebar Behavior

#### 1.1 Initial Load - Collapsed State
**Seed File**: Start from any praktikan authenticated page

**Steps:**
1. Login as praktikan
2. Observe the sidebar state on first load
3. Check localStorage for `praktikanNavCollapsed` key

**Expected Results:**
- Sidebar is collapsed by default (width: 48px)
- Only icons are visible
- Labels are hidden (opacity: 0)
- Hamburger menu button shows three horizontal lines
- localStorage key `praktikanNavCollapsed` = `'true'`

---

#### 1.2 Toggle Sidebar - Expand
**Steps:**
1. Start with collapsed sidebar
2. Click the hamburger menu button (three lines)
3. Observe animation

**Expected Results:**
- Sidebar expands to 230px width
- Animation duration: 300ms
- Labels fade in (opacity: 0 → 1, delay: 300ms)
- Hamburger icon transforms to X (top & bottom lines rotate 45°/-45°, middle line fades)
- localStorage updates to `'false'`
- All 7 menu items are fully visible with labels
- Change Password and Logout buttons are visible with labels

---

#### 1.3 Toggle Sidebar - Collapse
**Steps:**
1. Start with expanded sidebar
2. Click the hamburger (X) button
3. Observe animation

**Expected Results:**
- Labels fade out immediately (opacity: 1 → 0, no delay)
- Wait 300ms animation
- Sidebar collapses to 48px width
- Hamburger icon transforms back to three lines
- localStorage updates to `'true'`
- Only icons remain visible

---

#### 1.4 State Persistence Across Navigation
**Steps:**
1. Expand the sidebar (localStorage = `'false'`)
2. Navigate to a different praktikan page (e.g., Profile → Modul)
3. Observe sidebar state

**Expected Results:**
- Sidebar remains expanded
- Navigation state persists
- No flashing/flickering

**Steps (Collapsed):**
1. Collapse the sidebar (localStorage = `'true'`)
2. Navigate to a different praktikan page
3. Observe sidebar state

**Expected Results:**
- Sidebar remains collapsed
- State persists correctly

---

#### 1.5 State Persistence Across Browser Refresh
**Steps:**
1. Set sidebar to expanded state
2. Refresh the browser (F5 or Ctrl+R)
3. Check sidebar state

**Expected Results:**
- Sidebar loads in expanded state
- localStorage value is read correctly
- No re-animation on page load

---

### 2. Navigation Menu Items

#### 2.1 Navigate to Profile
**URL**: `http://localhost:8000/praktikan`

**Steps:**
1. Login as praktikan
2. Click on "Profile" menu item
3. Verify page load and active state

**Expected Results:**
- URL changes to `/praktikan`
- `ProfilePraktikan` page loads
- Profile menu item shows active state:
  - Background: `--depth-color-primary` (highlighted)
  - Text color: white
  - Right side indicator bar (white/70% opacity, 4px width)
  - Icon filter: active (white tint)
- Other menu items remain inactive
- Page title updates
- Profile content is visible

**Page Content** (to verify correct page):
- Praktikan profile information
- NIM, Name, Class, Email display
- Profile picture
- Edit profile functionality

---

#### 2.2 Navigate to Praktikum
**URL**: `http://localhost:8000/praktikum`

**Steps:**
1. From any praktikan page, click "Praktikum"
2. Verify page load and navigation

**Expected Results:**
- URL changes to `/praktikum`
- `PraktikumPage` page loads
- Praktikum menu item is highlighted (active state)
- Other items are inactive
- Page shows practicum/lab session content
- Permission `can:lihat-modul` is checked

**Page Content** (to verify):
- Current practicum module
- Lab session details
- Progress indicators
- Questions/assignments for current session

---

#### 2.3 Navigate to Modul
**URL**: `http://localhost:8000/praktikan-modul`

**Steps:**
1. Click "Modul" menu item
2. Verify page load

**Expected Results:**
- URL changes to `/praktikan-modul`
- `ModulesPage` page loads
- Modul menu item is active
- Page displays list of modules
- Module cards/list visible
- Each module shows:
  - Title
  - Description
  - Learning outcomes
  - Resources (PPT, Video, Module PDF)
  - Lock/unlock status

---

#### 2.4 Navigate to Tugas Pendahuluan
**URL**: `http://localhost:8000/tugas-pendahuluan`

**Steps:**
1. Click "Tugas Pendahuluan" menu item
2. Verify page load

**Expected Results:**
- URL changes to `/tugas-pendahuluan`
- `TugasPendahuluanPage` page loads
- Tugas Pendahuluan menu item is active
- Page displays preliminary assignments
- Assignment list or submission interface visible
- Due dates, status, and grades (if applicable) shown

---

#### 2.5 Navigate to Nilai (Scores)
**URL**: `http://localhost:8000/score-praktikan`

**Steps:**
1. Click "Nilai" menu item
2. Verify page load

**Expected Results:**
- URL changes to `/score-praktikan`
- `ScorePraktikan` page loads
- Nilai menu item is active
- Permission `can:lihat-nilai` is checked
- Page displays grades/scores
- Score breakdown visible:
  - TP (Tugas Pendahuluan) score
  - TA (Tugas Akhir) score
  - D1-D4 (Diskusi) scores
  - I1-I2 (Implementasi) scores
  - Total/final grade

---

#### 2.6 Navigate to Asisten (Contact Assistant)
**URL**: `http://localhost:8000/contact-assistant`

**Steps:**
1. Click "Asisten" menu item
2. Verify page load

**Expected Results:**
- URL changes to `/contact-assistant`
- `ContactAssistant` page loads
- Asisten menu item is active
- Permission `can:lihat-asisten` is checked
- Page displays assistant contact information
- Assistant profiles/cards visible:
  - Name
  - Photo
  - Contact details (email, WhatsApp, etc.)
  - Duty schedule
  - Availability status

---

#### 2.7 Navigate to Polling
**URL**: `http://localhost:8000/polling-assistant`

**Steps:**
1. Click "Polling" menu item
2. Verify page load

**Expected Results:**
- URL changes to `/polling-assistant`
- `PollingPage` page loads
- Polling menu item is active
- Page displays polling/survey interface
- Active polls visible
- Previous polls/results accessible
- Submission interface if polls are open

---

### 3. Active Menu Item Highlighting

#### 3.1 Visual Active State
**Steps:**
1. Navigate to any praktikan page
2. Observe the corresponding menu item styling

**Expected Active Item Styling:**
- **Background**: Primary color (`--depth-color-primary`)
- **Text Color**: White/gray-50
- **Shadow**: Depth shadow (elevated appearance)
- **Icon**: 100% opacity with active filter (white tint)
- **Right Indicator**: Vertical bar (white/70%, 4px wide, rounded)
- **Hover Effect**: Maintains active background (no color change)

**Expected Inactive Item Styling:**
- **Background**: Transparent
- **Text Color**: `text-depth-primary`
- **Icon**: 70% opacity (100% on hover)
- **Hover**: Background changes to `bg-depth-interactive`
- **Hover**: Slight upward translate (-0.5px) and shadow

---

#### 3.2 Multiple Path Matching
**Steps:**
1. Navigate to different pages
2. Verify correct menu item is highlighted based on URL path

**Expected Behavior:**
Each menu item defines `paths` array for matching:
- Profile: `["/praktikan"]` - Matches only `/praktikan`
- Praktikum: `["/praktikum"]` - Matches `/praktikum` and sub-routes
- Modul: `["/praktikan-modul"]`
- Tugas Pendahuluan: `["/tugas-pendahuluan"]`
- Nilai: `["/score-praktikan"]`
- Asisten: `["/contact-assistant"]`
- Polling: `["/polling-assistant"]`

**Test Cases:**
- `/praktikan` → Profile is active
- `/praktikan/edit` → Profile should remain active (if route exists)
- `/praktikum` → Praktikum is active
- `/score-praktikan` → Nilai is active

---

### 4. Change Password Functionality

#### 4.1 Open Change Password Modal
**Steps:**
1. Navigate to any praktikan page
2. Scroll to bottom of sidebar (if needed)
3. Click "Change Password" button

**Expected Results:**
- `ModalPassword` modal opens
- Modal overlay dims the background
- Modal is centered on screen
- Modal title: "Change Password" or similar
- Form fields visible:
  - Current Password
  - New Password
  - Confirm New Password
- Submit and Cancel buttons present

---

#### 4.2 Change Password - Validation
**Steps:**
1. Open change password modal
2. Leave all fields empty
3. Click submit

**Expected Results:**
- Validation errors shown for required fields
- Form does not submit
- Modal remains open

**Steps (Password Mismatch):**
1. Fill current password
2. New Password: `NewPass123!`
3. Confirm: `DifferentPass`
4. Submit

**Expected Results:**
- Validation error: "Passwords do not match"
- Form does not submit

---

#### 4.3 Change Password - Success
**Steps:**
1. Open change password modal
2. Current Password: (valid current password)
3. New Password: `ValidNewPass123!`
4. Confirm Password: `ValidNewPass123!`
5. Submit

**Expected Results:**
- API call: `PUT /praktikan/password`
- Success toast notification
- Modal closes automatically
- User remains authenticated
- Can re-login with new password

---

#### 4.4 Change Password - Wrong Current Password
**Steps:**
1. Open change password modal
2. Current Password: `WrongPassword123`
3. New Password: `ValidNewPass123!`
4. Confirm Password: `ValidNewPass123!`
5. Submit

**Expected Results:**
- API returns error (401 or 422)
- Error message displayed: "Current password is incorrect"
- Modal remains open
- Password is not changed

---

#### 4.5 Close Change Password Modal
**Steps:**
1. Open change password modal
2. Click Cancel button OR close button (X) OR click outside modal

**Expected Results:**
- Modal closes
- Form is reset (if reopened, fields are empty)
- No changes are saved
- Returns to previous page state

---

### 5. Logout Functionality

#### 5.1 Open Logout Confirmation Modal
**Steps:**
1. Navigate to any praktikan page
2. Scroll to bottom of sidebar
3. Click "Logout" button

**Expected Results:**
- `ModalLogout` modal opens
- Modal overlay appears
- Confirmation message: "Are you sure you want to logout?" or similar
- Two buttons visible:
  - Cancel (secondary style)
  - Logout/Confirm (danger/red style)

---

#### 5.2 Cancel Logout
**Steps:**
1. Open logout modal
2. Click "Cancel" button OR close modal

**Expected Results:**
- Modal closes
- User remains logged in
- No API call is made
- Returns to the page they were on
- All functionality remains available

---

#### 5.3 Confirm Logout - Success
**Steps:**
1. Open logout modal
2. Click "Logout" or "Confirm" button

**Expected Results:**
- API call: `POST /praktikan/logout`
- Session is destroyed
- Authentication token removed (Sanctum)
- Redirect to landing page: `/`
- URL changes to `http://localhost:8000/`
- User sees public landing page
- Cannot access authenticated routes anymore

**Verification:**
1. After logout, try to navigate to `/praktikan`
2. Should redirect to `/login` or show unauthorized

---

#### 5.4 Logout on API Error
**Steps:**
1. Open logout modal
2. Simulate network error or 500 response
3. Click logout

**Expected Results:**
- Error handling occurs
- Error message displayed
- Modal may close or remain open (based on implementation)
- User sees error notification
- Can retry logout

---

### 6. Keyboard Navigation & Accessibility

#### 6.1 Keyboard Focus
**Steps:**
1. Navigate to any praktikan page
2. Press Tab key repeatedly
3. Observe focus order

**Expected Results:**
- Hamburger button receives focus first
- Focus ring visible (`focus-visible:ring-2`)
- Tab order follows visual order:
  1. Hamburger toggle
  2. Profile link
  3. Praktikum link
  4. Modul link
  5. Tugas Pendahuluan link
  6. Nilai link
  7. Asisten link
  8. Polling link
  9. Change Password button
  10. Logout button
- Focus ring color matches primary color

---

#### 6.2 Enter Key Navigation
**Steps:**
1. Tab to any menu item
2. Press Enter key

**Expected Results:**
- Navigates to the corresponding page
- Same as clicking with mouse
- Active state updates correctly

---

#### 6.3 Aria Labels
**Steps:**
1. Use screen reader (or inspect HTML)
2. Check for proper ARIA attributes

**Expected Elements:**
- Hamburger button: `aria-label="Toggle navigation"`
- Menu items: Proper link text/labels
- Icons: `alt` attributes on images
- Modals: `role="dialog"`, `aria-labelledby`

---

### 7. Responsive Behavior

#### 7.1 Desktop View (1920px+)
**Steps:**
1. Set viewport to desktop size (1920x1080)
2. Observe navigation

**Expected Results:**
- Sidebar is fully visible
- Expand/collapse works smoothly
- No horizontal scrolling
- Content adjusts to sidebar state

---

#### 7.2 Laptop View (1366px)
**Steps:**
1. Resize to 1366x768
2. Test navigation

**Expected Results:**
- Sidebar remains functional
- Content area adjusts width
- No overlap with main content

---

#### 7.3 Tablet View (768px)
**Steps:**
1. Resize to tablet dimensions
2. Test navigation

**Expected Results:**
- Sidebar may overlay or remain collapsed
- Hamburger functionality preserved
- Touch-friendly hit targets

---

#### 7.4 Mobile View (375px)
**Steps:**
1. Resize to mobile phone size
2. Test navigation

**Expected Results:**
- Sidebar behavior adapts
- May become drawer/overlay
- Full-width menu items if expanded
- Accessible on touch devices

---

### 8. Animation & Transitions

#### 8.1 Sidebar Animation Timing
**Steps:**
1. Toggle sidebar multiple times
2. Observe animation smoothness

**Expected Results:**
- Collapse animation: Labels fade → wait → sidebar width shrinks
- Expand animation: Sidebar width grows → labels fade in
- Total duration: 300ms
- Smooth easing function
- No jarring transitions

---

#### 8.2 Icon Filter Transitions
**Steps:**
1. Hover over inactive menu items
2. Observe icon opacity change

**Expected Results:**
- Inactive icons: 70% opacity
- On hover: 100% opacity
- Smooth transition (CSS `transition`)
- Active icons: Always 100% opacity

---

#### 8.3 Hover Effects
**Steps:**
1. Hover over menu items
2. Observe visual feedback

**Expected Results:**
- Inactive items:
  - Background changes to `bg-depth-interactive`
  - Slight upward translate (-0.5px)
  - Shadow increases (`shadow-depth-md`)
- Active items:
  - No background color change (remains primary)
  - Same translate and shadow effect

---

### 9. Edge Cases & Error Handling

#### 9.1 Rapid Toggle Clicking
**Steps:**
1. Click hamburger button very quickly multiple times
2. Observe behavior

**Expected Results:**
- Animation doesn't break
- Final state matches localStorage
- No visual glitches
- `isAnimating` state prevents conflicts

---

#### 9.2 Navigation During Slow Network
**Steps:**
1. Throttle network to "Slow 3G"
2. Click multiple menu items quickly
3. Observe behavior

**Expected Results:**
- Active state updates immediately (optimistic UI)
- Page loads when ready
- No duplicate requests
- User sees loading indicator (if implemented)

---

#### 9.3 Missing Permissions
**Steps:**
1. Login as praktikan with restricted permissions
2. Try to access protected pages

**Expected Results:**
- Menu items for restricted pages may be hidden OR
- Clicking shows "Unauthorized" message
- Redirect to safe page (like Profile)
- Error toast notification

---

#### 9.4 Expired Session
**Steps:**
1. Login as praktikan
2. Let session expire (or delete cookies)
3. Click on any menu item

**Expected Results:**
- Redirect to login page
- Session expiration message
- After re-login, redirects to intended page

---

### 10. Integration Tests

#### 10.1 Full Navigation Flow
**Steps:**
1. Login as praktikan
2. Navigate through all 7 menu items in order
3. Verify each page loads correctly

**Expected Flow:**
1. Profile → View profile info
2. Praktikum → See current lab session
3. Modul → Browse available modules
4. Tugas Pendahuluan → Check assignments
5. Nilai → Review scores
6. Asisten → See assistant contacts
7. Polling → Participate in surveys

**Expected Results:**
- All pages load without errors
- Active state updates correctly for each
- No console errors
- Smooth transitions between pages

---

#### 10.2 Navigation + Modal Interaction
**Steps:**
1. Navigate to Profile
2. Open Change Password modal
3. Cancel modal
4. Navigate to Modul
5. Verify no modal artifacts remain

**Expected Results:**
- Modal closes cleanly
- Navigation works after closing modal
- No overlay remains visible
- Page state is clean

---

#### 10.3 Navigation State + Logout
**Steps:**
1. Expand sidebar
2. Navigate to several pages
3. Logout
4. Login again as same user

**Expected Results:**
- After re-login, sidebar state is remembered (localStorage)
- Last active page is not restored (starts at Profile or dashboard)
- Navigation works normally

---

## Test Data Requirements

### Sample Praktikan Account
```json
{
  "nim": "101022400284",
  "name": "Fachry Muhammad Raffa",
  "email": "fachry@example.com",
  "kelas": "EL-49-INT",
  "password": "password123"
}
```

### Permissions Required
- `can:lihat-profile`
- `can:lihat-modul`
- `can:lihat-nilai`
- `can:lihat-asisten`

---

## API Endpoints Tested

### Navigation Related
- All GET routes for pages (indirect testing via Inertia)

### Password Change
- `PUT /praktikan/password`

### Logout
- `POST /praktikan/logout`

### Profile Data
- Implicit data loading for authenticated pages

---

## Success Criteria

### Navigation
- ✅ All 7 menu items are clickable and navigate correctly
- ✅ Active state highlighting works for all items
- ✅ Sidebar toggle works smoothly
- ✅ State persists across navigation and refresh
- ✅ All pages load without 404 or 500 errors

### Utility Functions
- ✅ Change password modal opens/closes properly
- ✅ Password change with valid data succeeds
- ✅ Logout confirmation works
- ✅ Logout clears session and redirects

### UX
- ✅ Animations are smooth (300ms timing)
- ✅ No visual glitches during transitions
- ✅ Icons and labels align properly
- ✅ Hover effects work consistently

### Accessibility
- ✅ Keyboard navigation works
- ✅ Focus indicators visible
- ✅ ARIA labels present
- ✅ Screen reader compatible

### Responsive
- ✅ Works on desktop (1920px+)
- ✅ Works on laptop (1366px)
- ✅ Works on tablet (768px)
- ✅ Works on mobile (375px)

---

## Playwright Test Implementation Notes

### Setup
```typescript
// Before each test
await page.goto('http://localhost:8000/login?mode=praktikan');
await loginAsPraktikan(page, validCredentials);
await expect(page).toHaveURL(/\/praktikan/);
```

### Common Selectors
```typescript
// Navigation elements
const hamburger = page.getByRole('button', { name: /toggle navigation/i });
const profileLink = page.getByRole('link', { name: /profile/i });
const praktikumLink = page.getByRole('link', { name: /praktikum/i });
// ... etc

// Modals
const passwordModal = page.getByRole('dialog', { name: /change password/i });
const logoutModal = page.getByRole('dialog', { name: /logout|confirm/i });
```

### State Checking
```typescript
// Check collapsed state
const nav = page.locator('nav').first();
const sidebar = nav.locator('> div').first();
await expect(sidebar).toHaveClass(/w-12/); // collapsed
await expect(sidebar).toHaveClass(/w-\[230px\]/); // expanded

// Check localStorage
const collapsed = await page.evaluate(() => 
  localStorage.getItem('praktikanNavCollapsed')
);
expect(collapsed).toBe('true');
```

### Active State Verification
```typescript
// Check active menu item
const profileLink = page.getByRole('link', { name: /profile/i });
await expect(profileLink).toHaveClass(/bg-\[var\(--depth-color-primary\)\]/);
await expect(profileLink).toHaveClass(/text-white/);
```

---

## Screenshots to Capture

1. `praktikan-nav-collapsed.png` - Collapsed sidebar state
2. `praktikan-nav-expanded.png` - Expanded sidebar with all labels
3. `praktikan-nav-active-{page}.png` - Each page with active highlight
4. `praktikan-nav-hover.png` - Hover state on menu item
5. `praktikan-nav-password-modal.png` - Change password modal open
6. `praktikan-nav-logout-modal.png` - Logout confirmation modal
7. `praktikan-nav-mobile.png` - Mobile responsive view
8. `praktikan-nav-animation.gif` - Toggle animation (if possible)

---

## Known Issues / Notes

1. **Animation Timing**: The 300ms delay for labels is intentional to create a smooth "grow then show text" effect
2. **localStorage**: Uses string values `'true'`/`'false'` not boolean
3. **Icon Filters**: CSS filters applied via classes `nav-icon-filter` and `nav-icon-filter-active`
4. **Focus Ring**: Only visible on keyboard navigation (`focus-visible:`)
5. **Modal Z-Index**: Modals should appear above sidebar overlay

---

## Dependencies

### Components Used
- `PraktikanNav` - Main navigation component
- `PraktikanAuthenticatedLayout` - Layout wrapper
- `ModalPassword` - Password change modal
- `ModalLogout` - Logout confirmation modal

### Assets
- Profile icon: `assets/nav/Icon-Profile.svg`
- Praktikum icon: `assets/nav/Icon-Praktikum.svg`
- Module icon: `assets/nav/Icon-Module.svg`
- Nilai icon: `assets/nav/Icon-Nilai.svg`
- Asisten icon: `assets/nav/Icon-Asisten.svg`
- Polling icon: `assets/nav/Icon-Polling.svg`
- TP icon: `assets/nav/Icon-Laporan.svg`
- Change Pass icon: `assets/nav/Icon-GantiPassword.svg`
- Logout icon: `assets/nav/Icon-Logout.svg`

---

**End of Praktikan Navigation Test Plan**
