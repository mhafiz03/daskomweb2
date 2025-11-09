# Asisten Start Praktikum to Report Submission - Comprehensive Test Plan

## Overview

This test plan covers the complete **Asisten Praktikum Management Flow** from starting a praktikum session, controlling phase transitions, monitoring praktikan progress, through to submitting the final praktikum report. The asisten has full control over the praktikum session lifecycle and is responsible for managing the session from start to finish.

## Application Flow Context

### Asisten Praktikum Control Flow

The asisten's responsibilities in managing a praktikum session:

1. **Session Setup** - Select class (kelas), module (modul), and DK
2. **Create & Start Session** - Initialize praktikum session and start timer
3. **Phase Management** - Advance through phases as praktikan complete tasks
4. **Progress Monitoring** - View real-time praktikan progress and completion status
5. **Session Control** - Pause/resume session as needed
6. **Report Submission** - Submit final praktikum report in feedback phase
7. **Session Completion** - Finish session to mark as completed

### Phase Sequence

The asisten controls phase progression through these stages:

1. **Preparation** - Pre-session setup, no questions yet
2. **TA (Tes Awal)** - Initial multiple choice test
3. **Jurnal** - Journal/essay questions with optional FITB
4. **Mandiri** - Independent work/essay questions
5. **TK (Tes Keterampilan)** - Skills test with multiple choice
6. **Feedback** - Praktikan submit feedback, asisten submits report

### Key Features

- **Real-time Progress Tracking**: TablePraktikanProgress shows each praktikan's phase progress with live updates via WebSocket
- **Online Status Tracking**: Presence channel tracks which praktikan are currently online
- **Running Praktikum Alert**: Shows all active praktikum sessions across classes
- **Phase Controls**: Next/Previous phase buttons with visual phase progress indicator
- **Session Actions**: Start, Pause, Resume, Finish buttons
- **Report Submission**: Text area for praktikum report (only in feedback phase)
- **Jadwal Jaga Display**: Shows assigned asisten (PJ) for the selected class
- **Auto-sync**: All changes broadcast via WebSocket to praktikan in real-time

### Status Types

- **idle**: No session exists or not yet started
- **running**: Session is active and timer is running
- **paused**: Session is paused, timer stopped
- **completed**: Session finished successfully
- **exited**: Session stopped/terminated prematurely

---

## Test Scenarios

### 1. Initial Page Load and Setup

**Seed:** `tests/seed.spec.ts`

#### 1.1 Navigate to Start Praktikum Page
**Steps:**
1. Login as asisten with `start praktikum` permission
2. Click "Start Praktikum" in navigation sidebar
3. Observe page load

**Expected Results:**
- Page loads successfully at `/assistants/start-praktikum`
- ContentPraktikum component renders
- Three dropdown selectors visible:
  - Kelas (Class)
  - Modul (Module)
  - DK (DK1 or DK2)
- No session is active (idle state)
- Control buttons are visible but may be disabled
- No praktikan progress table visible yet

#### 1.2 View Empty State
**Steps:**
1. On Start Praktikum page with no selections
2. Observe page content

**Expected Results:**
- Dropdowns show placeholder options:
  - "- Pilih Kelas -"
  - "- Pilih Modul -"
  - "DK1" selected by default
- Timer shows 00:00 for both phase and total
- Phase indicators show all phases in inactive state
- Status shows "Not Yet Started" or equivalent
- "Start" button is disabled (no selection made)

---

### 2. Selecting Class, Module, and DK

**Seed:** `tests/seed.spec.ts`

#### 2.1 Load Kelas Dropdown
**Steps:**
1. On Start Praktikum page
2. Click on Kelas dropdown
3. Observe dropdown options

**Expected Results:**
- Dropdown opens with list of available classes
- Loading state shows "Memuat kelas..." if data is loading
- Classes are listed with readable names (e.g., "B", "C", "TOT-A1")
- Can select a class from the list
- Error state shows "Gagal memuat kelas" if API fails

#### 2.2 Select a Kelas
**Steps:**
1. Open Kelas dropdown
2. Select a specific class (e.g., "B")
3. Observe changes

