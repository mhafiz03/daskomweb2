# Praktikan Nilai Page with Asisten ModalOpenKJ - Comprehensive Test Plan

## Overview

This test plan covers the interaction between **Praktikan viewing their Nilai (Scores)** page and **Asisten controlling access to answer keys** through the ModalOpenKJ (Open Kunci Jawaban). The test demonstrates real-time synchronization where asisten can lock/unlock specific answer types (TA, Jurnal, FITB, TM, TK) per module, and praktikan immediately see changes without refreshing.

## Application Flow Context

### Nilai Page for Praktikan

The praktikan nilai page displays:
- **Score Overview**: Scores across all modules for all assessment types
- **Module Filter**: Filter scores by specific module
- **Answer Key Access**: Links or buttons to view answer keys (when unlocked)
- **Real-time Updates**: WebSocket events update UI when asisten changes unlock status

### ModalOpenKJ for Asisten

The ModalOpenKJ (Modal Open Kunci Jawaban) allows admin asisten to:
- **View All Modules**: List of all modules with current unlock status
- **Toggle Answer Keys**: Lock/unlock specific question types per module:
  - TA (Tes Awal)
  - Jurnal (Journal)
  - FITB (Fill in the Blank)
  - TM (Tugas Mandiri)
  - TK (Tes Keterampilan)
- **Bulk Actions**: Toggle all types for a module at once
- **Save Changes**: Persist unlock configuration to database
- **Broadcast Updates**: Changes are broadcast via WebSocket to all praktikan

### Key Features

- **Real-time Sync**: Praktikan see unlock changes within 1-2 seconds
- **Granular Control**: Asisten can unlock specific types per module
- **Visual Indicators**: Praktikan see locked/unlocked icons
- **Access Control**: Only admin asisten can open ModalOpenKJ
- **Persistent State**: Unlock configuration persists across sessions

---

## Test Scenarios

### 1. Praktikan Initial View - All Locked

**Seed:** `tests/seed.spec.ts`

#### 1.1 Login and Navigate to Nilai Page
**Steps:**
1. Login as praktikan
2. Click "Nilai" in navigation sidebar
3. Observe nilai page

**Expected Results:**
- Page loads at `/praktikan/nilai` or `/praktikan/score`
- ScoreTable component renders
- Praktikan sees their scores across all modules
- Table shows columns: Module, TA, Jurnal, FITB, TM, TK, Total
- No answer key links are visible (all locked by default)

#### 1.2 View Locked Answer Key Indicators
**Steps:**
1. On nilai page
2. Look for answer key access buttons/links
3. Observe lock indicators

**Expected Results:**
- Each answer type shows lock icon or "Locked" label
- Clicking on locked answer key shows tooltip: "Answer key is locked"
- Cannot access answer keys
- Lock icon is clearly visible (padlock icon or similar)

#### 1.3 Attempt to Access Locked Answer Key
**Steps:**
1. Find TA answer key button for Modul 1 (locked)
2. Click on it
3. Observe behavior

**Expected Results:**
- Click does nothing OR
- Modal/toast appears: "Answer key is currently locked"
- Cannot view answer key content
- User is informed why access is denied

---

### 2. Asisten Opens ModalOpenKJ

**Seed:** `tests/seed.spec.ts`

#### 2.1 Access ModalOpenKJ as Admin Asisten
**Steps:**
1. Login as asisten with admin role (SOFTWARE, KORDAS, WAKORDAS, ADMIN)
2. Navigate to any page (or stay on dashboard)
3. Click "Open Jawaban" in footer actions (sidebar footer)
4. Observe modal opening

**Expected Results:**
- ModalOpenKJ opens as overlay
- Modal displays title: "Kelola Kunci Jawaban" or "Manage Answer Keys"
- Close button (X) is visible
- Modal can be closed by clicking outside (backdrop) or close button

#### 2.2 View Module List in Modal
**Steps:**
1. ModalOpenKJ is open
2. Observe module list

