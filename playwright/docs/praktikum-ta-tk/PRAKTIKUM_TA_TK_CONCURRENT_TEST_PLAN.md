# Praktikum TA & TK Concurrent Users - Test Plan

## Overview

This test plan focuses on the **most problematic phases** of praktikum sessions: **TA (Tugas Akhir)** and **TK (Tugas Kompre)** with **20+ concurrent users**. These phases are known to experience failures under high load, particularly during answer submission and grading.

The asisten will skip through Jurnal and Mandiri phases quickly (just clicking "Next"), focusing test scenarios on TA and TK where database transactions, concurrent writes, and race conditions are most likely to cause issues.

**Critical Components:**

**Asisten Side:**
- `ContentPraktikum.jsx` - Asisten praktikum control panel
- `TablePraktikanProgress.jsx` - Real-time progress tracking

**Praktikan Side:**
- `TesAwal.jsx` - TA (Tes Awal) question interface
- `TesKeterampilan.jsx` - TK (Tes Keterampilan) question interface
- `QuestionCommentInput.jsx` - Optional comment feature per question

**Backend:**
- `JawabanTAController.php` - TA answer submission & scoring
- `JawabanTKController.php` - TK answer submission & scoring
- `PraktikumController.php` - Phase management

**Known Problem Areas:**
- Race conditions during concurrent answer submissions
- Database transaction deadlocks with 20+ users
- Auto-scoring calculation failures under load
- Progress tracking synchronization issues
- WebSocket event broadcasting delays
- UI rendering delays with 10+ questions

**API Endpoints:**
- `POST /jawaban-ta` - Submit TA answers
- `GET /jawaban-ta/{idModul}` - Retrieve TA answers
- `POST /jawaban-tk` - Submit TK answers  
- `GET /jawaban-tk/{idModul}` - Retrieve TK answers
- `PUT /api-v1/praktikum/{id}` - Update praktikum phase/status
- `GET /api-v1/praktikum/{id}/progress` - Get praktikan progress

---

## Test Data Setup

### Required Seeds

**Praktikan Accounts: 25 users**
- NIM: `1000000001` to `1000000025`
- All passwords: `TestPass123`
- All in same kelas (e.g., Kelas A)
- Permission: `praktikum-lms`, `lihat-modul`

**Asisten Account:**
- Kode: `TST`
- Password: `TestAsisten123`
- Permission: `start praktikum`, `kontroling praktikum`

**Modul Setup:**
- Modul ID: 1 (e.g., "Modul 1")
- Must have **10 TA questions** (soal_tas table)
  - Each question: 4 options (A, B, C, D)
  - Each question: 1 correct answer (opsi_benar_id)
  - Question type: `SoalOpsi::TYPE_TA`
- Must have **10 TK questions** (soal_tks table)
  - Each question: 4 options (A, B, C, D)
  - Each question: 1 correct answer (opsi_benar_id)
  - Question type: `SoalOpsi::TYPE_TK`

**Kelas Setup:**
- Kelas A with 25 praktikan enrolled
- Jadwal jaga assigned to TST asisten

---

## Praktikan UI Components

### TesAwal.jsx (TA Phase)

**Component Structure:**
```jsx
- Header: "Tes Awal" (blue background)
- Questions Container: Scrollable, max-height 90vh
- Each Question Card:
  - Question number badge (circular, blue, white text)
  - Question text (whitespace-pre-wrap)
  - QuestionCommentInput (if enabled)
  - 4 Radio options labeled A, B, C, D
  - Selected option: highlighted with primary color
  - Hover effects: border color change, scale transform
```

**Key Features:**
- `isLoading` - Shows loading message
- `errorMessage` - Displays error if questions fail to load
- `questions[]` - Array of question objects with `{id, text, options[]}`
- `answers[]` - Array of selected option IDs indexed by question
- `setAnswers()` - Updates answer array on option change
- `onSubmitTask()` - Callback to submit answers (called externally)
- `isCommentEnabled` - Shows/hides comment input per question
- `tipeSoal` - Question type identifier for comments
- `praktikanId` - User ID for comment association

**State Management:**
- Answers stored in parent component state
- Each radio selection updates `answers[index]` with `option.id`
- No local submission - controlled by parent component

### TesKeterampilan.jsx (TK Phase)

