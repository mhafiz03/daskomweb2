# Praktikan Praktikum Session - Comprehensive Test Plan

## Overview

This test plan covers the complete **Praktikan Praktikum Session Flow** where a praktikan participates in a praktikum session that progresses through multiple phases. The session is controlled by an asisten who manages phase transitions, and the praktikan completes various tasks (Tes Awal, Jurnal, Mandiri, Tes Keterampilan) before providing feedback.

## Application Flow Context

### Praktikum Session Phases

The praktikum session progresses through these phases in sequence:

1. **Preparation** - Pre-session setup phase
2. **TA (Tes Awal)** - Initial test with multiple choice questions
3. **Jurnal** - Journal/essay questions (may include FITB - Fill In The Blank)
4. **Mandiri** - Independent work/essay questions
5. **TK (Tes Keterampilan)** - Skills test with multiple choice questions
6. **Feedback** - Final feedback submission phase

### Key Features

- **Real-time Phase Synchronization**: Praktikan's view updates automatically when asisten changes phases via WebSocket (Laravel Echo/Pusher)
- **Autosave**: Answers are automatically saved as praktikan types (600ms debounce)
- **Score Display**: Automatic score modal appears after submitting TA and TK (multiple choice phases)
- **Answer Persistence**: Previously submitted answers can be viewed and edited
- **File Upload**: Some questions support file attachments
- **Session Monitoring**: Praktikan sees current phase, elapsed time, and progress indicators

### Component Mapping

- **NoPraktikumSection**: Displayed when no active praktikum session exists
- **TesAwal**: TA phase component (multiple choice)
- **Jurnal**: Jurnal phase component (essay, possibly FITB)
- **Mandiri**: Mandiri phase component (essay, no previous answers)
- **TesKeterampilan**: TK phase component (multiple choice)
- **FeedbackPhase**: Feedback phase component (text area for feedback)

---

## Test Scenarios

### 1. Initial State - No Active Praktikum

**Seed:** `tests/seed.spec.ts`

#### 1.1 View Praktikum Page Without Active Session
**Steps:**
1. Login as praktikan
2. Navigate to Praktikum page (`/praktikan/praktikum`)
3. Observe page content

**Expected Results:**
- NoPraktikumSection component is displayed
- Message indicates no active praktikum session
- No task components are visible
- Page shows waiting state or instructions
- Navigation sidebar remains functional

#### 1.2 Wait for Asisten to Start Session
**Steps:**
1. Login as praktikan
2. Navigate to Praktikum page
3. Keep page open while asisten creates and starts praktikum session (simulate or test with real-time event)
4. Observe automatic update

**Expected Results:**
- Page automatically detects new session via WebSocket
- NoPraktikumSection disappears
- Preparation or first phase component loads
- No page refresh required
- Smooth transition to active state

---

### 2. Preparation Phase

**Seed:** `tests/seed.spec.ts`

#### 2.1 Enter Preparation Phase
**Steps:**
1. Login as praktikan
2. Asisten starts praktikum session for praktikan's class
3. Session begins in "preparation" phase
4. Observe praktikum page

**Expected Results:**
- Praktikum page shows preparation state
- Module information is displayed (module title, description)
- Timer shows elapsed time (starts from 00:00)
- Current phase indicator shows "Preparation"
- No questions are displayed yet
- Instructions or waiting message appears

#### 2.2 Preparation Phase Duration
**Steps:**
1. Praktikan is in preparation phase
2. Wait for 2-3 minutes
3. Observe timer and page state

**Expected Results:**
- Timer continues counting up (00:00 → 01:00 → 02:00, etc.)
- Page remains in preparation state until asisten changes phase
- No timeout or automatic progression
- WebSocket connection remains active

---

### 3. Tes Awal (TA) Phase - Multiple Choice

**Seed:** `tests/seed.spec.ts`

#### 3.1 Transition to TA Phase
**Steps:**
1. Praktikan is in preparation phase
2. Asisten advances phase to "ta"
3. Observe praktikum page automatic update

**Expected Results:**
- Page automatically transitions to TesAwal component via WebSocket
- Multiple choice questions load and display
- Current phase indicator shows "TA"
- Phase timer resets to 00:00 for TA phase
- Total session timer continues counting
- Questions are numbered and formatted correctly