**Expected Results:**
- All modules are listed (e.g., Modul 1, Modul 2, ... Modul 10)
- Each module row shows:
  - Module number and title
  - Toggle buttons for: TA, Jurnal, FITB, TM, TK
  - "Toggle All" button
- Current lock/unlock status is displayed for each type
- Loading state if data is being fetched

#### 2.3 View Current Unlock Status
**Steps:**
1. Observe toggle states in modal
2. Verify against expected initial state (all locked)

**Expected Results:**
- All toggles show "Locked" or OFF state
- Lock icons or red/gray indicators
- No answer keys are unlocked initially
- Status matches what praktikan see

---

### 3. Asisten Unlocks Single Answer Type

**Seed:** `tests/seed.spec.ts`

#### 3.1 Unlock TA for Modul 1
**Steps:**
1. Asisten has ModalOpenKJ open
2. Find Modul 1 row
3. Click toggle button for "TA"
4. Observe toggle state change

**Expected Results:**
- TA toggle changes to "Unlocked" or ON state
- Visual feedback: green color, unlock icon
- Other types (Jurnal, FITB, TM, TK) remain locked
- Change is immediately visible in modal
- Save button may become enabled (unsaved changes)

#### 3.2 Save Unlock Configuration
**Steps:**
1. TA for Modul 1 is toggled to unlocked
2. Click "Save" or "Save Changes" button at bottom of modal
3. Observe save process

**Expected Results:**
- Loading indicator on save button
- API PUT to `/api-v1/modul/{id}` with unlock_config
- Success toast: "Kunci jawaban berhasil diperbarui" or similar
- Modal may close automatically or remain open
- Changes are persisted to database
- WebSocket event broadcasts unlock change

#### 3.3 Verify Praktikan Sees Unlocked TA
**Steps:**
1. Praktikan is on nilai page (already loaded)
2. Asisten unlocks and saves TA for Modul 1
3. Observe praktikan's page (no manual refresh)

**Expected Results:**
- Within 1-2 seconds, praktikan's page updates
- TA for Modul 1 now shows unlock icon or "View" button
- Lock icon changes to unlock icon
- Clicking "View TA Answers" now opens answer key
- WebSocket event triggered real-time update
- Other answer types remain locked

#### 3.4 Praktikan Accesses Unlocked TA Answer Key
**Steps:**
1. TA for Modul 1 is unlocked
2. Praktikan clicks "View TA Answers" button
3. Observe answer key display

**Expected Results:**
- Answer key modal/page opens
- Displays TA questions and correct answers for Modul 1
- Praktikan can review correct answers
- Can close and return to nilai page
- Access is now granted

---

### 4. Asisten Unlocks Multiple Answer Types

**Seed:** `tests/seed.spec.ts`

#### 4.1 Unlock Jurnal and FITB for Modul 1
**Steps:**
1. ModalOpenKJ is open
2. In Modul 1 row, toggle "Jurnal" to unlocked
3. Toggle "FITB" to unlocked
4. Click "Save"
5. Observe changes

**Expected Results:**
- Both Jurnal and FITB show unlocked state in modal
- TA remains unlocked (from previous test)
- TM and TK remain locked
- Save succeeds with success message
- WebSocket broadcasts multiple unlock events OR single event with updated config

#### 4.2 Verify Praktikan Sees Multiple Unlocks
**Steps:**
1. Praktikan on nilai page
2. Asisten unlocks Jurnal and FITB for Modul 1
3. Observe praktikan's page updates

**Expected Results:**
- TA, Jurnal, and FITB for Modul 1 all show unlocked
- Praktikan can now access all three answer keys
- TM and TK remain locked
- Real-time update without refresh
- UI clearly indicates which are unlocked

---

### 5. Asisten Uses "Toggle All" Feature

**Seed:** `tests/seed.spec.ts`

#### 5.1 Unlock All Answer Types for Modul 2
**Steps:**
1. ModalOpenKJ is open
2. Find Modul 2 row
3. Click "Toggle All" or "Unlock All" button
4. Observe toggle states