**Component Structure:**
```jsx
- Header: "Tes Keterampilan" (blue background)
- Questions Container: Scrollable, max-height 90vh
- Each Question Card:
  - Question number badge (circular, blue, white text)
  - Question text (whitespace-pre-wrap)
  - QuestionCommentInput (if enabled)
  - 4 Radio options labeled A, B, C, D
  - Selected option: highlighted with primary color
  - Hover effects: border color change, scale transform
```

**Key Features:**
- Identical structure to `TesAwal.jsx`
- Same props interface
- Same state management pattern
- Different header title: "Tes Keterampilan"
- Radio button name: `tes-keterampilan-${question.id}`

**Visual Styling:**
- Tailwind Depth theme variables
- Smooth transitions (duration-200)
- Shadows: depth-sm, depth-md, depth-lg
- Rounded corners: rounded-depth-md, rounded-depth-lg
- Primary color highlights for selected options
- Scale transform on selection: scale-[1.02]

---

## Phase Sequence Context

```javascript
PHASE_SEQUENCE = [
    "preparation",  // 0 - Setup phase
    "ta",          // 1 - TA phase (FOCUS) → TesAwal.jsx
    "fitb_jurnal", // 2 - Jurnal (SKIP with Next)
    "mandiri",     // 3 - Mandiri (SKIP with Next)
    "tk",          // 4 - TK phase (FOCUS) → TesKeterampilan.jsx
    "feedback"     // 5 - Final phase
]
```

**Test Flow:**
1. Asisten starts praktikum → preparation phase
2. Asisten clicks Next → **TA phase** → 25 praktikan see `TesAwal.jsx`
3. Asisten clicks Next → fitb_jurnal (SKIP immediately)
4. Asisten clicks Next → mandiri (SKIP immediately)
5. Asisten clicks Next → **TK phase** → 25 praktikan see `TesKeterampilan.jsx`
6. Asisten clicks Next → feedback phase
7. Asisten exits praktikum

---

## Test Scenarios

### 1. Praktikum Session Initialization

#### 1.1 Asisten Starts Praktikum
**Preconditions:** Asisten logged in, praktikum not yet started

**Steps:**
1. Navigate to `/assistants/start-praktikum`
2. Select Kelas: "A"
3. Select Modul: "Modul 1"
4. Select DK: "DK1"
5. Click "Start" button (play icon)

**Expected:**
- API: `PUT /api-v1/praktikum/{id}` with `{action: "start"}`
- Status changes from "idle" to "running"
- Current phase: "preparation"
- `started_at` timestamp recorded
- `phase_started_at` timestamp recorded
- Timer starts counting
- WebSocket event: `PraktikumStatusUpdated` broadcasted
- Success toast: "Praktikum dimulai"

#### 1.2 Verify All 25 Praktikan Can See Active Session
**Steps:**
1. Each of 25 praktikan logs in
2. Navigate to praktikum page
3. Check if modul 1 is accessible

**Expected:**
- All 25 users see modul 1 as active
- Can access `/praktikan/praktikum/modul/1`
- No errors or access denied
- Presence tracking shows 25 online users

---

### 2. TA Phase - TesAwal.jsx UI Testing

#### 2.1 Asisten Advances to TA Phase
**Preconditions:** Praktikum running in preparation phase

**Steps:**
1. Asisten clicks "Next" button in `ContentPraktikum.jsx`
2. Observe phase transition

**Expected:**
- API: `PUT /api-v1/praktikum/{id}` with `{action: "next", phase: "ta"}`
- Current phase updates to "ta"
- `phase_started_at` resets to current timestamp
- `phase_elapsed_seconds` resets to 0
- WebSocket event: `PraktikumProgressUpdated` broadcasted
- All praktikan interfaces update to show TA section

#### 2.2 Praktikan Loads TesAwal Component
**Steps:**
1. Praktikan #1 navigates to modul 1
2. Current phase is "ta"
3. `TesAwal.jsx` renders

**Expected:**
- Component receives `questions` prop with 10 items
- Each question has `{id, text, options: [{id, text}]}`
- Header displays: "Tes Awal"
- 10 question cards rendered
- Question numbers: 1-10 in blue circular badges
- Each question shows 4 options labeled A, B, C, D
- Options are clickable radio buttons
- No options selected initially (unless previously saved)
- Scrollable container with max-height 90vh
- Loading state shows: "Memuat soal tes awal..."

