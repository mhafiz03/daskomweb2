# Asisten Navigation - Comprehensive Test Plan

## Overview

This test plan covers the **Asisten Navigation** component (`AssistantNav.jsx`) which provides a collapsible sidebar navigation system for users with the asisten (assistant) role. The navigation features a sophisticated permission-based filtering system with role-based access control for administrative functions.

## Navigation Structure

### Navigation States
- **Collapsed State**: 48px width, icons only
- **Expanded State**: 260px width, icons with labels
- **Persistence**: State stored in localStorage key `assistantNavCollapsed`
- **Animation**: Smooth transition between states with hover expansion

### Role-Based Access Control
- **Admin Roles**: SOFTWARE, KORDAS, WAKORDAS, ADMIN
- **Permission System**: Each navigation item requires specific permissions
- **Dynamic Filtering**: Items are filtered based on user's permissions and role

### Navigation Items (13 Total)

1. **Profile** - Permission: `profile`
2. **Start Praktikum** - Permission: `start praktikum` 
3. **History** - Permission: `history`
4. **Nilai Praktikan** - Permission: `nilai praktikan`
5. **Lihat TP** - Permission: `lihat tp`
6. **Input Soal** - Permission: `input soal`
7. **Manage Modul** - Permission: `manage modul`
8. **Plotting Jadwal** - Permission: `plotting jadwal`, Admin roles only
9. **Leaderboard** - Permission: `leaderboard`
10. **Polling** - Permission: `polling`
11. **Pelanggaran** - Permission: `pelanggaran`
12. **Manage Asisten** - Permission: `manage asisten`, Admin roles only
13. **Manage Praktikan** - Permission: `manage praktikan`, Admin roles only

### Footer Actions (5 Total)

1. **Configuration** - Admin roles only, opens ModalKonfigurasi
2. **Tugas Pendahuluan** - Admin roles only, opens ModalActiveTP
3. **Open Jawaban** - Admin roles only, opens ModalOpenKJ
4. **Change Password** - All users, opens ModalPassword
5. **Logout** - All users, opens ModalLogout

### Modals (5 Total)

1. **ModalPassword** - Change password functionality
2. **ModalLogout** - Logout confirmation
3. **ModalKonfigurasi** - System configuration (admin only)
4. **ModalActiveTP** - Tugas Pendahuluan management (admin only)
5. **ModalOpenKJ** - Open Kunci Jawaban management (admin only)

---

## Test Scenarios

### 1. Navigation Collapse/Expand Functionality

**Seed:** `tests/seed.spec.ts`

#### 1.1 Toggle Collapse State
**Steps:**
1. Login as asisten with any valid permissions
2. Observe initial navigation state (should be expanded by default or match localStorage)
3. Click the hamburger menu button (three horizontal lines icon)
4. Observe navigation collapses to 48px width
5. Click hamburger menu button again
6. Observe navigation expands to 260px width

**Expected Results:**
- Navigation smoothly animates between states
- Icons remain visible in collapsed state
- Labels appear/disappear appropriately
- Hamburger icon animates (transforms bars)
- All content remains accessible in both states

#### 1.2 Hover Behavior in Collapsed State
**Steps:**
1. Login as asisten
2. Collapse the navigation using hamburger button
3. Hover over any navigation item in collapsed state
4. Move mouse away from navigation

**Expected Results:**
- Navigation temporarily expands on hover showing labels
- Navigation returns to collapsed state when mouse leaves
- Hover state only affects visibility, not localStorage
- Animation is smooth and responsive

#### 1.3 Persistence Across Sessions
**Steps:**
1. Login as asisten
2. Expand the navigation if collapsed
3. Refresh the browser page
4. Observe navigation state
5. Collapse the navigation
6. Refresh the browser page again
7. Observe navigation state

**Expected Results:**
- Navigation state persists after page refresh
- Expanded state is remembered
- Collapsed state is remembered
- localStorage key `assistantNavCollapsed` correctly stores state

---

### 2. Profile Navigation

**Seed:** `tests/seed.spec.ts`

#### 2.1 Access Profile Page
**Steps:**
1. Login as asisten with `profile` permission
2. Click on "Profile" navigation item
3. Observe page navigation

**Expected Results:**
- Navigation item is visible
- Clicking navigates to `/assistants/profile`
- Profile page loads successfully
- ProfileAssistant component displays
- Navigation item shows active state (highlighted)

#### 2.2 Profile Without Permission
**Steps:**
1. Login as asisten without `profile` permission
2. Observe navigation sidebar

**Expected Results:**
- "Profile" navigation item is not visible
- Direct navigation to `/assistants/profile` should be blocked by backend

---

### 3. Start Praktikum Navigation

**Seed:** `tests/seed.spec.ts`

#### 3.1 Access Start Praktikum Page
**Steps:**
1. Login as asisten with `start praktikum` permission
2. Click on "Start Praktikum" navigation item
3. Observe page navigation

**Expected Results:**
- Navigation item is visible with rocket icon
- Clicking navigates to `/assistants/start-praktikum`
- StartPraktikum component loads
- Navigation item shows active state
- User can initiate praktikum sessions