**Expected Results:**
- All five toggles (TA, Jurnal, FITB, TM, TK) turn to unlocked
- All show green/unlocked state
- "Toggle All" button may change to "Lock All"
- Changes are pending (not yet saved)

#### 5.2 Save All Unlocks for Modul 2
**Steps:**
1. All types for Modul 2 are toggled unlocked
2. Click "Save"
3. Observe save and broadcast

**Expected Results:**
- Save succeeds
- Success message appears
- WebSocket broadcasts Modul 2 unlock configuration
- Praktikan with Modul 2 scores see all answer keys unlocked
- All five answer key access buttons become enabled

#### 5.3 Lock All Answer Types for Modul 2
**Steps:**
1. All types for Modul 2 are unlocked
2. Click "Toggle All" again (now "Lock All")
3. Observe toggles turn off
4. Click "Save"

**Expected Results:**
- All five toggles turn to locked state
- Save succeeds
- WebSocket broadcasts locked configuration
- Praktikan see all Modul 2 answer keys lock again in real-time
- Access is revoked

---

### 6. Asisten Manages Multiple Modules

**Seed:** `tests/seed.spec.ts`

#### 6.1 Unlock Different Types Across Modules
**Steps:**
1. ModalOpenKJ is open
2. Unlock: Modul 1 TA, Modul 2 Jurnal, Modul 3 TK
3. Click "Save"
4. Observe changes

**Expected Results:**
- Three different unlocks across three modules
- Each module has one type unlocked
- Save succeeds for all changes
- WebSocket broadcasts updates for all three modules
- Praktikan see selective unlocks across different modules

#### 6.2 Unlock All Modules at Once
**Steps:**
1. ModalOpenKJ is open
2. For each module (1-10), click "Toggle All" to unlock
3. Click "Save"
4. Observe mass unlock

**Expected Results:**
- All modules, all types are unlocked
- Save may take 2-3 seconds (bulk update)
- Success message appears
- WebSocket broadcasts complete unlock configuration
- All praktikan can now access all answer keys
- System handles bulk operation without errors

---

### 7. Real-time Synchronization Tests

**Seed:** `tests/seed.spec.ts`

#### 7.1 Praktikan Already on Page When Asisten Unlocks
**Steps:**
1. Praktikan is on nilai page (browser tab open)
2. Asisten opens ModalOpenKJ in different session/browser
3. Asisten unlocks TA for Modul 1 and saves
4. Observe praktikan's page without refresh

**Expected Results:**
- Praktikan's page updates within 1-2 seconds
- Lock icon changes to unlock icon
- "View" button appears for TA
- No page refresh required
- WebSocket connection delivers update

#### 7.2 Multiple Praktikan Receive Updates
**Steps:**
1. Three praktikan are on nilai page (different browsers/sessions)
2. Asisten unlocks Jurnal for Modul 2
3. Observe all three praktikan pages

**Expected Results:**
- All three praktikan receive WebSocket event
- All three pages update simultaneously (within 1-2 seconds)
- Consistent state across all praktikan
- No praktikan is left out of sync

#### 7.3 Praktikan Joins Page After Unlock
**Steps:**
1. Asisten unlocks TA and Jurnal for Modul 1
2. Wait 5 seconds
3. New praktikan logs in and navigates to nilai page
4. Observe initial state

**Expected Results:**
- New praktikan immediately sees TA and Jurnal unlocked
- No delay or waiting for WebSocket event
- Initial page load fetches current unlock status
- State is consistent with asisten's configuration

#### 7.4 Asisten Locks After Unlock
**Steps:**
1. Asisten has unlocked TA for Modul 1
2. Praktikan can access TA answers
3. Asisten locks TA for Modul 1 again
4. Praktikan's page is still open

**Expected Results:**
- Praktikan's page updates to show TA locked again
- "View" button disappears or becomes disabled
- Lock icon reappears
- If praktikan had answer key modal open, it may close or show warning
- Access is immediately revoked