#### 2.3 Praktikan Selects Answers in TesAwal
**Steps:**
1. Click option B for question 1
2. Click option A for question 2
3. Click option C for question 3
4. Continue selecting through question 10

**Expected:**
- Clicked option highlights with primary color
- Option background: `bg-[var(--depth-color-primary)]/15`
- Option border: `border-[var(--depth-color-primary)]`
- Selected badge shows white text on primary background
- Scale animation: `scale-[1.02]`
- Previous selection deselected (radio behavior)
- `answers` array updates: `[optionId_1, optionId_2, optionId_3, ...]`
- Smooth transition: `transition-all duration-200`
- Hover effects work on unselected options

#### 2.4 UI Performance with 10 Questions
**Steps:**
1. Scroll through all 10 questions
2. Rapidly select options (spam clicking)
3. Monitor rendering performance

**Expected:**
- Smooth scrolling (no jank)
- Option selection instant feedback (< 100ms)
- No layout shifts during selection
- No memory leaks
- Hover effects smooth
- Question cards properly spaced (space-y-8)

#### 2.5 TesAwal Component Edge Cases
**Steps:**
1. Test with `isLoading={true}`
2. Test with `errorMessage="Test error"`
3. Test with `questions={[]}`
4. Test with malformed question data

**Expected:**
- Loading: Shows "Memuat soal tes awal..."
- Error: Shows red error message text
- Empty: Shows "Belum ada soal tes awal untuk modul ini."
- Malformed: Gracefully handles missing fields, no crash

---

### 3. TA Phase - 20+ Concurrent Submissions

#### 3.1 Single Praktikan Submits TA Answers (Baseline)
**Steps:**
1. Praktikan #1 selects answers in `TesAwal.jsx`
2. Parent component calls `onSubmitTask("TesAwal", answers)`
3. API submission triggered

**Expected:**
- `answers` array contains 10 option IDs
- API: `POST /jawaban-ta` with:
  ```json
  {
    "praktikan_id": 1,
    "modul_id": 1,
    "answers": [
      {"soal_id": 1, "opsi_id": 2},
      {"soal_id": 2, "opsi_id": 5},
      ...
    ]
  }
  ```
- DB Transaction:
  1. `DELETE FROM jawaban_tas WHERE praktikan_id=1 AND modul_id=1`
  2. `INSERT INTO jawaban_tas` for each answer
- Auto-scoring calculated: `(correct / total) * 100`
- Response: `{status: "success", nilai_ta: 80}`
- Success toast shown
- `TesAwal.jsx` UI remains stable
- Progress updated in asisten view

#### 3.2 5 Concurrent Praktikan Submit TA (Low Load)
**Steps:**
1. Praktikan #1-5 all select answers in their `TesAwal.jsx` instances
2. All click submit within 1 second window
3. 5 concurrent API calls to `POST /jawaban-ta`

**Expected:**
- All 5 submissions succeed
- Each praktikan receives their own score
- No database deadlocks
- No duplicate submissions
- No lost answers
- All 5 progress updates appear in asisten view
- Response time < 2 seconds per request
- All 5 `TesAwal.jsx` components show success state

#### 3.3 15 Concurrent Praktikan Submit TA (Medium Load)
**Steps:**
1. Praktikan #1-15 simultaneously submit TA answers within 2-second window

**Expected:**
- All 15 submissions succeed
- No failed transactions
- No "database is locked" errors
- No "transaction timeout" errors
- Scores calculated correctly for all
- Progress table shows all 15 completions
- Response time < 3 seconds per request
- All `TesAwal.jsx` instances handle success/error appropriately

#### 3.4 25 Concurrent Praktikan Submit TA (HIGH LOAD - Critical Test)
**Steps:**
1. All 25 praktikan simultaneously:
   - Have answers selected in `TesAwal.jsx`
   - Submit answers within 3-second window
2. Monitor asisten progress table
3. Monitor server logs
4. Monitor database connections
5. Monitor UI responsiveness

**Expected:**
✅ **Success Criteria:**
- All 25 submissions accepted
- Each praktikan gets unique score based on their answers
- No database deadlock errors
- No lost transactions
- No duplicate jawaban records
- All 25 appear in progress table
- Response time < 5 seconds per request
- Database connections < max_connections limit
- No memory leaks
- All 25 `TesAwal.jsx` components receive success/error feedback