**Expected Results:**
- Selected class is highlighted in dropdown
- Dropdown closes after selection
- Selection is stored (persists if refreshed)
- Triggers loading of praktikum data for selected class
- May trigger loading of jadwal jaga (schedule) data

#### 2.3 Load Modul Dropdown
**Steps:**
1. With or without kelas selected
2. Click on Modul dropdown
3. Observe dropdown options

**Expected Results:**
- Dropdown opens with list of available modules
- Modules show titles (e.g., "Modul 1 - Pengenalan Dasar-Koding", "Modul 2 - Pemrograman C++")
- Loading state shows "Memuat modul..." if loading
- Error state shows "Gagal memuat modul" if API fails
- Empty state shows "Data modul kosong" if no modules available

#### 2.4 Select a Modul
**Steps:**
1. Open Modul dropdown
2. Select a specific module
3. Observe changes

**Expected Results:**
- Selected module is highlighted
- Dropdown closes after selection
- Selection is stored
- Triggers check for existing praktikum session with this kelas+modul+dk combination

#### 2.5 Change DK Selection
**Steps:**
1. Observe DK dropdown (default is "DK1")
2. Click DK dropdown
3. Select "DK2"
4. Observe changes

**Expected Results:**
- DK dropdown shows both options: DK1 and DK2
- Selecting DK2 updates the selection
- Triggers check for existing praktikum session for new combination
- Can switch back to DK1

#### 2.6 View Jadwal Jaga (Schedule)
**Steps:**
1. Select a kelas
2. Scroll down to view jadwal jaga section (if visible)
3. Observe asisten assignment

**Expected Results:**
- Jadwal jaga section shows assigned asisten for the class
- Displays asisten names and possibly photos
- Shows shift/schedule information
- May indicate current asisten as PJ (person in charge)

---

### 3. Running Praktikum Alert

**Seed:** `tests/seed.spec.ts`

#### 3.1 View Running Praktikum List
**Steps:**
1. Another asisten has started praktikum for "Kelas C - Modul 2 - DK1"
2. Current asisten navigates to Start Praktikum page
3. Observe running praktikum section

**Expected Results:**
- Alert box appears with heading "Praktikum Sedang Berjalan (1)"
- Shows animated pulse indicator (amber/yellow color)
- Lists running praktikum with:
  - Kelas name
  - Modul name
  - DK label
  - Status badge (Running or Paused)
  - Current phase label (e.g., "TA", "Jurnal")
  - Arrow button to switch to that praktikum
- Alert box has amber/yellow theme
- Dark mode support

#### 3.2 Switch to Running Praktikum
**Steps:**
1. Running praktikum list shows "Kelas B - Modul 1 - DK2"
2. Click arrow button next to that entry
3. Observe page changes

**Expected Results:**
- Kelas dropdown auto-selects "B"
- Modul dropdown auto-selects "Modul 1"
- DK dropdown auto-selects "DK2"
- Page scrolls to top smoothly
- Session data loads for that praktikum
- Timer and phase indicators update to show current state
- Can now control that session

#### 3.3 Multiple Running Praktikum
**Steps:**
1. Three praktikum sessions are running across different classes
2. View Start Praktikum page
3. Observe running praktikum list

**Expected Results:**
- Alert shows "Praktikum Sedang Berjalan (3)"
- All three sessions are listed
- Each has distinct kelas/modul/dk combination
- Can switch to any of them
- Currently selected praktikum is highlighted with different border color

---

### 4. Starting a New Praktikum Session

**Seed:** `tests/seed.spec.ts`

#### 4.1 Validate Required Selections
**Steps:**
1. On Start Praktikum page
2. Click "Start" button without selecting kelas
3. Observe validation

**Expected Results:**
- Error toast appears: "Pilih kelas dan modul sebelum memulai praktikum"
- No session is created
- Page remains in idle state