#### 3.2 View TA Questions
**Steps:**
1. Praktikan is in TA phase
2. Scroll through all questions
3. Observe question structure

**Expected Results:**
- All TA questions are visible
- Each question has:
  - Question number
  - Question text
  - Multiple choice options (radio buttons)
  - No option is selected by default (unless autosaved)
- Questions can be scrolled smoothly
- Layout is responsive and readable

#### 3.3 Answer TA Questions
**Steps:**
1. Praktikan is in TA phase
2. Select answer for question #1
3. Wait 1 second
4. Select answer for question #2
5. Select answer for question #3
6. Observe autosave behavior

**Expected Results:**
- Selected option is highlighted/checked
- Autosave triggers 600ms after each selection
- No visible loading indicators for autosave (background operation)
- Previous selections persist when scrolling
- Can change selection before submitting

#### 3.4 Restore Autosaved TA Answers
**Steps:**
1. Praktikan answers 3 TA questions
2. Wait for autosave to complete (~1 second)
3. Refresh the browser page
4. Observe question state

**Expected Results:**
- Previously selected answers are restored from autosave
- All 3 answered questions show correct selections
- Unanswered questions remain blank
- No data loss occurs
- Can continue answering from where left off

#### 3.5 Submit TA Answers
**Steps:**
1. Praktikan has answered all TA questions
2. Scroll to bottom or find submit button
3. Click "Submit" button
4. Observe submission process

**Expected Results:**
- Submit button is visible and enabled
- Clicking triggers submission API call
- Loading indicator appears during submission
- Success toast notification appears
- Score modal automatically opens showing:
  - Number of correct answers
  - Total questions
  - Percentage score
  - "TA" phase type label

#### 3.6 View TA Score Modal
**Steps:**
1. Praktikan submits TA answers
2. Score modal opens automatically
3. Review score information
4. Close modal

**Expected Results:**
- Modal displays score prominently
- Correct answers count is accurate
- Percentage is calculated correctly
- Modal has clear close button or backdrop click
- Modal closes and returns to praktikum page
- Cannot re-submit TA (already submitted state)

#### 3.7 Wait in TA Phase After Submission
**Steps:**
1. Praktikan submits TA answers
2. Remain on praktikum page
3. Wait for asisten to advance phase
4. Observe current state

**Expected Results:**
- Submitted state is indicated (button disabled or message shown)
- Timer continues running
- Phase indicator still shows "TA"
- Cannot edit or re-submit answers
- Page waits for asisten to change phase

---

### 4. Jurnal Phase - Essay Questions

**Seed:** `tests/seed.spec.ts`

#### 4.1 Transition to Jurnal Phase
**Steps:**
1. Praktikan has completed TA phase
2. Asisten advances phase to "fitb_jurnal"
3. Observe praktikum page automatic update

**Expected Results:**
- Page automatically transitions to Jurnal component via WebSocket
- Essay questions load and display
- Current phase indicator shows "Jurnal"
- Phase timer resets to 00:00 for Jurnal phase
- Total session timer continues
- Previous TA submission status is preserved

#### 4.2 View Jurnal Questions
**Steps:**
1. Praktikan is in Jurnal phase
2. Scroll through all questions
3. Observe question structure

**Expected Results:**
- All Jurnal questions are visible
- Each question has:
  - Question number
  - Question text/prompt
  - Text area for essay answer
  - File upload option (if enabled for question)
- Text areas are empty by default (unless autosaved)
- Layout accommodates longer text responses

#### 4.3 Answer Jurnal Essay Questions
**Steps:**
1. Praktikan is in Jurnal phase
2. Click in text area for question #1
3. Type essay answer (at least 2 sentences)
4. Wait 1 second
5. Click in text area for question #2
6. Type essay answer
7. Observe autosave behavior

**Expected Results:**
- Text areas accept input without lag
- Autosave triggers 600ms after stopping typing
- No visible autosave indicators
- Can continue typing while autosave occurs
- Text persists when switching between questions

#### 4.4 Upload File for Jurnal Question
**Steps:**
1. Praktikan is in Jurnal phase
2. Find question with file upload enabled
3. Click file upload button/area
4. Select a valid file (PDF, image, etc.)
5. Observe upload process