#### 3.2 Start Praktikum Without Permission
**Steps:**
1. Login as asisten without `start praktikum` permission
2. Observe navigation sidebar

**Expected Results:**
- "Start Praktikum" navigation item is not visible
- Direct navigation to `/assistants/start-praktikum` should be blocked

---

### 4. History Praktikum Navigation

**Seed:** `tests/seed.spec.ts`

#### 4.1 Access History Page
**Steps:**
1. Login as asisten with `history` permission
2. Click on "History" navigation item
3. Observe page navigation

**Expected Results:**
- Navigation item is visible with clock icon
- Clicking navigates to `/assistants/history`
- HistoryPraktikum component loads
- Navigation item shows active state
- Historical praktikum data is displayed

#### 4.2 History Without Permission
**Steps:**
1. Login as asisten without `history` permission
2. Observe navigation sidebar

**Expected Results:**
- "History" navigation item is not visible
- Direct navigation to `/assistants/history` should be blocked

---

### 5. Nilai Praktikan Navigation

**Seed:** `tests/seed.spec.ts`

#### 5.1 Access Nilai Praktikan Page
**Steps:**
1. Login as asisten with `nilai praktikan` permission
2. Click on "Nilai Praktikan" navigation item
3. Observe page navigation

**Expected Results:**
- Navigation item is visible with clipboard icon
- Clicking navigates to `/assistants/nilai-praktikan`
- NilaiPraktikan component loads
- Navigation item shows active state
- Grading interface is accessible

#### 5.2 Nilai Praktikan Without Permission
**Steps:**
1. Login as asisten without `nilai praktikan` permission
2. Observe navigation sidebar

**Expected Results:**
- "Nilai Praktikan" navigation item is not visible
- Direct navigation to `/assistants/nilai-praktikan` should be blocked

---

### 6. Lihat TP (Tugas Pendahuluan) Navigation

**Seed:** `tests/seed.spec.ts`

#### 6.1 Access Lihat TP Page
**Steps:**
1. Login as asisten with `lihat tp` permission
2. Click on "Lihat TP" navigation item
3. Observe page navigation

**Expected Results:**
- Navigation item is visible with file text icon
- Clicking navigates to `/assistants/lihat-tp`
- LihatTP component loads
- Navigation item shows active state
- Can view submitted tugas pendahuluan

#### 6.2 Navigate to Result Lihat TP
**Steps:**
1. Login as asisten with `lihat tp` permission
2. Navigate to `/assistants/result-lihat-tp` (from LihatTP page)
3. Observe navigation state

**Expected Results:**
- "Lihat TP" navigation item remains highlighted (active)
- Component matching detects ResultLihatTP as part of Lihat TP flow
- ResultLihatTP component displays correctly

#### 6.3 Lihat TP Without Permission
**Steps:**
1. Login as asisten without `lihat tp` permission
2. Observe navigation sidebar

**Expected Results:**
- "Lihat TP" navigation item is not visible
- Direct navigation should be blocked

---

### 7. Input Soal Navigation

**Seed:** `tests/seed.spec.ts`

#### 7.1 Access Input Soal Page
**Steps:**
1. Login as asisten with `input soal` permission
2. Click on "Input Soal" navigation item
3. Observe page navigation

**Expected Results:**
- Navigation item is visible with edit icon
- Clicking navigates to `/assistants/soal-praktikum`
- SoalPraktikum component loads
- Navigation item shows active state
- Question input interface is accessible

#### 7.2 Input Soal Without Permission
**Steps:**
1. Login as asisten without `input soal` permission
2. Observe navigation sidebar

**Expected Results:**
- "Input Soal" navigation item is not visible
- Direct navigation should be blocked

---

### 8. Manage Modul Navigation

**Seed:** `tests/seed.spec.ts`

#### 8.1 Access Manage Modul Page
**Steps:**
1. Login as asisten with `manage modul` permission
2. Click on "Manage Modul" navigation item
3. Observe page navigation

**Expected Results:**
- Navigation item is visible with book open icon
- Clicking navigates to `/assistants/module-praktikum`
- ModulePraktikum component loads
- Navigation item shows active state
- Module management interface is accessible

#### 8.2 Manage Modul Without Permission
**Steps:**
1. Login as asisten without `manage modul` permission
2. Observe navigation sidebar

**Expected Results:**
- "Manage Modul" navigation item is not visible
- Direct navigation should be blocked

---

### 9. Plotting Jadwal Navigation (Admin Only)

**Seed:** `tests/seed.spec.ts`

#### 9.1 Access Plotting Jadwal as Admin
**Steps:**
1. Login as asisten with:
   - `plotting jadwal` permission
   - Role: SOFTWARE, KORDAS, WAKORDAS, or ADMIN
2. Click on "Plotting Jadwal" navigation item
3. Observe page navigation

**Expected Results:**
- Navigation item is visible with calendar icon
- Clicking navigates to `/assistants/plotting-asisten`
- PlottingAssistant component loads
- Navigation item shows active state
- Schedule plotting interface is accessible

#### 9.2 Plotting Jadwal Without Admin Role
**Steps:**
1. Login as asisten with:
   - `plotting jadwal` permission
   - Role: Regular asisten (not admin)