#### 4.2 Start Fresh Praktikum Session
**Steps:**
1. Select kelas: "B"
2. Select modul: "Modul 1 - Pengenalan Dasar-Koding"
3. Ensure DK is "DK1"
4. Verify no existing session for this combination
5. Click "Start" button
6. Observe session creation

**Expected Results:**
- "Start" button shows loading indicator
- API POST to `/api-v1/praktikum` creates new session
- Success toast: "Status praktikum diperbarui" or similar
- Session status changes to "running"
- Timer starts counting from 00:00
- First phase (Preparation) is activated
- Phase progress indicator highlights "Preparation"
- Start button changes to "Pause" button
- "Next Phase" button becomes enabled
- Running praktikum alert appears (if not already visible)

#### 4.3 Start Praktikum with Existing Session
**Steps:**
1. Existing completed session exists for "Kelas B - Modul 2 - DK1"
2. Select that combination
3. Click "Start" button
4. Observe behavior

**Expected Results:**
- Button may show "Restart" instead of "Start"
- New session is created or existing session is resumed
- Timer starts from 00:00
- Session progresses normally
- Old session data may be archived or overwritten (depends on implementation)

#### 4.4 Multiple Asisten Starting Same Praktikum
**Steps:**
1. Asisten A selects "Kelas C - Modul 1 - DK1" and starts
2. Asisten B tries to select same combination and start
3. Observe behavior

**Expected Results:**
- Asisten B sees the session in "Running Praktikum" alert
- Asisten B can switch to that session
- Only one active session per kelas+modul+dk combination
- Backend prevents duplicate sessions or returns existing session

---

### 5. Phase Management

**Seed:** `tests/seed.spec.ts`

#### 5.1 View Phase Progress Indicator
**Steps:**
1. Praktikum session is running in Preparation phase
2. Observe phase indicator section
3. Verify all phases are displayed

**Expected Results:**
- All 6 phases are displayed in sequence:
  - Preparation → TA → Jurnal → Mandiri → TK → Feedback
- Current phase (Preparation) is highlighted with primary color
- Other phases show inactive state (gray/muted)
- Arrows (→) separate phases
- Visual hierarchy is clear

#### 5.2 Advance to Next Phase
**Steps:**
1. Session is in Preparation phase
2. Click "Next Phase" button
3. Observe phase transition

**Expected Results:**
- Loading indicator on button
- API PUT to `/api-v1/praktikum/{id}` with action="next_phase"
- Success toast notification
- Phase changes to "TA" (next in sequence)
- Phase indicator updates: TA is now highlighted
- Preparation becomes "completed" (different styling)
- Phase timer resets to 00:00
- Total session timer continues counting
- WebSocket event broadcasts phase change to all praktikan

#### 5.3 Advance Through All Phases Sequentially
**Steps:**
1. Start from Preparation phase
2. Click "Next Phase" 5 times to go through all phases
3. Observe each transition

**Expected Results:**
- Phases advance in order: Preparation → TA → Jurnal → Mandiri → TK → Feedback
- Each transition is smooth with success toast
- Phase indicator updates correctly each time
- Phase timer resets at each transition
- Total timer continues accumulating
- At Feedback phase, "Next Phase" button is disabled (last phase)

#### 5.4 Go to Previous Phase
**Steps:**
1. Session is in TK phase
2. Click "Previous Phase" button
3. Observe phase transition

**Expected Results:**
- Loading indicator on button
- API PUT with action="previous_phase" or direct phase specification
- Success toast notification
- Phase changes to Mandiri (previous phase)
- Phase indicator updates correctly
- Can navigate backward through phases if needed
- Timer behavior (may reset or continue, depends on implementation)

#### 5.5 Jump to Specific Phase (if implemented)
**Steps:**
1. Session is in TA phase
2. Click directly on "TK" in phase indicator (if clickable)
3. Observe phase jump

**Expected Results:**
- Phase jumps directly to TK
- Skipped phases (Jurnal, Mandiri) are marked as completed or skipped
- Success toast notification
- Phase indicator updates correctly