❌ **Known Failure Modes to Test:**
- Some praktikan receive 500 error
- Transaction timeout: "Lock wait timeout exceeded"
- Deadlock: "Deadlock found when trying to get lock"
- Duplicate key violation (if submission retried)
- Score calculation returns NULL or 0 incorrectly
- Progress not updating for some users
- UI freezes or becomes unresponsive
- Toast notifications fail to show

#### 3.5 Verify Asisten Can See All 25 TA Submissions
**Steps:**
1. Asisten views TablePraktikanProgress
2. Check TA column for all 25 praktikan
3. Verify scores displayed

**Expected:**
- All 25 rows show TA completion
- Scores displayed (0-100)
- Correct/incorrect count visible
- Can click to view individual answers
- Real-time updates via WebSocket

#### 3.6 Re-submission Handling (TA)
**Steps:**
1. Praktikan #1 submits TA with initial answers
2. Changes answers in `TesAwal.jsx`
3. Submits again

**Expected:**
- Old answers deleted
- New answers inserted
- New score calculated
- No orphaned records
- Progress updates
- `TesAwal.jsx` shows updated state

---

### 4. Skip Jurnal Phase (Quick Next)

#### 4.1 Asisten Immediately Skips Jurnal
**Preconditions:** TA phase just completed

**Steps:**
1. Asisten clicks "Next" button (no waiting)
2. Observe transition

**Expected:**
- Phase changes: "ta" → "fitb_jurnal"
- Phase timer resets
- WebSocket event broadcasted
- Praktikan interfaces update
- **NOTE:** Praktikan don't interact with jurnal in this test
- No `TesAwal.jsx` or `TesKeterampilan.jsx` shown

#### 4.2 Asisten Immediately Skips Jurnal Again
**Steps:**
1. Wait 2 seconds
2. Asisten clicks "Next" button again

**Expected:**
- Phase changes: "fitb_jurnal" → "mandiri"
- Quick transition (< 500ms)
- No errors
- Timer continues

---

### 5. Skip Mandiri Phase (Quick Next)

#### 5.1 Asisten Immediately Skips Mandiri
**Steps:**
1. Asisten clicks "Next" button (no waiting)
2. Observe transition

**Expected:**
- Phase changes: "mandiri" → "tk"
- TK section becomes active for praktikan
- **NOTE:** Praktikan don't submit anything for mandiri

---

### 6. TK Phase - TesKeterampilan.jsx UI Testing

#### 6.1 Asisten in TK Phase
**Preconditions:** Just entered TK phase from mandiri

**Steps:**
1. Verify current phase is "tk"
2. Check praktikan interfaces

**Expected:**
- All 25 praktikan see TK questions
- `TesKeterampilan.jsx` component renders
- Header displays: "Tes Keterampilan"
- 10 question cards visible
- Question numbers: 1-10 in blue circular badges
- Each question shows 4 options labeled A, B, C, D
- Can select answers
- Submit button enabled (in parent)

#### 6.2 Praktikan Loads TesKeterampilan Component
**Steps:**
1. Praktikan #1 views TK section
2. `TesKeterampilan.jsx` renders

**Expected:**
- Component receives `questions` prop with 10 items
- Header: "Tes Keterampilan"
- Identical UI structure to `TesAwal.jsx`
- Different radio button names: `tes-keterampilan-${question.id}`
- Same styling and behavior
- Scrollable container
- Loading state shows: "Memuat soal tes keterampilan..."

#### 6.3 Praktikan Selects Answers in TesKeterampilan
**Steps:**
1. Click option A for question 1
2. Click option D for question 2
3. Continue through all 10 questions

**Expected:**
- Selected options highlight with primary color
- Same visual feedback as TesAwal
- Scale animation on selection
- Smooth transitions
- `answers` array updates correctly
- Hover effects work

#### 6.4 UI Performance Comparison (TA vs TK)
**Steps:**
1. Compare rendering performance between TesAwal and TesKeterampilan
2. Test with same 10 questions

**Expected:**
- Both components perform identically
- No performance degradation
- Consistent user experience
- Same transition speeds

---