---

### 8. Edge Cases and Error Handling

**Seed:** `tests/seed.spec.ts`

#### 8.1 Asisten Without Admin Role Tries to Access Modal
**Steps:**
1. Login as regular asisten (not admin)
2. Look for "Open Jawaban" button in sidebar footer
3. Attempt to access ModalOpenKJ

**Expected Results:**
- "Open Jawaban" button is not visible (role-based filtering)
- If accessed via direct action, error message appears
- Modal does not open
- Access is denied

#### 8.2 Network Error During Save
**Steps:**
1. Asisten unlocks TA for Modul 1 in modal
2. Simulate network error (offline mode)
3. Click "Save"
4. Observe error handling

**Expected Results:**
- Error toast: "Failed to save changes. Please check your connection."
- Modal remains open with unsaved changes
- Toggles remain in unlocked state (not reverted)
- Can retry save after connection restored
- No data loss

#### 8.3 Rapid Toggle Changes
**Steps:**
1. ModalOpenKJ is open
2. Rapidly toggle TA on/off 5 times
3. Click "Save"
4. Observe final state

**Expected Results:**
- Final toggle state is saved
- Intermediate states are ignored
- No race conditions
- Praktikan see only final state
- System handles rapid changes gracefully

#### 8.4 WebSocket Disconnection for Praktikan
**Steps:**
1. Praktikan is on nilai page
2. Simulate WebSocket disconnection (dev tools)
3. Asisten unlocks TA for Modul 1
4. Observe praktikan's page

**Expected Results:**
- Praktikan does not receive update immediately
- WebSocket attempts reconnection
- After reconnection, page may fetch latest state
- User may see reconnection indicator
- Eventually syncs to correct state

#### 8.5 Concurrent Asisten Making Changes
**Steps:**
1. Asisten A opens ModalOpenKJ
2. Asisten B opens ModalOpenKJ (different session)
3. Asisten A unlocks TA for Modul 1, saves
4. Asisten B unlocks Jurnal for Modul 1, saves
5. Observe final state