2. Observe navigation sidebar

**Expected Results:**
- "Plotting Jadwal" navigation item is NOT visible
- Direct navigation should be blocked
- Permission alone is insufficient; admin role is required

#### 9.3 Plotting Jadwal Without Permission
**Steps:**
1. Login as asisten with:
   - Admin role (SOFTWARE, KORDAS, WAKORDAS, or ADMIN)
   - No `plotting jadwal` permission
2. Observe navigation sidebar

**Expected Results:**
- "Plotting Jadwal" navigation item is NOT visible
- Both permission AND admin role are required
- Direct navigation should be blocked

---

### 10. Leaderboard Navigation

**Seed:** `tests/seed.spec.ts`

#### 10.1 Access Leaderboard Page
**Steps:**
1. Login as asisten with `leaderboard` permission
2. Click on "Leaderboard" navigation item
3. Observe page navigation

**Expected Results:**
- Navigation item is visible with trophy icon
- Clicking navigates to `/assistants/leaderboard`
- LeaderboardRanking component loads
- Navigation item shows active state
- Ranking data is displayed

#### 10.2 Leaderboard Without Permission
**Steps:**
1. Login as asisten without `leaderboard` permission
2. Observe navigation sidebar

**Expected Results:**
- "Leaderboard" navigation item is not visible
- Direct navigation should be blocked

---

### 11. Polling Navigation

**Seed:** `tests/seed.spec.ts`

#### 11.1 Access Polling Page
**Steps:**
1. Login as asisten with `polling` permission
2. Click on "Polling" navigation item
3. Observe page navigation

**Expected Results:**
- Navigation item is visible with bar chart icon
- Clicking navigates to `/assistants/polling`
- PollingAssistant component loads
- Navigation item shows active state
- Polling interface is accessible

#### 11.2 Polling Without Permission
**Steps:**
1. Login as asisten without `polling` permission
2. Observe navigation sidebar

**Expected Results:**
- "Polling" navigation item is not visible
- Direct navigation should be blocked

---

### 12. Pelanggaran Navigation

**Seed:** `tests/seed.spec.ts`

#### 12.1 Access Pelanggaran Page
**Steps:**
1. Login as asisten with `pelanggaran` permission
2. Click on "Pelanggaran" navigation item
3. Observe page navigation

**Expected Results:**
- Navigation item is visible with alert triangle icon
- Clicking navigates to `/assistants/pelanggaran`
- PelanggaranAssistant component loads
- Navigation item shows active state
- Violation management interface is accessible

#### 12.2 Navigate to Result Laporan
**Steps:**
1. Login as asisten with `pelanggaran` permission
2. Navigate to `/assistants/result-laporan` (from Pelanggaran page)
3. Observe navigation state

**Expected Results:**
- "Pelanggaran" navigation item remains highlighted (active)
- Component matching detects ResultLaporan as part of Pelanggaran flow
- ResultLaporan component displays correctly

#### 12.3 Pelanggaran Without Permission
**Steps:**
1. Login as asisten without `pelanggaran` permission
2. Observe navigation sidebar

**Expected Results:**
- "Pelanggaran" navigation item is not visible
- Direct navigation should be blocked

---

### 13. Manage Asisten Navigation (Admin Only)

**Seed:** `tests/seed.spec.ts`

#### 13.1 Access Manage Asisten as Admin
**Steps:**
1. Login as asisten with:
   - `manage asisten` permission
   - Role: SOFTWARE, KORDAS, WAKORDAS, or ADMIN
2. Click on "Manage Asisten" navigation item
3. Observe page navigation

**Expected Results:**
- Navigation item is visible with users icon
- Clicking navigates to `/assistants/manage-role`
- ManageRole component loads
- Navigation item shows active state
- Asisten management interface is accessible

#### 13.2 Navigate to Audit Logs
**Steps:**
1. Login as admin with `manage asisten` permission
2. Navigate to `/assistants/audit-logs` (from ManageRole page)
3. Observe navigation state

**Expected Results:**
- "Manage Asisten" navigation item remains highlighted (active)
- Component matching detects AuditLogs as part of Manage Asisten flow
- AuditLogs component displays correctly

#### 13.3 Manage Asisten Without Admin Role
**Steps:**
1. Login as asisten with:
   - `manage asisten` permission
   - Role: Regular asisten (not admin)
2. Observe navigation sidebar

**Expected Results:**
- "Manage Asisten" navigation item is NOT visible
- Direct navigation should be blocked
- Permission alone is insufficient; admin role is required

#### 13.4 Manage Asisten Without Permission
**Steps:**
1. Login as asisten with:
   - Admin role (SOFTWARE, KORDAS, WAKORDAS, or ADMIN)
   - No `manage asisten` permission
2. Observe navigation sidebar

**Expected Results:**
- "Manage Asisten" navigation item is NOT visible
- Both permission AND admin role are required
- Direct navigation should be blocked

---

### 14. Manage Praktikan Navigation (Admin Only)

**Seed:** `tests/seed.spec.ts`