### 7. TK Phase - 20+ Concurrent Submissions (Critical)

#### 7.1 5 Concurrent Praktikan Submit TK (Low Load)
**Steps:**
1. Praktikan #1-5 select answers in `TesKeterampilan.jsx`
2. Submit simultaneously

**Expected:**
- All 5 succeed
- Scores calculated
- No deadlocks
- Response time < 2 seconds
- All `TesKeterampilan.jsx` instances show success

#### 7.2 15 Concurrent Praktikan Submit TK (Medium Load)
**Steps:**
1. Praktikan #1-15 submit TK answers simultaneously

**Expected:**
- All 15 succeed
- Correct scoring for each
- No transaction errors
- Response time < 3 seconds
- UI remains responsive

#### 7.3 25 Concurrent Praktikan Submit TK (HIGH LOAD - Critical Test)
**Steps:**
1. All 25 praktikan submit TK answers within 3-second window
2. Monitor for failures
3. Monitor UI responsiveness

**Expected:**
✅ **Success Criteria:**
- All 25 submissions succeed
- API: `POST /jawaban-tk` for each
- DB Transaction for each:
  1. `DELETE FROM jawaban_tks WHERE praktikan_id={id} AND modul_id=1`
  2. `INSERT INTO jawaban_tks` for each answer
- Auto-scoring: `(correct / total) * 100`
- All scores returned correctly
- Progress table updates for all 25
- Response time < 5 seconds
- No database errors
- All 25 `TesKeterampilan.jsx` instances handle response correctly

❌ **Known Failure Modes:**
- "Too many connections" error
- Transaction deadlock
- Score calculation failure
- Lost submissions
- Duplicate records
- Timeout errors
- UI freezes or crashes
- Toast notifications don't show

#### 7.4 Verify All 25 TK Scores in Asisten View
**Steps:**
1. Asisten checks TablePraktikanProgress
2. Verify TK column for all praktikan
3. Check individual answer details

**Expected:**
- All 25 rows show TK completion
- Scores visible (0-100)
- Can click to see individual TK answers
- Real-time sync via WebSocket

#### 7.5 TK Re-submission Under Load
**Steps:**
1. 10 praktikan re-submit TK with different answers
2. While 10 new praktikan submit first time
3. Total: 20 concurrent TK operations

**Expected:**
- All 20 operations succeed
- Old answers properly deleted
- New answers inserted
- No data corruption
- Scores recalculated correctly
- All `TesKeterampilan.jsx` instances update correctly

---

### 8. UI Component Stress Testing

#### 8.1 Rapid Answer Selection (TA)
**Steps:**
1. In `TesAwal.jsx`, rapidly click between options
2. Click A, then B, then C, then D repeatedly for same question
3. Do this for all 10 questions quickly

**Expected:**
- UI remains responsive
- Only latest selection persists
- No duplicate selections
- No visual glitches
- Transitions remain smooth
- No memory leaks

#### 8.2 Rapid Answer Selection (TK)
**Steps:**
1. Same test in `TesKeterampilan.jsx`
2. Spam click options rapidly

**Expected:**
- Same stable behavior as TesAwal
- No performance degradation
- Selections handled correctly

#### 8.3 Scroll Performance Under Load
**Steps:**
1. Open `TesAwal.jsx` with 10 questions
2. Rapidly scroll up and down
3. While selecting options
4. With 25 concurrent users doing same

**Expected:**
- Smooth scrolling (60fps)
- No jank or stutter
- Question cards render correctly
- Shadows and borders render properly
- No layout shifts

#### 8.4 Comment Input Performance (if enabled)
**Steps:**
1. Enable `isCommentEnabled={true}`
2. Test `QuestionCommentInput` component
3. Add comments to multiple questions

**Expected:**
- Comment inputs render without lag
- Typing is responsive
- Comments save without blocking UI
- No impact on answer selection
- Works with 25 concurrent users

---

### 9. Progress Tracking & Real-time Updates

#### 9.1 Progress Polling During High Load
**Preconditions:** 25 praktikan actively submitting

**Steps:**
1. Asisten view polls: `GET /api-v1/praktikum/{id}/progress` every 10 seconds
2. During TA submissions (25 concurrent)
3. During TK submissions (25 concurrent)