#### 5.6 Phase Change While Praktikan Are Answering
**Steps:**
1. Session is in TA phase
2. Praktikan are actively answering questions
3. Asisten clicks "Next Phase" to advance to Jurnal
4. Observe praktikan screens update

**Expected Results:**
- Asisten's phase changes immediately
- WebSocket event broadcasts to all praktikan
- Praktikan screens auto-update to Jurnal phase within 1-2 seconds
- No page refresh needed for praktikan
- Praktikan see smooth transition to new phase

---

### 6. Session Control Actions

**Seed:** `tests/seed.spec.ts`

#### 6.1 Pause Running Session
**Steps:**
1. Praktikum session is running in TA phase
2. Timer is counting (e.g., 05:23)
3. Click "Pause" button
4. Observe changes

**Expected Results:**
- Loading indicator on button
- API PUT with action="pause"
- Success toast notification
- Session status changes to "paused"
- Timer stops counting (frozen at current time)
- "Pause" button changes to "Resume" button
- Phase controls remain available
- Praktikan receive WebSocket event (may see paused indicator)

#### 6.2 Resume Paused Session
**Steps:**
1. Session is paused at 05:23
2. Click "Resume" button
3. Observe changes

**Expected Results:**
- Loading indicator on button
- API PUT with action="resume"
- Success toast notification
- Session status changes back to "running"
- Timer resumes counting from 05:23 (05:24, 05:25, etc.)
- "Resume" button changes back to "Pause" button
- Praktikan receive resume event

#### 6.3 Pause and Resume Multiple Times
**Steps:**
1. Start session, run for 2 minutes
2. Pause, wait 1 minute (timer frozen)
3. Resume, run for 1 minute
4. Pause again, wait 30 seconds
5. Resume, run for 1 minute
6. Observe total elapsed time

**Expected Results:**
- Total elapsed time reflects only running periods
- Paused periods are not counted in elapsed time
- Timer accuracy is maintained
- Session can be paused/resumed unlimited times
- No errors or stuck states

#### 6.4 Change Phase While Paused
**Steps:**
1. Session is running in TA phase
2. Pause the session
3. Click "Next Phase" to advance to Jurnal
4. Observe behavior

**Expected Results:**
- Phase change succeeds even while paused
- Session remains paused in Jurnal phase
- Can resume after phase change
- Timer reflects paused state
- Praktikan see phase change even though session is paused

---

### 7. Praktikan Progress Monitoring

**Seed:** `tests/seed.spec.ts`

#### 7.1 View Praktikan Progress Table
**Steps:**
1. Session is running in TA phase
2. Scroll down to praktikan progress section
3. Observe progress table

**Expected Results:**
- TablePraktikanProgress component is visible
- Table shows list of praktikan in the selected class
- Columns include:
  - Praktikan name/NRP
  - Current phase
  - Completion status for each phase (checkmarks/progress)
  - Online status indicator
- Table is scrollable if many praktikan
- Real-time updates via WebSocket

#### 7.2 Online Status Tracking
**Steps:**
1. View praktikan progress table
2. Praktikan A opens praktikum page (joins presence channel)
3. Observe praktikan A's status in table
4. Praktikan A closes tab
5. Observe status change

**Expected Results:**
- Praktikan A shows online indicator when page is open
- Online indicator: green dot or "online" badge
- When praktikan closes tab, indicator changes to offline/gray
- Presence updates within 2-3 seconds
- Only praktikan with page open show as online

#### 7.3 Phase Progress Per Praktikan
**Steps:**
1. Session advances from TA to Jurnal
2. Praktikan A submits TA answers immediately
3. Praktikan B has not submitted yet
4. Observe progress table

**Expected Results:**
- Praktikan A shows TA phase as completed (checkmark or green indicator)
- Praktikan A shows Jurnal phase as "in progress" or current
- Praktikan B shows TA phase as "not completed" or pending
- Progress updates in real-time as praktikan submit answers
- Visual distinction between completed/in-progress/pending states

#### 7.4 Real-time Progress Updates
**Steps:**
1. View progress table during Jurnal phase
2. Praktikan C submits Jurnal answers
3. Observe table update without refreshing