#### 14.1 Access Manage Praktikan as Admin
**Steps:**
1. Login as asisten with:
   - `manage praktikan` permission
   - Role: SOFTWARE, KORDAS, WAKORDAS, or ADMIN
2. Click on "Manage Praktikan" navigation item
3. Observe page navigation

**Expected Results:**
- Navigation item is visible with user check icon
- Clicking navigates to `/assistants/manage-praktikan`
- ManagePraktikan component loads
- Navigation item shows active state
- Praktikan management interface is accessible

#### 14.2 Manage Praktikan Without Admin Role
**Steps:**
1. Login as asisten with:
   - `manage praktikan` permission
   - Role: Regular asisten (not admin)
2. Observe navigation sidebar

**Expected Results:**
- "Manage Praktikan" navigation item is NOT visible
- Direct navigation should be blocked
- Permission alone is insufficient; admin role is required

#### 14.3 Manage Praktikan Without Permission
**Steps:**
1. Login as asisten with:
   - Admin role (SOFTWARE, KORDAS, WAKORDAS, or ADMIN)
   - No `manage praktikan` permission
2. Observe navigation sidebar

**Expected Results:**
- "Manage Praktikan" navigation item is NOT visible
- Both permission AND admin role are required
- Direct navigation should be blocked

---

### 15. Footer Actions - Configuration (Admin Only)

**Seed:** `tests/seed.spec.ts`

#### 15.1 Access Configuration Modal as Admin
**Steps:**
1. Login as asisten with admin role (SOFTWARE, KORDAS, WAKORDAS, or ADMIN)
2. Scroll to bottom of navigation sidebar if needed
3. Click on "Configuration" footer action (settings icon)
4. Observe modal opening

**Expected Results:**
- Configuration button is visible in footer
- ModalKonfigurasi opens
- System configuration options are displayed
- Modal can be closed using close button or outside click

#### 15.2 Configuration Without Admin Role
**Steps:**
1. Login as asisten without admin role (regular asisten)
2. Observe footer actions area

**Expected Results:**
- Configuration button is NOT visible
- Only Change Password and Logout are visible

#### 15.3 Submit Configuration Changes
**Steps:**
1. Login as admin
2. Click Configuration button
3. Make changes to configuration settings
4. Submit the form
5. Observe feedback

**Expected Results:**
- Changes are saved successfully
- Success notification appears
- Modal closes automatically or shows confirmation
- System reflects new configuration

---

### 16. Footer Actions - Tugas Pendahuluan Management (Admin Only)

**Seed:** `tests/seed.spec.ts`

#### 16.1 Access TP Management Modal as Admin
**Steps:**
1. Login as asisten with admin role
2. Scroll to bottom of navigation sidebar if needed
3. Click on "Tugas Pendahuluan" footer action (file text icon)
4. Observe modal opening

**Expected Results:**
- Tugas Pendahuluan button is visible in footer
- ModalActiveTP opens
- TP activation/deactivation interface is displayed
- List of available TPs is shown
- Modal can be closed using close button or outside click

#### 16.2 TP Management Without Admin Role
**Steps:**
1. Login as asisten without admin role
2. Observe footer actions area

**Expected Results:**
- Tugas Pendahuluan button is NOT visible
- Regular asisten cannot manage TP activation

#### 16.3 Activate/Deactivate TP
**Steps:**
1. Login as admin
2. Click Tugas Pendahuluan button
3. Toggle activation status of a TP
4. Confirm the action
5. Observe feedback

**Expected Results:**
- TP status changes successfully
- Success notification appears
- Modal reflects updated status
- Change is immediately effective in system

---

### 17. Footer Actions - Open Kunci Jawaban (Admin Only)

**Seed:** `tests/seed.spec.ts`

#### 17.1 Access Open KJ Modal as Admin
**Steps:**
1. Login as asisten with admin role
2. Scroll to bottom of navigation sidebar if needed
3. Click on "Open Jawaban" footer action (unlock icon)
4. Observe modal opening

**Expected Results:**
- Open Jawaban button is visible in footer
- ModalOpenKJ opens
- Interface to unlock answer keys is displayed
- List of available answer keys is shown
- Modal can be closed using close button or outside click

#### 17.2 Open Jawaban Without Admin Role
**Steps:**
1. Login as asisten without admin role
2. Observe footer actions area

**Expected Results:**
- Open Jawaban button is NOT visible
- Regular asisten cannot manage answer key access

#### 17.3 Unlock Answer Keys
**Steps:**
1. Login as admin
2. Click Open Jawaban button
3. Select answer keys to unlock
4. Confirm the action
5. Observe feedback

**Expected Results:**
- Answer keys are unlocked successfully
- Success notification appears
- Modal reflects updated status
- Praktikans can now access unlocked answer keys

---

### 18. Footer Actions - Change Password

**Seed:** `tests/seed.spec.ts`

#### 18.1 Access Change Password Modal
**Steps:**
1. Login as asisten with any permissions
2. Scroll to bottom of navigation sidebar if needed
3. Click on "Change Password" footer action (key icon)
4. Observe modal opening

**Expected Results:**
- Change Password button is visible to all asisten users
- ModalPassword opens
- Password change form is displayed
- Modal can be closed using close button or outside click