**Expected:**
- Progress API returns within 2 seconds
- Shows accurate completion counts
- No timeout errors
- No stale data
- WebSocket events update immediately

#### 9.2 WebSocket Event Broadcasting
**Steps:**
1. Monitor WebSocket channel during concurrent submissions
2. Check for event delays

**Expected:**
- `PraktikumProgressUpdated` events broadcasted
- Event contains: praktikum_id, phase, completion_count
- Delay < 1 second from submission to broadcast
- All connected clients receive events
- No dropped events

---

### 10. Component Error Handling

#### 10.1 TesAwal Error States
**Steps:**
1. Test `TesAwal.jsx` with `isLoading={true}`
2. Test with `errorMessage="Failed to load questions"`
3. Test with `questions={[]}`
4. Test with malformed questions

**Expected:**
- Loading: Centered message "Memuat soal tes awal..."
- Error: Red text showing error message
- Empty: "Belum ada soal tes awal untuk modul ini."
- Malformed: No crash, graceful degradation

#### 10.2 TesKeterampilan Error States
**Steps:**
1. Test `TesKeterampilan.jsx` with same error scenarios

**Expected:**
- Loading: "Memuat soal tes keterampilan..."
- Error: Red error message displayed
- Empty: "Belum ada soal tes keterampilan untuk modul ini."
- Same graceful handling as TesAwal

#### 10.3 Network Error During Submission
**Steps:**
1. Praktikan selects answers
2. Simulate network failure during submit
3. Check UI response

**Expected:**
- Error toast or message shown
- Can retry submission
- Answers preserved in state
- UI doesn't freeze
- Clear error feedback

---

### 11. Concurrent Failures & Recovery

#### 11.1 Simulated Database Deadlock
**Steps:**
1. Force deadlock scenario:
   - Praktikan #1 submits TA
   - Praktikan #2 submits TA at exact same microsecond
   - Both target same modul_id

**Expected:**
- One transaction succeeds
- Other transaction retries (if retry logic exists) OR
- Returns error: "Deadlock detected, please retry"
- Praktikan can resubmit
- No data corruption
- `TesAwal.jsx` shows appropriate error

#### 11.2 Transaction Timeout Recovery
**Steps:**
1. Set low transaction timeout (5 seconds)
2. Submit 25 concurrent TA answers
3. Some will timeout

**Expected:**
- Timed-out requests return 500 error with message
- Praktikan see error toast
- Can retry submission
- Completed transactions not rolled back
- Database remains consistent
- UI doesn't break

#### 11.3 Connection Pool Exhaustion
**Steps:**
1. Configure max_connections = 50
2. 25 praktikan submit TA simultaneously
3. Monitor connection count

**Expected:**
- Connection pool manages connections efficiently
- Requests queued if pool full
- No "Too many connections" error
- All requests eventually processed
- Connections released after transaction

---

### 12. Data Integrity & Validation

#### 12.1 Verify No Duplicate Answers
**Steps:**
1. After 25 concurrent TA submissions
2. Query database:
   ```sql
   SELECT praktikan_id, soal_id, COUNT(*) 
   FROM jawaban_tas 
   WHERE modul_id = 1 
   GROUP BY praktikan_id, soal_id 
   HAVING COUNT(*) > 1
   ```

**Expected:**
- Zero duplicate records
- Each praktikan has exactly 1 answer per soal
- No orphaned records

#### 12.2 Verify Score Calculation Accuracy
**Steps:**
1. For praktikan #1 who submitted TA:
2. Manually count correct answers
3. Compare with stored score

**Expected:**
- Score matches: `(correct / total) * 100`
- Rounding handled correctly
- No null scores
- No negative scores

#### 12.3 Verify Transaction Atomicity
**Steps:**
1. Praktikan submits 10 TA answers
2. Transaction fails on answer #7 (simulated)

**Expected:**
- All 10 answers rolled back (none saved) OR
- All 10 answers committed (if transaction succeeded)
- No partial state (6 answers saved, 4 missing)

---

### 13. Performance Benchmarks

#### 13.1 Response Time Under Load
**Metrics to Measure:**

| Concurrent Users | TA Submission Avg | TK Submission Avg | Max Response Time | Failure Rate | UI Responsive |
|------------------|-------------------|-------------------|-------------------|--------------|---------------|
| 5 users          | < 1s              | < 1s              | < 2s              | 0%           | Yes           |
| 15 users         | < 2s              | < 2s              | < 3s              | < 1%         | Yes           |
| 25 users         | < 3s              | < 3s              | < 5s              | < 5%         | Yes           |