**Expected Results:**
- Table updates automatically within 1-2 seconds
- Praktikan C's Jurnal status changes to completed
- No page refresh needed
- WebSocket event triggers table re-render
- Smooth update animation (if implemented)

#### 7.5 Filter or Search Praktikan (if implemented)
**Steps:**
1. View progress table with 30+ praktikan
2. Use search box to find "1234567890" (NRP)
3. Observe filtered results

**Expected Results:**
- Table filters to show only matching praktikan
- Search is case-insensitive
- Can clear search to show all praktikan
- Filtered view still receives real-time updates

---

### 8. Feedback Phase and Report Submission

**Seed:** `tests/seed.spec.ts`

#### 8.1 Advance to Feedback Phase
**Steps:**
1. Session is in TK phase (last task phase)
2. Click "Next Phase" to advance to Feedback
3. Observe page changes

**Expected Results:**
- Phase changes to "Feedback"
- Phase indicator highlights Feedback
- Report form appears:
  - "Laporan Praktikum" label
  - Large text area for report notes
  - Character counter or minimum length indicator
  - Submit button labeled "Kirim Laporan" or "Submit Report"
- Placeholder text in text area
- Note about PJ (person in charge) auto-following asisten who submits

#### 8.2 View Report Form
**Steps:**
1. In Feedback phase
2. Observe report form elements

**Expected Results:**
- Text area is empty by default (unless previous report exists)
- Text area accepts multiline input
- Minimum 3 characters required note is displayed
- Submit button is initially disabled or shows validation message
- Form is clearly labeled and styled

#### 8.3 Type Report Notes
**Steps:**
1. In Feedback phase
2. Click in report text area
3. Type: "Praktikum berjalan lancar. Semua praktikan hadir dan menyelesaikan tugas tepat waktu."
4. Observe text area

**Expected Results:**
- Text appears as typed
- No input lag
- Text area expands or scrolls as needed
- Character count updates (if displayed)
- Can type multiple paragraphs
- Can edit and format text

#### 8.4 Submit Valid Report
**Steps:**
1. In Feedback phase with report text entered (> 3 characters)
2. Click "Kirim Laporan" button
3. Observe submission

**Expected Results:**
- Loading indicator on submit button
- API PUT to `/api-v1/praktikum/{id}` with action="report" and report_notes
- Success toast: "Status praktikum diperbarui" or "Laporan berhasil dikirim"
- Text area becomes read-only or disappears
- Report preview section appears showing submitted report
- Cannot re-submit or edit report
- Report is saved to database with asisten ID as PJ

#### 8.5 Attempt to Submit Report Before Feedback Phase
**Steps:**
1. Session is in TA phase (not Feedback)
2. Try to submit report (if form is somehow accessible)
3. Observe validation

**Expected Results:**
- Error toast: "Laporan hanya dapat dikirim pada tahap Feedback"
- Submission is blocked
- No API call is made
- Form may be hidden or disabled when not in Feedback phase

#### 8.6 Submit Report with Insufficient Length
**Steps:**
1. In Feedback phase
2. Type only "Ok" (2 characters)
3. Click submit button
4. Observe validation

**Expected Results:**
- Error toast: "Isi laporan minimal 3 karakter"
- Submission is blocked
- Text remains in text area for editing
- Can add more characters and retry

#### 8.7 View Submitted Report
**Steps:**
1. Report has been submitted successfully
2. Remain in Feedback phase
3. Observe report preview section

**Expected Results:**
- Report text is displayed in read-only format
- Cannot edit or re-submit
- Confirmation message: "Laporan sudah dikirim" or similar
- Report includes timestamp (if implemented)
- Shows PJ name (current asisten)

---

### 9. Finishing the Praktikum Session

**Seed:** `tests/seed.spec.ts`

#### 9.1 Finish Session After Report Submission
**Steps:**
1. Session is in Feedback phase
2. Report has been submitted
3. All praktikan have submitted feedback (optional)
4. Click "Finish" button
5. Observe session completion