#### 18.2 Change Password Successfully
**Steps:**
1. Login as asisten
2. Click Change Password button
3. Enter current password
4. Enter new password
5. Confirm new password
6. Submit the form

**Expected Results:**
- Form validates all required fields
- Password strength requirements are shown
- Success notification appears on valid submission
- Modal closes automatically
- User can continue using application with new password

#### 18.3 Change Password with Invalid Current Password
**Steps:**
1. Login as asisten
2. Click Change Password button
3. Enter incorrect current password
4. Enter new password and confirmation
5. Submit the form

**Expected Results:**
- Error message indicates current password is incorrect
- Form does not submit
- User remains on modal to retry

#### 18.4 Change Password with Mismatched Confirmation
**Steps:**
1. Login as asisten
2. Click Change Password button
3. Enter correct current password
4. Enter new password
5. Enter different password in confirmation field
6. Submit the form

**Expected Results:**
- Error message indicates passwords don't match
- Form does not submit
- User can correct and retry

#### 18.5 Cancel Change Password
**Steps:**
1. Login as asisten
2. Click Change Password button
3. Fill in some fields
4. Click cancel or close modal without submitting

**Expected Results:**
- Modal closes without saving changes
- Password remains unchanged
- No error messages appear

---

### 19. Footer Actions - Logout

**Seed:** `tests/seed.spec.ts`

#### 19.1 Access Logout Modal
**Steps:**
1. Login as asisten with any permissions
2. Scroll to bottom of navigation sidebar if needed
3. Click on "Logout" footer action (log out icon)
4. Observe modal opening

**Expected Results:**
- Logout button is visible to all asisten users (red/danger color)
- ModalLogout opens
- Logout confirmation message is displayed
- Modal can be closed using close button or outside click

#### 19.2 Confirm Logout
**Steps:**
1. Login as asisten
2. Click Logout button
3. Confirm logout action in modal
4. Observe redirect

**Expected Results:**
- User is logged out successfully
- Session is terminated
- User is redirected to login page
- Cannot access protected routes without logging in again

#### 19.3 Cancel Logout
**Steps:**
1. Login as asisten
2. Click Logout button
3. Cancel logout action in modal (click cancel or close)
4. Observe state

**Expected Results:**
- Modal closes
- User remains logged in
- Session continues
- Can continue using application normally

---

### 20. Active State Detection

**Seed:** `tests/seed.spec.ts`

#### 20.1 Active State on Current Route
**Steps:**
1. Login as asisten with multiple permissions
2. Navigate to `/assistants/profile`
3. Observe Profile navigation item styling
4. Navigate to `/assistants/nilai-praktikan`
5. Observe both Profile and Nilai Praktikan styling

**Expected Results:**
- Current page's navigation item is highlighted/active
- Previously active item returns to normal state
- Active state uses distinct styling (background color, text color, etc.)
- Only one navigation item is active at a time

#### 20.2 Active State with Component Matching
**Steps:**
1. Login as asisten with `lihat tp` permission
2. Navigate to `/assistants/lihat-tp`
3. Observe Lihat TP navigation item is active
4. Click through to `/assistants/result-lihat-tp`
5. Observe Lihat TP navigation item remains active

**Expected Results:**
- Parent navigation item remains active for related pages
- Component matching correctly identifies ResultLihatTP as part of Lihat TP
- Active state persists across related views

#### 20.3 Active State with Path Matching
**Steps:**
1. Login as asisten with `pelanggaran` permission
2. Navigate to `/assistants/pelanggaran`
3. Observe Pelanggaran navigation item is active
4. Navigate to `/assistants/result-laporan`
5. Observe Pelanggaran navigation item remains active

**Expected Results:**
- Parent navigation item remains active for related paths
- Path matching correctly identifies result-laporan as part of Pelanggaran
- Active state persists across related views

---

### 21. Permission-Based Filtering

**Seed:** `tests/seed.spec.ts`

#### 21.1 Full Access (All Permissions)
**Steps:**
1. Login as admin with all 13 navigation permissions
2. Observe navigation sidebar

**Expected Results:**
- All 13 navigation items are visible
- All 5 footer actions are visible
- No items are filtered out
- Navigation is fully populated

#### 21.2 Partial Access (5 Permissions)
**Steps:**
1. Login as asisten with only these permissions:
   - profile
   - history
   - nilai praktikan
   - leaderboard
   - polling
2. Observe navigation sidebar

**Expected Results:**
- Exactly 5 navigation items are visible
- Other 8 items are not rendered
- Footer shows only Change Password and Logout (no admin actions)
- Sidebar layout adjusts gracefully for fewer items

#### 21.3 Minimal Access (1 Permission)
**Steps:**
1. Login as asisten with only `profile` permission
2. Observe navigation sidebar

**Expected Results:**
- Only Profile navigation item is visible
- Footer shows Change Password and Logout
- No admin actions visible
- Sidebar remains functional with single item

#### 21.4 No Navigation Permissions
**Steps:**
1. Login as asisten with no navigation permissions (edge case)
2. Observe navigation sidebar

**Expected Results:**
- No navigation items are visible
- Footer still shows Change Password and Logout
- Hamburger menu is still accessible
- User can still change password and logout