**Critical Thresholds:**
- ✅ Acceptable: < 5s response time, < 5% failure rate, UI responsive
- ⚠️ Warning: 5-10s response time, 5-10% failure rate, UI sluggish
- ❌ Unacceptable: > 10s response time, > 10% failure rate, UI frozen

#### 13.2 UI Rendering Performance
**Steps:**
1. Measure component render time
2. `TesAwal.jsx` with 10 questions
3. `TesKeterampilan.jsx` with 10 questions

**Expected:**
- Initial render < 200ms
- Re-render on answer selection < 50ms
- Scroll at 60fps
- No jank during interaction
- Memory usage < 100MB per tab

#### 13.3 Database Query Performance
**Steps:**
1. Enable query logging
2. Run 25 concurrent submissions
3. Analyze slow queries

**Expected:**
- No queries > 1 second
- Proper indexes used (praktikan_id, modul_id, soal_id)
- No full table scans
- Transaction commit time < 500ms

#### 13.4 Memory Usage
**Steps:**
1. Monitor Laravel memory usage
2. During 25 concurrent TA submissions
3. During 25 concurrent TK submissions

**Expected:**
- Memory usage < 512MB
- No memory leaks
- Garbage collection working
- No out-of-memory errors

---

### 14. Edge Cases & Error Handling

#### 14.1 Submit Before Phase Active
**Steps:**
1. Praktikan tries to submit TA while phase is "preparation"

**Expected:**
- Error: "TA not yet active"
- Submission rejected
- Clear error message
- `TesAwal.jsx` shows error state

#### 14.2 Submit After Phase Ended
**Steps:**
1. Asisten moves to TK phase
2. Praktikan tries to submit TA (previous phase)

**Expected:**
- Submission accepted (allow late submission) OR
- Error: "TA phase has ended"
- Consistent with business rules
- Clear feedback in UI

#### 14.3 Invalid Answer Data
**Steps:**
1. Praktikan submits TA with:
   - soal_id that doesn't exist
   - opsi_id that doesn't belong to soal
   - modul_id mismatch

**Expected:**
- Validation errors returned
- Error: "Soal tidak valid untuk modul ini"
- Error: "Opsi tidak valid untuk soal ini"
- No database corruption
- UI shows validation errors

#### 14.4 Empty Answer Submission
**Steps:**
1. Praktikan submits TA with empty answers array

**Expected:**
- Accepted (clears previous answers) OR
- Error: "Minimal 1 jawaban diperlukan"
- Score set to 0 if accepted
- Clear user feedback

---

### 15. Asisten Complete Praktikum Flow

#### 15.1 Advance Through All Phases
**Complete Flow:**
1. Start → preparation (2 min)
2. Next → TA (25 users see `TesAwal.jsx`, submit, 5 min)
3. Next → fitb_jurnal (skip immediately)
4. Next → mandiri (skip immediately)
5. Next → TK (25 users see `TesKeterampilan.jsx`, submit, 5 min)
6. Next → feedback (1 min)
7. Exit → praktikum stopped

**Expected:**
- Total duration: ~13 minutes
- All phases completed
- No errors during transitions
- All 25 praktikan progress tracked
- Both `TesAwal.jsx` and `TesKeterampilan.jsx` work correctly
- Report can be submitted
- Session ends cleanly

#### 15.2 Exit Praktikum
**Steps:**
1. Asisten clicks "Exit" button (X icon)
2. Confirm exit

**Expected:**
- API: `PUT /api-v1/praktikum/{id}` with `{action: "exit"}`
- Status: "running" → "exited"
- `ended_at` timestamp recorded
- Timer stops
- WebSocket: `PraktikumStatusUpdated`
- All praktikan lose access to active session
- `TesAwal.jsx` and `TesKeterampilan.jsx` become inaccessible

---

## Success Criteria