**Expected Results:**
- Loading indicator on button
- API PUT with action="finish" or status="completed"
- Success toast: "Praktikum selesai" or "Session completed"
- Session status changes to "completed"
- Timer stops at final time
- All phase indicators show completed state
- Control buttons (Pause, Next Phase) become disabled
- Session summary may be displayed
- Session moves to history/completed list

#### 9.2 Finish Session Without Report (Edge Case)
**Steps:**
1. Session is in Feedback phase
2. No report has been submitted yet
3. Click "Finish" button
4. Observe behavior

**Expected Results:**
- Validation error: "Submit report before finishing" OR
- Session finishes without report (warning shown) OR
- Report is required (button disabled until report submitted)
- Behavior depends on business rules

#### 9.3 View Completed Session
**Steps:**
1. Session has been finished
2. Remain on page
3. Observe session state

**Expected Results:**
- Status shows "Finished" or "Completed"
- Timer shows final elapsed time
- All data is read-only
- Report is visible
- Cannot restart or modify session
- Session appears in history
- Running praktikum alert no longer shows this session

#### 9.4 Exit Session Prematurely
**Steps:**
1. Session is running in Mandiri phase
2. Click "Exit" or "Stop" button (if available)
3. Observe session termination

**Expected Results:**
- Confirmation dialog: "Are you sure you want to stop this session?"
- If confirmed, session status changes to "exited"
- Timer stops
- Session is terminated but not marked as completed
- Praktikan are notified via WebSocket
- Session data is preserved for review

---

### 10. Real-time Synchronization

**Seed:** `tests/seed.spec.ts`

#### 10.1 WebSocket Connection Established
**Steps:**
1. Navigate to Start Praktikum page
2. Select kelas and modul
3. Check browser console for WebSocket
4. Observe connection

**Expected Results:**
- WebSocket connection to Laravel Echo/Pusher established
- Channel subscription: `praktikum.{id}`
- Presence channel subscription: `presence-kelas.{kelas_id}`
- No connection errors
- Events can be received

#### 10.2 Broadcast Phase Change to Praktikan
**Steps:**
1. Asisten advances from TA to Jurnal phase
2. Praktikan are on praktikum page
3. Observe praktikan screens

**Expected Results:**
- Asisten's page updates immediately
- WebSocket event broadcasts to `praktikum.{id}` channel
- All praktikan subscribed to that channel receive event
- Praktikan pages auto-update to Jurnal phase within 1-2 seconds
- Event payload includes new phase, timestamp, status

#### 10.3 Broadcast Pause/Resume to Praktikan
**Steps:**
1. Asisten pauses running session
2. Observe praktikan screens

**Expected Results:**
- Asisten's page shows paused state
- WebSocket event broadcasts pause action
- Praktikan receive pause event
- Praktikan may see timer stop or paused indicator
- Session remains accessible but in paused state

#### 10.4 Presence Channel for Online Tracking
**Steps:**
1. Session is running
2. Praktikan A opens praktikum page (joins presence channel)
3. Praktikan B opens page
4. Praktikan A closes tab
5. Observe asisten's progress table

**Expected Results:**
- Presence channel: `presence-kelas.{kelas_id}`
- Asisten's table shows Praktikan A as online when page opens
- Praktikan B appears as online
- When Praktikan A closes tab, leaves presence channel
- Asisten's table updates to show Praktikan A as offline
- Presence updates within 2-3 seconds

#### 10.5 Multiple Asisten Viewing Same Session
**Steps:**
1. Asisten A starts session for "Kelas B - Modul 1 - DK1"
2. Asisten B switches to same session via running praktikum list
3. Asisten A changes phase to Jurnal
4. Observe Asisten B's page

**Expected Results:**
- Both asisten see same session data
- Phase change by Asisten A broadcasts to Asisten B
- Asisten B's page updates to Jurnal phase automatically
- Only one asisten should be able to control (or both can, depends on implementation)
- Concurrent control is handled gracefully (no conflicts)

---

### 11. Edge Cases and Error Handling

**Seed:** `tests/seed.spec.ts`