---

### 22. Role-Based Filtering (Admin Features)

**Seed:** `tests/seed.spec.ts`

#### 22.1 Admin Role with All Permissions
**Steps:**
1. Login as asisten with:
   - Role: ADMIN
   - All 13 navigation permissions including admin-only ones
2. Observe navigation and footer

**Expected Results:**
- All 13 navigation items visible including:
  - Plotting Jadwal
  - Manage Asisten
  - Manage Praktikan
- All 5 footer actions visible including:
  - Configuration
  - Tugas Pendahuluan
  - Open Jawaban

#### 22.2 KORDAS Role
**Steps:**
1. Login as asisten with:
   - Role: KORDAS (koordinator asisten)
   - Relevant permissions
2. Observe navigation and footer

**Expected Results:**
- Admin-only navigation items are visible (if permissions granted)
- Admin-only footer actions are visible
- KORDAS is treated as admin role

#### 22.3 WAKORDAS Role
**Steps:**
1. Login as asisten with:
   - Role: WAKORDAS (wakil koordinator asisten)
   - Relevant permissions
2. Observe navigation and footer

**Expected Results:**
- Admin-only navigation items are visible (if permissions granted)
- Admin-only footer actions are visible
- WAKORDAS is treated as admin role

#### 22.4 SOFTWARE Role
**Steps:**
1. Login as asisten with:
   - Role: SOFTWARE
   - Relevant permissions
2. Observe navigation and footer

**Expected Results:**
- Admin-only navigation items are visible (if permissions granted)
- Admin-only footer actions are visible
- SOFTWARE is treated as admin role (likely highest privilege)

#### 22.5 Regular Asisten with Admin Permissions
**Steps:**
1. Login as asisten with:
   - Role: Regular asisten (not SOFTWARE/KORDAS/WAKORDAS/ADMIN)
   - All 13 navigation permissions including admin-only ones
2. Observe navigation and footer

**Expected Results:**
- Regular navigation items visible (10 items)
- Admin-only navigation items NOT visible despite having permissions:
  - Plotting Jadwal (not visible)
  - Manage Asisten (not visible)
  - Manage Praktikan (not visible)
- Admin-only footer actions NOT visible:
  - Configuration (not visible)
  - Tugas Pendahuluan (not visible)
  - Open Jawaban (not visible)
- Only Change Password and Logout visible in footer

---

### 23. Combined Permission and Role Requirements

**Seed:** `tests/seed.spec.ts`

#### 23.1 Admin Role Without Specific Permission
**Steps:**
1. Login as asisten with:
   - Role: ADMIN
   - Has `manage asisten` permission
   - Does NOT have `plotting jadwal` permission
2. Observe navigation items

**Expected Results:**
- Manage Asisten is visible (has permission + admin role)
- Plotting Jadwal is NOT visible (missing permission even with admin role)
- Both permission AND role are required for admin features

#### 23.2 Multiple Admin Permissions with Admin Role
**Steps:**
1. Login as asisten with:
   - Role: KORDAS
   - Has `plotting jadwal` permission
   - Has `manage praktikan` permission
   - Missing other permissions
2. Observe navigation items

**Expected Results:**
- Plotting Jadwal is visible
- Manage Praktikan is visible
- Manage Asisten is NOT visible (missing permission)
- Each admin feature requires its specific permission

#### 23.3 All Regular Permissions Without Admin Role
**Steps:**
1. Login as asisten with:
   - Role: Regular asisten
   - Has all 10 regular navigation permissions
   - Missing admin-only permissions
2. Observe navigation and footer

**Expected Results:**
- 10 regular navigation items visible
- No admin navigation items
- No admin footer actions
- Change Password and Logout visible

---

### 24. Navigation Responsiveness

**Seed:** `tests/seed.spec.ts`

#### 24.1 Small Screen Behavior
**Steps:**
1. Login as asisten
2. Resize browser window to small width (e.g., 768px or less)
3. Observe navigation sidebar
4. Toggle collapse state

**Expected Results:**
- Navigation adapts to smaller screen
- Collapsed state may be default on mobile
- All functionality remains accessible
- Responsive breakpoints work correctly

#### 24.2 Scrolling with Many Items
**Steps:**
1. Login as admin with all 13 navigation items visible
2. Resize window to shorter height
3. Observe navigation content
4. Scroll within navigation

**Expected Results:**
- Navigation content is scrollable
- Hamburger menu remains accessible
- Footer actions remain accessible (sticky or scrollable)
- No content is cut off or inaccessible

#### 24.3 Long Label Handling
**Steps:**
1. Login as asisten
2. Observe navigation items with longer labels (e.g., "Manage Praktikan")
3. Expand and collapse navigation
4. Observe text wrapping or truncation

**Expected Results:**
- Long labels are handled gracefully
- Text doesn't overflow container
- Labels remain readable in both states
- Tooltips may show full text if truncated

---

### 25. Icon Rendering

**Seed:** `tests/seed.spec.ts`

#### 25.1 All Icons Render Correctly
**Steps:**
1. Login as admin with all permissions
2. Observe all navigation items
3. Check each icon displays correctly