**Expected Results:**
- Both changes are saved (TA and Jurnal unlocked) OR
- Last save wins (Asisten B's save overwrites)
- WebSocket broadcasts both changes
- Praktikan see both unlocks
- No conflict errors (or conflict resolution mechanism)

---

### 9. Practical Workflow Scenarios

**Seed:** `tests/seed.spec.ts`

#### 9.1 Post-Quiz Answer Key Release
**Steps:**
1. Quiz has ended for Modul 1 TA
2. Asisten opens ModalOpenKJ
3. Unlocks TA for Modul 1
4. Saves changes
5. Praktikan can now review answers

**Expected Results:**
- Workflow completes smoothly
- Praktikan immediately gain access
- No manual notification needed
- Real-time update provides instant access

#### 9.2 Scheduled Answer Key Release
**Steps:**
1. Modul 2 content is complete
2. Asisten decides to release all answer keys
3. Unlocks all types for Modul 2 using "Toggle All"
4. Saves
5. All praktikan can now study using answer keys

**Expected Results:**
- All answer keys become available at once
- Praktikan studying at that moment see immediate access
- Supports self-study and review

#### 9.3 Revoke Access After Mistake
**Steps:**
1. Asisten accidentally unlocks TK for Modul 5 (test is tomorrow)
2. Praktikan start accessing answer key
3. Asisten quickly locks TK again
4. Saves

**Expected Results:**
- Praktikan lose access within 1-2 seconds
- Access is revoked in real-time
- Mistake is corrected quickly
- System supports immediate reversal

---

### 10. UI/UX Validation

**Seed:** `tests/seed.spec.ts`

#### 10.1 Clear Visual Distinction Between Locked/Unlocked
**Steps:**
1. Praktikan views nilai page with mixed locked/unlocked answer keys
2. Observe visual indicators

**Expected Results:**
- Locked: Padlock icon, gray/red color, "Locked" label
- Unlocked: Open padlock or unlock icon, green color, "View" button
- Clear contrast between states
- Accessible color scheme (not relying only on color)

#### 10.2 Asisten Modal Usability
**Steps:**
1. Asisten opens ModalOpenKJ
2. Test interaction with toggles
3. Observe visual feedback

**Expected Results:**
- Toggles are large and easy to click
- Hover effects on interactive elements
- Immediate visual feedback on toggle
- Clear labels for each question type
- Save button is prominent
- Cancel/close options are visible

#### 10.3 Praktikan Answer Key Access Flow
**Steps:**
1. Praktikan sees unlocked TA for Modul 1
2. Click "View TA Answers"
3. Review answer key
4. Close answer key
5. Return to nilai page

**Expected Results:**
- Access flow is smooth
- Answer key opens in modal or new view
- Can navigate back easily
- No confusion about how to access or close

---

## Test Data Requirements

### User Accounts Needed

1. **Admin Asisten Account**
   - Role: ADMIN, SOFTWARE, KORDAS, or WAKORDAS
   - Can access ModalOpenKJ

2. **Regular Asisten Account**
   - Non-admin role
   - Cannot access ModalOpenKJ (for permission testing)

3. **Multiple Praktikan Accounts**
   - At least 3 praktikan for simultaneous update testing
   - Have completed various modules with scores

### Data Setup

1. **Modules with Questions**
   - At least 5 modules
   - Each with all question types: TA, Jurnal, FITB, TM, TK
   - Answer keys available for all types

2. **Initial Unlock Configuration**
   - All answer keys locked initially for clean testing
   - Some modules can have partial unlocks for testing edge cases

3. **WebSocket Configuration**
   - Laravel Echo configured and running
   - Pusher or WebSocket provider active
   - Channels for module unlock events

---

## Success Criteria

### Functional Success
- ✅ Admin asisten can access ModalOpenKJ
- ✅ Can toggle individual answer types per module
- ✅ Can use "Toggle All" for bulk operations
- ✅ Changes save successfully to database
- ✅ Praktikan see locked/unlocked states correctly
- ✅ Praktikan can access unlocked answer keys

### Real-time Success
- ✅ WebSocket events broadcast unlock changes
- ✅ Praktikan pages update within 1-2 seconds without refresh
- ✅ Multiple praktikan receive updates simultaneously
- ✅ Lock/unlock changes sync in real-time

### Security Success
- ✅ Only admin asisten can access ModalOpenKJ
- ✅ Regular asisten cannot open modal
- ✅ Praktikan cannot access locked answer keys
- ✅ Access is revoked immediately when locked

### Usability Success
- ✅ Visual indicators are clear and distinct
- ✅ Toggle controls are intuitive
- ✅ Real-time updates are smooth
- ✅ No page refresh required for praktikan

---

## Notes for Test Implementation

1. **WebSocket Testing**: Requires actual WebSocket server or comprehensive mocking
2. **Concurrent Users**: Test with multiple browser sessions for asisten and praktikan
3. **Timing**: Verify WebSocket delivery timing (should be within 1-2 seconds)
4. **State Verification**: Check database state matches UI after saves
5. **Permission Enforcement**: Test role-based access thoroughly
6. **Network Conditions**: Test with intermittent network for resilience

---

**Document Version**: 1.0  
**Last Updated**: November 2024  
**Target Components**: 
- Praktikan: `resources/js/Pages/Praktikan/ScorePraktikan.jsx`, `resources/js/Components/Praktikans/Tables/ScoreTable.jsx`
- Asisten: `resources/js/Components/Assistants/Modals/ModalOpenKJ.jsx`, `resources/js/Components/Common/AssistantNav.jsx`
**Backend Dependencies**: `/api-v1/modul/*`, Laravel Echo/Pusher for WebSocket events
**Related Test Plans**: `ASISTEN_INPUT_NILAI_TEST_PLAN.md`