### Must Pass (Critical)
✅ All 25 praktikan can submit TA concurrently (< 5% failure rate)  
✅ All 25 praktikan can submit TK concurrently (< 5% failure rate)  
✅ `TesAwal.jsx` renders correctly for all 25 users simultaneously  
✅ `TesKeterampilan.jsx` renders correctly for all 25 users simultaneously  
✅ No database deadlocks during concurrent submissions  
✅ No data corruption or duplicate records  
✅ Score calculation accurate for all users  
✅ Response time < 5 seconds for 25 concurrent requests  
✅ UI remains responsive during concurrent load  
✅ Progress tracking updates correctly for all users  
✅ WebSocket events broadcast within 1 second  
✅ Transaction atomicity maintained  
✅ Both components handle error states gracefully  

### Should Pass (Important)
✅ Response time < 3 seconds for 25 concurrent requests  
✅ No memory leaks during extended session  
✅ Connection pool manages 25 concurrent connections efficiently  
✅ Query performance optimized (< 1s per query)  
✅ UI renders at 60fps during interaction  
✅ Retry logic handles transient failures  
✅ Comment functionality works under load (if enabled)  

### Nice to Have
✅ Graceful degradation under extreme load (50+ users)  
✅ Automatic retry on deadlock  
✅ Progress caching to reduce database load  
✅ Real-time feedback on submission status  
✅ Optimistic UI updates before server response  

---

## Known Issues to Document

1. **Database Deadlocks**: Occur when 20+ users submit simultaneously
   - **Workaround**: Implement retry logic with exponential backoff
   - **Fix**: Optimize transaction isolation level or use queue

2. **Score Calculation Timeouts**: Under high load, scoring may timeout
   - **Workaround**: Calculate async with job queue
   - **Fix**: Optimize scoring query with proper indexes

3. **WebSocket Event Delays**: Events may lag by 2-3 seconds with 25+ users
   - **Workaround**: Increase WebSocket server capacity
   - **Fix**: Use Redis pub/sub for better scalability

4. **Connection Pool Exhaustion**: Default pool size insufficient for 25+ concurrent
   - **Workaround**: Increase max_connections in database config
   - **Fix**: Implement connection pooling middleware

5. **UI Rendering Delays**: `TesAwal.jsx` and `TesKeterampilan.jsx` may lag with 10+ questions
   - **Workaround**: Implement virtualized scrolling
   - **Fix**: Optimize React rendering with memo/useMemo

6. **Toast Notification Overload**: 25 concurrent toasts may overwhelm UI
   - **Workaround**: Queue or batch notifications
   - **Fix**: Implement notification debouncing

---

## Component Props Reference

### TesAwal.jsx
```jsx
<TesAwal
  isLoading={boolean}          // Show loading state
  errorMessage={string|null}   // Show error message
  questions={array}            // [{id, text, options: [{id, text}]}]
  answers={array}              // [opsi_id_1, opsi_id_2, ...]
  setAnswers={function}        // Updates answers array
  setQuestionsCount={function} // Sets question count in parent
  onSubmitTask={function}      // Callback: (taskName, answers) => {}
  tipeSoal={string|null}       // Question type for comments
  praktikanId={number|null}    // User ID for comments
  isCommentEnabled={boolean}   // Show/hide comment inputs
/>
```

### TesKeterampilan.jsx
```jsx
<TesKeterampilan
  isLoading={boolean}          // Show loading state
  errorMessage={string|null}   // Show error message
  questions={array}            // [{id, text, options: [{id, text}]}]
  answers={array}              // [opsi_id_1, opsi_id_2, ...]
  setAnswers={function}        // Updates answers array
  setQuestionsCount={function} // Sets question count in parent
  onSubmitTask={function}      // Callback: (taskName, answers) => {}
  tipeSoal={string|null}       // Question type for comments
  praktikanId={number|null}    // User ID for comments
  isCommentEnabled={boolean}   // Show/hide comment inputs
/>
```

---

**Seed File:** `tests/seed-praktikum-ta-tk-concurrent.spec.ts`  
**Load Testing Tool:** k6, Artillery, or Playwright with parallel workers  
**Monitoring:** Database query logs, Laravel Telescope, WebSocket connection logs, React DevTools Profiler  
**Backend**: JawabanTAController, JawabanTKController, PraktikumController  
**Frontend**: TesAwal.jsx, TesKeterampilan.jsx, ContentPraktikum, TablePraktikanProgress, QuestionCommentInput  
**Database**: Transactions on jawaban_tas, jawaban_tks tables