**Expected Results:**
- All 13 navigation items have appropriate icons
- Icons are from Lucide React library
- Icons maintain correct size and color
- Icons are visually consistent

#### 25.2 Icon Colors in Different States
**Steps:**
1. Login as asisten
2. Observe icon colors in normal state
3. Hover over navigation items
4. Click to activate a navigation item
5. Observe icon colors in active state

**Expected Results:**
- Icons have consistent coloring in normal state
- Icons change color on hover
- Active item icons have distinct active color
- Color scheme matches design system

#### 25.3 Icon Alignment
**Steps:**
1. Login as asisten
2. Expand navigation to full width
3. Observe icon and label alignment
4. Collapse navigation
5. Observe icon-only layout

**Expected Results:**
- Icons align consistently in expanded state
- Labels align with icons
- Icons center properly in collapsed state
- No misalignment or layout issues

---

### 26. Animation and Transitions

**Seed:** `tests/seed.spec.ts`

#### 26.1 Sidebar Transition Smoothness
**Steps:**
1. Login as asisten
2. Toggle sidebar between collapsed and expanded multiple times
3. Observe animation smoothness
4. Try rapid toggling

**Expected Results:**
- Transition is smooth and not jarring
- Animation timing is appropriate (not too fast or slow)
- Rapid toggling doesn't cause animation issues
- No flickering or visual glitches

#### 26.2 Hamburger Icon Animation
**Steps:**
1. Login as asisten
2. Click hamburger menu to collapse
3. Observe icon transformation
4. Click again to expand
5. Observe icon transformation

**Expected Results:**
- Top, middle, and bottom bars animate smoothly
- Transformation clearly indicates state (hamburger vs X)
- Animation is synchronized with sidebar transition
- Visual feedback is immediate

#### 26.3 Hover Effects
**Steps:**
1. Login as asisten
2. Hover over various navigation items
3. Move quickly between items
4. Hover over footer actions

**Expected Results:**
- Hover effects appear instantly
- No delay or lag in hover state
- Smooth transition between normal and hover states
- Hover effects work consistently across all items

---

### 27. Modal Interactions

**Seed:** `tests/seed.spec.ts`

#### 27.1 Multiple Modal Opens in Session
**Steps:**
1. Login as asisten
2. Open Change Password modal, then close
3. Open Logout modal, then close
4. Open Change Password modal again

**Expected Results:**
- Each modal opens and closes cleanly
- Previous modal state doesn't interfere
- No memory leaks or stuck modals
- Modals are independent and properly unmounted

#### 27.2 Modal Open with Navigation
**Steps:**
1. Login as asisten
2. Open Change Password modal
3. Without closing, navigate to different page
4. Observe modal state

**Expected Results:**
- Modal closes automatically on navigation OR
- Modal persists if designed to stay (check application behavior)
- No broken modal states
- Page navigation completes successfully

#### 27.3 Admin Modal Opens for Admin User
**Steps:**
1. Login as admin
2. Open Configuration modal, observe, then close
3. Open Tugas Pendahuluan modal, observe, then close
4. Open Open Jawaban modal, observe, then close

**Expected Results:**
- All three admin modals open correctly
- Each has distinct content and functionality
- Modals don't interfere with each other
- All close properly

---

### 28. Keyboard Navigation

**Seed:** `tests/seed.spec.ts`

#### 28.1 Tab Through Navigation Items
**Steps:**
1. Login as asisten
2. Use Tab key to navigate through sidebar items
3. Observe focus indicators
4. Press Enter on focused item

**Expected Results:**
- Tab key moves focus through navigation items in logical order
- Focus indicators are clearly visible
- Enter key activates focused navigation item
- Keyboard navigation includes footer actions

#### 28.2 Escape Key to Close Modals
**Steps:**
1. Login as asisten
2. Open Change Password modal
3. Press Escape key
4. Observe modal closes

**Expected Results:**
- Escape key closes modal
- Focus returns to trigger element
- No errors or stuck states

#### 28.3 Keyboard Shortcut for Collapse Toggle
**Steps:**
1. Login as asisten
2. Try various keyboard shortcuts to toggle sidebar (if implemented)

**Expected Results:**
- If keyboard shortcut exists, it works reliably
- If not implemented, document as potential feature
- Shortcuts don't conflict with browser shortcuts

---

### 29. Error Handling and Edge Cases

**Seed:** `tests/seed.spec.ts`

#### 29.1 Navigation with Expired Session
**Steps:**
1. Login as asisten
2. Wait for session to expire (or manually expire in dev tools)
3. Click on navigation item
4. Observe behavior

**Expected Results:**
- User is redirected to login page
- Session expiration is handled gracefully
- No JavaScript errors in console
- Appropriate error message displayed

#### 29.2 Direct URL Navigation to Protected Route
**Steps:**
1. Login as asisten without `nilai praktikan` permission
2. Manually navigate to `/assistants/nilai-praktikan` via URL bar
3. Observe behavior

**Expected Results:**
- Access is denied by backend middleware
- User sees 403 Forbidden or redirected to appropriate page
- Navigation sidebar doesn't show unauthorized item
- Error is logged appropriately