#### 11.1 API Error When Starting Session
**Steps:**
1. Select kelas and modul
2. Simulate API error (500 response) for POST `/api-v1/praktikum`
3. Click "Start" button
4. Observe error handling

**Expected Results:**
- Error toast with message from API or generic error
- Session does not start
- Page remains in idle state
- Can retry after fixing issue
- No stuck loading state

#### 11.2 API Error During Phase Change
**Steps:**
1. Session is running in TA phase
2. Simulate API error for phase change
3. Click "Next Phase"
4. Observe error handling

**Expected Results:**
- Error toast appears
- Phase does not change (remains in TA)
- Can retry phase change
- Session remains in consistent state
- No partial updates

#### 11.3 WebSocket Disconnection
**Steps:**
1. Session is running
2. Simulate network disconnection (dev tools offline mode)
3. Wait 10 seconds
4. Re-enable network
5. Observe reconnection

**Expected Results:**
- WebSocket detects disconnection
- Automatic reconnection attempts occur
- Connection is re-established
- Page fetches latest session state
- No data loss
- Session continues normally

#### 11.4 Rapid Phase Changes
**Steps:**
1. Session is in Preparation
2. Quickly click "Next Phase" 3 times in rapid succession
3. Observe behavior

**Expected Results:**
- Only first click is processed (subsequent clicks disabled during loading)
- Phase advances one step at a time
- No race conditions or skipped phases
- API calls are queued or debounced
- Final phase is correct

#### 11.5 Session Without Praktikan
**Steps:**
1. Create session for class with no enrolled praktikan
2. Start session
3. Observe progress table

**Expected Results:**
- Session starts successfully
- Progress table is empty or shows "No praktikan enrolled"
- Can still control phases
- Can submit report
- Can finish session
- No errors due to empty praktikan list

#### 11.6 Browser Refresh During Active Session
**Steps:**
1. Session is running in Jurnal phase
2. Refresh browser page (F5)
3. Observe session restoration

**Expected Results:**
- Page reloads to Start Praktikum
- Selected kelas, modul, DK are restored (if stored)
- Session data is fetched from backend
- Timer shows accurate elapsed time
- Phase indicator shows Jurnal as active
- Can continue controlling session without issues

---

### 12. Performance and Usability

**Seed:** `tests/seed.spec.ts`

#### 12.1 Page Load Performance
**Steps:**
1. Navigate to Start Praktikum page
2. Measure time to interactive
3. Observe loading states

**Expected Results:**
- Page loads within 2-3 seconds
- Dropdowns populate quickly (< 1 second)
- No long blank loading screens
- Loading indicators for async data
- Smooth rendering

#### 12.2 Real-time Update Performance
**Steps:**
1. Session with 40 praktikan in progress
2. 10 praktikan submit answers simultaneously
3. Observe progress table updates

**Expected Results:**
- Table updates smoothly without lag
- No visual stuttering or freezing
- Updates appear within 2-3 seconds
- Table remains scrollable during updates
- No performance degradation with many updates

#### 12.3 Timer Accuracy
**Steps:**
1. Start session and run for 10 minutes
2. Compare timer to actual elapsed time (use stopwatch)
3. Observe timer accuracy

**Expected Results:**
- Timer is accurate within ±2 seconds
- Updates every second consistently
- Phase timer and total timer both accurate
- Pausing/resuming maintains accuracy

#### 12.4 Responsive Layout
**Steps:**
1. View Start Praktikum page on desktop (1920x1080)
2. Resize to tablet width (768px)
3. Resize to mobile width (375px)
4. Observe layout adaptation

**Expected Results:**
- Layout adapts to different screen sizes
- Dropdowns remain functional on mobile
- Progress table is scrollable on small screens
- Buttons are tap-friendly on mobile
- No horizontal scrolling
- All controls remain accessible

---

### 13. Report History and Completion

**Seed:** `tests/seed.spec.ts`

#### 13.1 View Completed Sessions in History
**Steps:**
1. Finish a praktikum session
2. Navigate to History page (if available)
3. Observe completed sessions list