**Expected Results:**
- File picker opens with appropriate file type filters
- Selected file name appears after selection
- File uploads successfully
- Upload progress indicator appears (if implemented)
- Success confirmation after upload
- Can replace file if needed

#### 4.5 Restore Autosaved Jurnal Answers
**Steps:**
1. Praktikan types answers for 2 Jurnal questions
2. Wait for autosave to complete
3. Refresh browser page
4. Observe question state

**Expected Results:**
- Previously typed essay answers are restored
- Text appears in correct text areas
- Uploaded files remain attached
- Cursor position resets but content persists
- Can continue editing from where left off

#### 4.6 Submit Jurnal Answers
**Steps:**
1. Praktikan has answered all Jurnal questions
2. Scroll to bottom
3. Click "Submit" button
4. Observe submission process

**Expected Results:**
- Submit button is enabled
- Submission API call is triggered
- Loading indicator appears
- Success toast notification
- No score modal (essay questions are not auto-graded)
- Submitted state is indicated
- Cannot edit or re-submit

---

### 5. Mandiri Phase - Independent Essay Questions

**Seed:** `tests/seed.spec.ts`

#### 5.1 Transition to Mandiri Phase
**Steps:**
1. Praktikan has completed Jurnal phase
2. Asisten advances phase to "mandiri"
3. Observe praktikum page automatic update