#### 29.3 Permission Change During Session
**Steps:**
1. Login as asisten with limited permissions
2. Have admin change user's permissions (in another session/tab)
3. Navigate to a page that requires new permission (without refreshing)
4. Observe behavior

**Expected Results:**
- User may not immediately see new permissions (expected behavior)
- Backend enforces current permissions on requests
- Consider testing after page refresh if permissions update
- Document expected behavior for permission updates

#### 29.4 Malformed Permission Data
**Steps:**
1. Simulate malformed permission data from backend (requires test setup)
2. Login as asisten
3. Observe navigation rendering

**Expected Results:**
- Navigation handles missing or malformed permissions gracefully
- Default to showing no items or minimal access
- No JavaScript errors
- User can still logout and change password

---

### 30. Performance and Optimization

**Seed:** `tests/seed.spec.ts`

#### 30.1 Initial Load Performance
**Steps:**
1. Login as admin with all permissions
2. Measure time for navigation to fully render
3. Check for unnecessary re-renders

**Expected Results:**
- Navigation renders quickly (< 500ms)
- No visible lag or delay
- Icons load without flickering
- Initial state is correct (collapsed/expanded from localStorage)

#### 30.2 Navigation During Heavy Page Load
**Steps:**
1. Login as asisten
2. Navigate to page with heavy content (e.g., large table)
3. Try collapsing/expanding sidebar during page load
4. Observe responsiveness

**Expected Results:**
- Sidebar remains responsive during page load
- Collapse/expand animation is not blocked
- No frozen UI
- Navigation works independently of page content

#### 30.3 Memory Management
**Steps:**
1. Login as asisten
2. Navigate through all available pages multiple times
3. Check browser memory usage (dev tools)
4. Look for memory leaks

**Expected Results:**
- Memory usage remains stable
- No significant memory leaks
- Modals are properly unmounted
- Event listeners are cleaned up

---

## Additional Testing Considerations

### Cross-Browser Testing
- Test on Chrome, Firefox, Safari, Edge
- Verify animations work consistently
- Check for browser-specific issues

### Accessibility Testing
- Screen reader compatibility
- Keyboard navigation completeness
- ARIA labels and roles
- Color contrast compliance

### Mobile Testing
- Touch interactions
- Responsive layout
- Mobile-specific navigation patterns

### Integration Testing
- Backend permission enforcement
- Session management
- API error handling
- Network failure scenarios

### Regression Testing
- After updates to AssistantNav component
- After permission system changes
- After routing updates
- After design system changes

---

## Test Data Requirements

### User Accounts Needed

1. **Full Admin Account**
   - Role: ADMIN
   - All 13 navigation permissions
   - Used for testing complete feature set

2. **KORDAS Account**
   - Role: KORDAS
   - All navigation permissions
   - Used for testing coordinator-level access

3. **Regular Asisten with Partial Permissions**
   - Role: Regular asisten
   - 5-7 random permissions (no admin-only)
   - Used for testing filtered navigation

4. **Minimal Permission Asisten**
   - Role: Regular asisten
   - Only `profile` permission
   - Used for testing minimal access

5. **Admin with Missing Permissions**
   - Role: ADMIN
   - Some admin permissions, missing others
   - Used for testing permission requirements for admins

6. **Regular Asisten with Admin Permissions**
   - Role: Regular asisten
   - Has admin-only permissions (plotting, manage asisten, manage praktikan)
   - Used for testing role requirements

---

## Success Criteria

### Functional Success
- ✅ All navigation items render correctly based on permissions
- ✅ Role-based filtering works for admin features
- ✅ Collapse/expand functionality works reliably
- ✅ State persistence works across sessions
- ✅ Active state detection works for all routes
- ✅ All modals open and close correctly
- ✅ Footer actions are properly filtered by role

### Non-Functional Success
- ✅ Navigation is responsive and performant
- ✅ Animations are smooth and not jarring
- ✅ No console errors during normal use
- ✅ Keyboard navigation is fully functional
- ✅ Accessibility requirements are met
- ✅ Mobile experience is optimized

### Security Success
- ✅ Backend enforces all permission checks
- ✅ Direct URL navigation is properly guarded
- ✅ Admin features are inaccessible to non-admins
- ✅ Session expiration is handled securely

---

## Notes for Test Implementation

1. **Seed Data**: Create comprehensive seed file with all user account types needed for testing
2. **Test Helpers**: Create utility functions for common operations (login, toggle sidebar, check visibility)
3. **Test Organization**: Group tests by feature area (navigation items, footer actions, modals, etc.)
4. **Assertions**: Use specific assertions for permission-based visibility (not just "is visible")
5. **Cleanup**: Ensure proper cleanup after each test (logout, clear localStorage, reset state)
6. **Documentation**: Keep this test plan updated as features change or new requirements emerge

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Target Component**: `resources/js/Components/Common/AssistantNav.jsx`  
**Related Components**: `PraktikanNav.jsx`, `ModalPassword.jsx`, `ModalLogout.jsx`, `ModalKonfigurasi.jsx`, `ModalOpenKJ.jsx`, `ModalActiveTP.jsx`