**Expected Results:**
- Completed session appears in history
- Shows module name, class, DK, date/time
- Shows PJ (asisten who submitted report)
- Can view report details
- Can view praktikan scores and progress
- Session is read-only

#### 13.2 Export or Print Report (if implemented)
**Steps:**
1. View completed session
2. Click "Export" or "Print" button
3. Observe export functionality

**Expected Results:**
- Report is exported to PDF or printed
- Includes all session details
- Includes praktikan progress and scores
- Includes report notes
- Format is professional and readable

---

## Test Data Requirements

### User Accounts Needed

1. **Asisten Account with Full Permissions**
   - Must have `start praktikum` permission
   - Assigned to multiple classes
   - Can access all praktikum management features

2. **Multiple Praktikan Accounts**
   - At least 5-10 praktikan in same class
   - Different progress states for testing
   - Some online, some offline

3. **Multiple Asisten Accounts**
   - For testing concurrent access
   - Different permission levels (if applicable)

### Data Setup

1. **Classes (Kelas)**
   - At least 3 classes (e.g., "B", "C", "TOT-A1")
   - Each with enrolled praktikan

2. **Modules with Complete Questions**
   - At least 3 modules with all question types:
     - TA questions (10-15 multiple choice)
     - Jurnal questions (5-7 essay)
     - Mandiri questions (3-5 essay)
     - TK questions (10-15 multiple choice)

3. **Jadwal Jaga (Schedule)**
   - Assigned asisten for each class
   - Shift information

4. **WebSocket Configuration**
   - Laravel Echo configured
   - Pusher or WebSocket provider running
   - Channels set up for praktikum and presence

---

## Success Criteria

### Functional Success
- ✅ Can select kelas, modul, and DK successfully
- ✅ Can create and start new praktikum session
- ✅ Can control all phases (next/previous)
- ✅ Can pause, resume, and finish session
- ✅ Can submit report in feedback phase
- ✅ Progress table shows real-time updates
- ✅ Online status tracking works correctly
- ✅ Running praktikum alert displays active sessions

### Real-time Success
- ✅ Phase changes broadcast to praktikan within 1-2 seconds
- ✅ Pause/resume broadcasts correctly
- ✅ Presence channel tracks online status accurately
- ✅ Progress updates appear in real-time
- ✅ Multiple asisten can view same session with sync

### Performance Success
- ✅ Page loads within 2-3 seconds
- ✅ Phase transitions complete within 1 second
- ✅ Progress table updates smoothly with 40+ praktikan
- ✅ Timer remains accurate throughout session
- ✅ No lag or freezing during operation

### Data Integrity Success
- ✅ All session data is persisted correctly
- ✅ Report is saved with correct PJ assignment
- ✅ Timer reflects accurate elapsed time
- ✅ Phase progression is tracked correctly
- ✅ Praktikan progress is recorded accurately

---

## Notes for Test Implementation

1. **WebSocket Testing**: Requires actual WebSocket server or comprehensive mocking
2. **Concurrent Users**: Test with multiple browser sessions for asisten and praktikan
3. **Timing Tests**: Use actual delays to verify timer accuracy and real-time updates
4. **Database State**: Ensure clean state between tests (clear previous sessions)
5. **Permission Testing**: Verify that only asisten with correct permissions can access
6. **Error Simulation**: Mock API failures to test error handling
7. **Browser Compatibility**: Test on Chrome, Firefox, Safari, Edge
8. **Mobile Testing**: Verify functionality on actual mobile devices

---

**Document Version**: 1.0  
**Last Updated**: November 2024  
**Target Component**: `resources/js/Components/Assistants/Content/ContentPraktikum.jsx`  
**Related Pages**: `resources/js/Pages/Assistants/StartPraktikum.jsx`  
**Backend Dependencies**: `/api-v1/praktikum`, `/api-v1/kelas`, `/api-v1/modul`, Laravel Echo/Pusher, Presence Channels  
**Praktikan Counterpart**: `PRAKTIKAN_PRAKTIKUM_SESSION_TEST_PLAN.md`