**Expected Results:**
- Page automatically transitions to Mandiri component via WebSocket
- Mandiri essay questions load
- Current phase indicator shows "Mandiri"
- Phase timer resets to 00:00
- Total session timer continues
- No previous answers are loaded (Mandiri doesn't fetch previous answers)

#### 5.2 View Mandiri Questions
**Steps:**
1. Praktikan is in Mandiri phase
2. Scroll through all questions
3. Observe question structure

**Expected Results:**
- All Mandiri questions are visible
- Each question has:
  - Question number
  - Question text/prompt
  - Text area for essay answer
  - File upload option (if enabled)
- Text areas are always empty (fresh start, no previous answers)
- Similar layout to Jurnal phase

#### 5.3 Answer Mandiri Questions
**Steps:**
1. Praktikan is in Mandiri phase
2. Type answer for question #1
3. Wait 1 second (autosave trigger)
4. Type answer for question #2
5. Observe autosave behavior

**Expected Results:**
- Text input works smoothly
- Autosave triggers 600ms after typing stops
- Answers persist in text areas
- No loading or freezing during autosave
- Can type continuously without interruption

#### 5.4 Restore Autosaved Mandiri Answers
**Steps:**
1. Praktikan types Mandiri answers
2. Wait for autosave
3. Refresh browser page
4. Observe question state

**Expected Results:**
- Autosaved answers are restored after refresh
- Text areas show previously typed content
- Can continue editing
- No data loss

#### 5.5 Submit Mandiri Answers
**Steps:**
1. Praktikan completes Mandiri questions
2. Click "Submit" button
3. Observe submission

**Expected Results:**
- Submission succeeds
- Success toast appears
- No score modal (essay questions)
- Submitted state is indicated
- Cannot re-submit

---

### 6. Tes Keterampilan (TK) Phase - Skills Test

**Seed:** `tests/seed.spec.ts`

#### 6.1 Transition to TK Phase
**Steps:**
1. Praktikan has completed Mandiri phase
2. Asisten advances phase to "tk"
3. Observe praktikum page automatic update

**Expected Results:**
- Page transitions to TesKeterampilan component via WebSocket
- TK multiple choice questions load
- Current phase indicator shows "TK"
- Phase timer resets to 00:00
- Total session timer continues

#### 6.2 View TK Questions
**Steps:**
1. Praktikan is in TK phase
2. Scroll through all questions
3. Observe question structure

**Expected Results:**
- All TK questions are visible
- Each question has:
  - Question number
  - Question text
  - Multiple choice options (radio buttons)
  - No default selection (unless autosaved)
- Similar to TA phase structure

#### 6.3 Answer TK Questions
**Steps:**
1. Praktikan is in TK phase
2. Select answer for question #1
3. Select answer for question #2
4. Select answer for question #3
5. Observe autosave behavior

**Expected Results:**
- Selections are highlighted
- Autosave triggers 600ms after each selection
- Previous selections persist
- Can change answers before submitting

#### 6.4 Restore Autosaved TK Answers
**Steps:**
1. Praktikan answers TK questions
2. Wait for autosave
3. Refresh browser page
4. Observe question state

**Expected Results:**
- Autosaved selections are restored
- All answered questions show correct selections
- Unanswered questions remain blank
- Can continue from where left off

#### 6.5 Submit TK Answers
**Steps:**
1. Praktikan completes TK questions
2. Click "Submit" button
3. Observe submission process

**Expected Results:**
- Submission triggers successfully
- Loading indicator appears
- Success toast notification
- Score modal automatically opens showing:
  - Number of correct answers
  - Total questions
  - Percentage score
  - "TK" phase type label

#### 6.6 View TK Score Modal
**Steps:**
1. Praktikan submits TK answers
2. Score modal opens
3. Review score
4. Close modal

**Expected Results:**
- Modal displays TK score
- Score calculation is accurate
- Modal can be closed
- Returns to praktikum page in submitted state

---

### 7. Feedback Phase

**Seed:** `tests/seed.spec.ts`

#### 7.1 Transition to Feedback Phase
**Steps:**
1. Praktikan has completed TK phase
2. Asisten advances phase to "feedback"
3. Observe praktikum page automatic update

**Expected Results:**
- Page transitions to FeedbackPhase component via WebSocket
- Feedback form is displayed
- Current phase indicator shows "Feedback"
- Phase timer resets to 00:00
- Total session timer continues

#### 7.2 View Feedback Form
**Steps:**
1. Praktikan is in Feedback phase
2. Observe feedback form structure

**Expected Results:**
- Feedback form is visible with:
  - Module information (title, description)
  - Asisten information (name, photo)
  - Text area for feedback
  - Submit button
- Text area is empty by default (unless previously submitted)
- Clear instructions for feedback

#### 7.3 Submit Feedback
**Steps:**
1. Praktikan is in Feedback phase
2. Click in feedback text area
3. Type feedback message (e.g., "Great session, learned a lot!")
4. Click "Submit Feedback" button
5. Observe submission

**Expected Results:**
- Text area accepts input
- Submit button is enabled
- Submission triggers successfully
- Success toast notification appears
- Feedback is saved to database
- Submitted state is indicated

#### 7.4 Feedback Already Submitted State
**Steps:**
1. Praktikan has submitted feedback
2. Remain in Feedback phase
3. Observe page state

**Expected Results:**
- Cannot edit or re-submit feedback
- Previous feedback text is displayed (read-only)
- Confirmation message shows feedback was submitted
- Can view but not modify

#### 7.5 Wait for Session Completion
**Steps:**
1. Praktikan has submitted feedback
2. Wait for asisten to finish praktikum session
3. Observe final state

**Expected Results:**
- Session remains active until asisten finishes
- Timer continues running
- Feedback submission status persists
- Page awaits session completion

---

### 8. Session Completion

**Seed:** `tests/seed.spec.ts`

#### 8.1 Session Finished by Asisten
**Steps:**
1. Praktikan has completed all phases and submitted feedback
2. Asisten finishes the praktikum session
3. Observe praktikum page update

**Expected Results:**
- Page detects session completion via WebSocket
- Session status changes to "completed" or "exited"
- Timer stops
- Completion message is displayed
- Can review final scores and submissions (if implemented)
- Cannot make further changes

#### 8.2 View Completed Session Summary
**Steps:**
1. Praktikum session is completed
2. Observe page content
3. Review session summary

**Expected Results:**
- Summary shows:
  - Module name
  - Total session duration
  - All phase durations
  - Submission status for each phase
  - Scores (TA and TK)
  - Feedback submission status
- All data is read-only
- No edit or submit buttons available

---

### 9. Phase Change Edge Cases

**Seed:** `tests/seed.spec.ts`

#### 9.1 Rapid Phase Changes
**Steps:**
1. Praktikan is in TA phase
2. Asisten rapidly changes phase: TA → Jurnal → Mandiri
3. Observe praktikum page behavior

**Expected Results:**
- Page updates smoothly for each phase change
- No race conditions or stuck states
- Final phase (Mandiri) is correctly displayed
- WebSocket events are processed in order
- No JavaScript errors

#### 9.2 Phase Change While Typing Answer
**Steps:**
1. Praktikan is in Jurnal phase
2. Start typing answer in text area
3. While typing, asisten changes phase to Mandiri
4. Observe behavior

**Expected Results:**
- Autosave completes for Jurnal before phase changes (if timing allows)
- Page transitions to Mandiri smoothly
- Jurnal answer is saved (if autosave completed)
- No data loss if autosave had time to trigger
- Mandiri phase loads correctly

#### 9.3 Phase Change During Submission
**Steps:**
1. Praktikan clicks submit button for TA
2. While submission is processing, asisten changes phase
3. Observe behavior

**Expected Results:**
- Submission completes successfully
- Score modal may or may not appear (timing dependent)
- Phase change is processed after submission
- No errors or stuck loading states
- Data integrity is maintained

#### 9.4 Backward Phase Transition
**Steps:**
1. Praktikan is in TK phase
2. Asisten changes phase backward to Jurnal (edge case / admin action)
3. Observe praktikum page behavior

**Expected Results:**
- Page transitions to Jurnal phase
- Previously submitted Jurnal answers are loaded (if applicable)
- Can view but may not be able to re-submit (depending on implementation)
- No errors occur
- System handles unexpected phase order gracefully

---

### 10. WebSocket and Real-time Features

**Seed:** `tests/seed.spec.ts`

#### 10.1 WebSocket Connection Established
**Steps:**
1. Login as praktikan
2. Navigate to praktikum page
3. Check browser console for WebSocket connection
4. Observe connection status

**Expected Results:**
- WebSocket connection to Laravel Echo/Pusher is established
- No connection errors in console
- Channel subscription succeeds (e.g., `praktikum.{id}`)
- Real-time events can be received

#### 10.2 Reconnect After Network Interruption
**Steps:**
1. Praktikan is in active praktikum session
2. Simulate network disconnection (dev tools offline mode)
3. Wait 10 seconds
4. Re-enable network
5. Observe reconnection behavior

**Expected Results:**
- WebSocket detects disconnection
- Automatic reconnection attempts occur
- Connection is re-established
- Page fetches latest session state
- No data loss
- Session continues normally

#### 10.3 Multiple Tabs with Same Praktikan
**Steps:**
1. Login as praktikan in Tab A
2. Navigate to praktikum page in Tab A
3. Open praktikum page in Tab B (same browser, same user)
4. Asisten changes phase
5. Observe both tabs

**Expected Results:**
- Both tabs receive WebSocket events
- Both tabs update to new phase simultaneously
- No conflicts or race conditions
- Autosave works independently in each tab
- Last write wins for submissions

#### 10.4 Real-time Timer Updates
**Steps:**
1. Praktikan is in active praktikum session
2. Observe timer display
3. Wait for 60 seconds
4. Observe timer accuracy

**Expected Results:**
- Timer updates every second
- Timer shows accurate elapsed time
- Phase timer and total timer both update correctly
- No freezing or skipping
- Format is readable (MM:SS or HH:MM:SS)

---

### 11. Autosave Functionality

**Seed:** `tests/seed.spec.ts`

#### 11.1 Autosave Triggers After Typing
**Steps:**
1. Praktikan is in Jurnal phase (essay questions)
2. Type answer in text area
3. Stop typing
4. Wait 600ms
5. Observe network tab for autosave API call

**Expected Results:**
- Autosave triggers 600ms after typing stops
- API POST to `/api-v1/praktikan/autosave`
- Request includes question ID and answer text
- Request completes successfully (200 response)
- No UI blocking during autosave

#### 11.2 Autosave Debouncing
**Steps:**
1. Praktikan is in Jurnal phase
2. Type continuously for 5 seconds without stopping
3. Observe network tab

**Expected Results:**
- Autosave does NOT trigger while typing continuously
- Only triggers 600ms after typing stops
- Debounce prevents excessive API calls
- Performance remains smooth

#### 11.3 Autosave Multiple Questions
**Steps:**
1. Praktikan is in Jurnal phase with 3 questions
2. Answer question #1, wait 1 second
3. Answer question #2, wait 1 second
4. Answer question #3, wait 1 second
5. Observe network tab

**Expected Results:**
- Three separate autosave API calls are made
- Each call saves correct question and answer
- No interference between autosaves
- All answers are persisted

#### 11.4 Autosave Error Handling
**Steps:**
1. Praktikan is in Jurnal phase
2. Simulate autosave API failure (network error or 500 response)
3. Type answer and trigger autosave
4. Observe behavior

**Expected Results:**
- Error is logged to console
- User is NOT interrupted (no error toast)
- Answer remains in text area
- User can continue typing
- Retry may occur on next autosave trigger

---

### 12. Score Modal Behavior

**Seed:** `tests/seed.spec.ts`

#### 12.1 Score Modal Appears After TA Submission
**Steps:**
1. Praktikan submits TA answers
2. Observe immediate behavior

**Expected Results:**
- Score modal opens automatically within 1-2 seconds
- Modal displays:
  - Phase label: "TA" or "Tes Awal"
  - Correct answers: X
  - Total questions: Y
  - Percentage: (X/Y) * 100%
- Modal backdrop prevents interaction with page behind
- Modal is centered on screen

#### 12.2 Score Modal Appears After TK Submission
**Steps:**
1. Praktikan submits TK answers
2. Observe immediate behavior

**Expected Results:**
- Score modal opens automatically
- Modal displays:
  - Phase label: "TK" or "Tes Keterampilan"
  - Correct answers count
  - Total questions
  - Percentage score
- Similar to TA score modal

#### 12.3 Close Score Modal
**Steps:**
1. Score modal is open after TA or TK submission
2. Click close button (X icon)
3. Observe behavior

**Expected Results:**
- Modal closes smoothly
- Returns to praktikum page
- Submitted state is preserved
- Can view page normally

#### 12.4 Close Score Modal by Clicking Backdrop
**Steps:**
1. Score modal is open
2. Click outside modal (on backdrop)
3. Observe behavior

**Expected Results:**
- Modal closes (if backdrop click is enabled)
- Returns to praktikum page
- No errors occur

#### 12.5 No Score Modal for Essay Questions
**Steps:**
1. Praktikan submits Jurnal answers
2. Observe behavior
3. Praktikan submits Mandiri answers
4. Observe behavior

**Expected Results:**
- No score modal appears after Jurnal submission
- No score modal appears after Mandiri submission
- Success toast appears instead
- Returns to submitted state on page

---

### 13. File Upload Functionality

**Seed:** `tests/seed.spec.ts`

#### 13.1 Upload PDF File
**Steps:**
1. Praktikan is in Jurnal phase
2. Find question with file upload enabled
3. Click upload button
4. Select PDF file (< 5MB)
5. Observe upload process

**Expected Results:**
- File picker accepts PDF files
- Upload progress indicator (if implemented)
- Success message after upload
- File name is displayed
- File is associated with question

#### 13.2 Upload Image File
**Steps:**
1. Praktikan is in Jurnal or Mandiri phase
2. Find question with file upload enabled
3. Select image file (JPG, PNG, < 5MB)
4. Observe upload

**Expected Results:**
- Image file uploads successfully
- File name appears
- Optional: Image preview is shown
- File is saved to server

#### 13.3 Upload File Too Large
**Steps:**
1. Praktikan attempts to upload file > 5MB (or size limit)
2. Select large file
3. Observe validation

**Expected Results:**
- Upload is rejected
- Error message indicates file is too large
- File size limit is displayed
- User can select different file

#### 13.4 Upload Invalid File Type
**Steps:**
1. Praktikan attempts to upload .exe or disallowed file type
2. Select invalid file
3. Observe validation

**Expected Results:**
- Upload is rejected
- Error message indicates invalid file type
- Allowed file types are listed
- User can select valid file

#### 13.5 Replace Uploaded File
**Steps:**
1. Praktikan uploads file successfully
2. Click upload button again or "replace" button
3. Select different file
4. Observe replacement

**Expected Results:**
- New file replaces old file
- Old file is removed from server (if implemented)
- New file name is displayed
- Confirmation of replacement

---

### 14. Session Monitoring and Persistence

**Seed:** `tests/seed.spec.ts`

#### 14.1 Refresh During Active Session
**Steps:**
1. Praktikan is in Jurnal phase (middle of session)
2. Has answered 2 out of 5 questions
3. Refresh browser page (F5)
4. Observe page reload behavior

**Expected Results:**
- Page reloads to Jurnal phase (same phase)
- Previously answered questions are restored from autosave
- Can continue from where left off
- Session timer continues accurately
- WebSocket reconnects automatically

#### 14.2 Close Tab and Reopen During Session
**Steps:**
1. Praktikan is in Mandiri phase
2. Close browser tab
3. Open new tab and navigate to praktikum page
4. Observe session restoration

**Expected Results:**
- Session is still active
- Page loads current phase (Mandiri)
- Autosaved answers are restored
- Timer shows correct elapsed time
- Can continue participating

#### 14.3 Long Idle Time During Session
**Steps:**
1. Praktikan is in TA phase
2. Leave page open without interaction for 15 minutes
3. Return and interact with page
4. Observe session state

**Expected Results:**
- Session remains active (unless backend timeout)
- Can continue answering questions
- WebSocket connection may reconnect
- No data loss
- Timer reflects accurate elapsed time

#### 14.4 Session State After Logout and Login
**Steps:**
1. Praktikan is in active session (Jurnal phase)
2. Logout from application
3. Login again immediately
4. Navigate to praktikum page
5. Observe session state

**Expected Results:**
- Session is still active (if not timed out)
- Page loads current phase
- Can continue session
- Autosaved data is available
- Session timer continues

---

### 15. Error Handling and Edge Cases

**Seed:** `tests/seed.spec.ts`

#### 15.1 API Error During Question Load
**Steps:**
1. Praktikan transitions to TA phase
2. Simulate API error when loading questions (500 error)
3. Observe behavior

**Expected Results:**
- Error message is displayed
- User is informed questions could not be loaded
- Option to retry loading
- No blank or broken page
- Error is logged to console

#### 15.2 API Error During Submission
**Steps:**
1. Praktikan completes TA answers
2. Simulate API error during submission (500 error)
3. Click submit button
4. Observe behavior

**Expected Results:**
- Error toast notification appears
- Submission fails gracefully
- User can retry submission
- Answers remain in form (not lost)
- Error is logged

#### 15.3 Asisten Ends Session Prematurely
**Steps:**
1. Praktikan is in middle of Jurnal phase
2. Asisten finishes/exits the praktikum session
3. Observe praktikum page behavior

**Expected Results:**
- Page detects session ended via WebSocket
- Current work is autosaved (if time allows)
- Message indicates session has ended
- Cannot submit further answers
- User is informed of early termination

#### 15.4 Phase Without Questions
**Steps:**
1. Asisten starts praktikum for module with no TA questions
2. Praktikan enters TA phase
3. Observe page behavior

**Expected Results:**
- Page handles empty question set gracefully
- Message indicates no questions available
- Option to skip or wait
- No JavaScript errors
- Can proceed to next phase (if allowed)

#### 15.5 Browser Back Button During Session
**Steps:**
1. Praktikan is in active praktikum session
2. Click browser back button
3. Observe behavior

**Expected Results:**
- Navigation is prevented OR
- User is warned about leaving session OR
- Session state is preserved and can be resumed
- No data loss
- Clear communication to user

---

### 16. Performance and UX

**Seed:** `tests/seed.spec.ts`

#### 16.1 Question Load Performance
**Steps:**
1. Praktikan enters TA phase with 20 questions
2. Measure time for questions to appear
3. Observe rendering

**Expected Results:**
- Questions load within 1-2 seconds
- No lag or freezing
- Smooth rendering
- All questions appear correctly

#### 16.2 Typing Performance in Essay Questions
**Steps:**
1. Praktikan is in Jurnal phase
2. Type rapidly in text area for 10 seconds
3. Observe responsiveness

**Expected Results:**
- No input lag
- Text appears immediately as typed
- No freezing or stuttering
- Autosave doesn't block typing

#### 16.3 Scrolling Performance with Many Questions
**Steps:**
1. Praktikan is in phase with 30+ questions
2. Scroll quickly from top to bottom
3. Observe scrolling smoothness

**Expected Results:**
- Smooth scrolling
- No janky or stuttering
- All questions render correctly
- No layout shifts

#### 16.4 Phase Transition Speed
**Steps:**
1. Praktikan is in TA phase
2. Asisten changes to Jurnal phase
3. Measure time for page to update
4. Observe transition

**Expected Results:**
- Phase change detected within 1 second
- New phase component loads within 1-2 seconds
- Smooth transition with loading indicator
- No flash of unstyled content

---

## Additional Testing Considerations

### Real-time Event Testing
- Test WebSocket event delivery timing
- Verify event payload structure
- Test concurrent users in same session
- Monitor for event duplication or loss

### Data Integrity
- Verify autosave data matches user input
- Check submission data integrity
- Validate score calculations
- Ensure file uploads are properly associated

### Security
- Test that praktikan can only access their own session
- Verify praktikan cannot change phases (only asisten can)
- Check that praktikan cannot access other praktikan's answers
- Validate file upload security (type, size restrictions)

### Accessibility
- Keyboard navigation through questions
- Screen reader compatibility
- Focus management during phase changes
- Color contrast for readability

### Mobile Testing
- Responsive layout on mobile devices
- Touch interactions for radio buttons and text areas
- File upload on mobile
- WebSocket performance on mobile networks

---

## Test Data Requirements

### User Accounts Needed

1. **Praktikan Account**
   - Valid praktikan user with kelas assignment
   - Must be enrolled in class with active praktikum

2. **Asisten Account**
   - Asisten with permission to start praktikum
   - Asisten with permission to manage phases
   - Must be assigned to same class as praktikan

### Data Setup

1. **Module with Complete Questions**
   - TA questions (multiple choice, 10-15 questions)
   - Jurnal questions (essay, 5-7 questions, some with file upload)
   - Mandiri questions (essay, 3-5 questions)
   - TK questions (multiple choice, 10-15 questions)

2. **Class with Praktikan**
   - Active class (kelas)
   - Praktikan enrolled in class
   - Asisten assigned to class

3. **WebSocket Configuration**
   - Laravel Echo properly configured
   - Pusher or other WebSocket provider running
   - Channels properly set up for praktikum events

---

## Success Criteria

### Functional Success
- ✅ All phases load correctly in sequence
- ✅ Questions display properly for each phase type
- ✅ Autosave works reliably for all question types
- ✅ Submissions succeed for all phases
- ✅ Score modals appear correctly for TA and TK
- ✅ Phase changes are synchronized in real-time
- ✅ Feedback submission completes successfully
- ✅ File uploads work for applicable questions

### Non-Functional Success
- ✅ WebSocket events are received within 1 second
- ✅ Page transitions are smooth (< 2 seconds)
- ✅ Autosave doesn't block user interaction
- ✅ No data loss during refresh or reconnection
- ✅ Performance remains good with 30+ questions
- ✅ Mobile experience is functional

### Data Integrity Success
- ✅ All answers are persisted correctly
- ✅ Scores are calculated accurately
- ✅ Session state is maintained accurately
- ✅ Timers reflect accurate elapsed time

---

## Notes for Test Implementation

1. **WebSocket Mocking**: For automated tests, mock WebSocket events or use actual WebSocket server
2. **Timing**: Some tests require waiting for autosave debounce (600ms) and API responses
3. **Cleanup**: Clear autosave data between tests to ensure clean state
4. **Asisten Actions**: Tests require coordinated actions from asisten (phase changes), consider using separate test user or API calls
5. **File Upload**: Prepare test files of various types and sizes for upload tests
6. **Real-time Verification**: Verify WebSocket event payloads match expected structure

---

**Document Version**: 1.0  
**Last Updated**: November 2024  
**Target Component**: `resources/js/Pages/Praktikan/PraktikumPage.jsx`  
**Related Components**: `TesAwal.jsx`, `Jurnal.jsx`, `Mandiri.jsx`, `TesKeterampilan.jsx`, `FeedbackPhase.jsx`, `ScoreDisplayModal.jsx`  
**Backend Dependencies**: `/api-v1/praktikum/*`, `/api-v1/soal-*`, `/api-v1/jawaban-*`, `/api-v1/praktikan/autosave`, Laravel Echo/Pusher
