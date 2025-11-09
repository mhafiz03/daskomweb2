# Asisten Input Nilai - Comprehensive Test Plan

## Overview

This test plan covers the **Asisten Nilai Praktikan (Input Nilai)** workflow where asisten can view, input, and manage praktikan scores across different modules and assessment types. The system allows asisten to grade various components (TA, Jurnal, FITB, Mandiri, TK, TP, Pelanggaran, and other score adjustments).

## Application Flow Context

### Nilai Input System

The nilai (score/grade) management system allows asisten to:

1. **Select Class and Module** - Filter praktikan by class and module
2. **View Praktikan List** - See all praktikan in selected class
3. **Input Scores** - Enter scores for various assessment types:
   - **TA** (Tes Awal) - Initial test scores
   - **Jurnal** - Journal scores
   - **FITB** (Fill in the Blank) - Fill-in-the-blank scores
   - **Mandiri** (TM) - Independent work scores
   - **TK** (Tes Keterampilan) - Skills test scores
   - **TP** (Tugas Pendahuluan) - Preliminary assignment scores
   - **Pelanggaran** - Violation deductions
   - **Other adjustments** - Additional score modifications
4. **Batch Input** - Input scores for multiple praktikan at once
5. **Save and Update** - Persist scores to database
6. **View Score History** - See previous scores and modifications

### Key Features

- **Filterable Table**: Filter by class, module, search praktikan
- **Editable Score Cells**: Click to edit, inline validation
- **Real-time Calculation**: Total scores update automatically
- **Batch Operations**: Select multiple praktikan for bulk actions
- **Score Validation**: Min/max constraints, format validation
- **Audit Trail**: Track who entered/modified scores and when

---

## Test Scenarios

### 1. Page Load and Initial State

**Seed:** `tests/seed.spec.ts`

#### 1.1 Navigate to Nilai Praktikan Page
**Steps:**
1. Login as asisten with `nilai praktikan` permission
2. Click "Nilai Praktikan" in navigation sidebar
3. Observe page load

**Expected Results:**
- Page loads at `/assistants/nilai-praktikan`
- ContentNilai component renders
- Filter dropdowns are visible (Kelas, Modul)
- Empty state or loading indicator appears
- No praktikan table visible yet (requires selection)

#### 1.2 View Filter Controls
**Steps:**
1. On Nilai Praktikan page
2. Observe available filter controls

**Expected Results:**
- Kelas (Class) dropdown is visible
- Modul (Module) dropdown is visible
- Search input box may be available
- Filter controls are clearly labeled
- All controls are enabled

---

### 2. Selecting Class and Module

**Seed:** `tests/seed.spec.ts`

#### 2.1 Load Kelas Dropdown
**Steps:**
1. On Nilai Praktikan page
2. Click Kelas dropdown
3. Observe options

**Expected Results:**
- Dropdown shows list of all classes
- Classes are listed with names (e.g., "A", "B", "C", "TOT-A1")
- Loading state if data is being fetched
- Can select a class from list

#### 2.2 Select a Kelas
**Steps:**
1. Click Kelas dropdown
2. Select "Kelas B"
3. Observe changes

**Expected Results:**
- "Kelas B" is selected and displayed
- Modul dropdown may populate with relevant modules
- Praktikan table loads for selected class
- Shows all praktikan enrolled in Kelas B

#### 2.3 Load Modul Dropdown
**Steps:**
1. With or without kelas selected
2. Click Modul dropdown
3. Observe options

**Expected Results:**
- Dropdown shows list of all modules
- Module titles are displayed (e.g., "Modul 1 - Pengenalan Dasar-Koding")
- Can select "All Modules" or specific module
- Loading state if fetching data

#### 2.4 Select a Modul
**Steps:**
1. Kelas B is selected
2. Click Modul dropdown
3. Select "Modul 2"
4. Observe changes

**Expected Results:**
- Table filters to show only scores for Modul 2
- Score columns specific to Modul 2 are displayed
- Praktikan list remains the same (from Kelas B)
- Can see which praktikan have completed Modul 2

#### 2.5 Select "All Modules"
**Steps:**
1. Kelas B is selected
2. Click Modul dropdown
3. Select "All Modules" or equivalent option
4. Observe table

**Expected Results:**
- Table shows scores across all modules
- May show summary or aggregate view
- More columns visible for different modules
- Scrollable table to accommodate all data

---

### 3. Viewing Praktikan Score Table

**Seed:** `tests/seed.spec.ts`

#### 3.1 View Empty Praktikan List
**Steps:**
1. Select a kelas with no enrolled praktikan
2. Observe table

**Expected Results:**
- Table shows empty state message
- "No praktikan found" or similar message
- No score input fields visible
- Can still change filters

#### 3.2 View Praktikan List with Scores
**Steps:**
1. Select "Kelas B"
2. Select "Modul 1"
3. Observe praktikan table

**Expected Results:**
- Table shows list of praktikan with columns:
  - No. (sequential number)
  - NRP (student ID)
  - Nama (name)
  - TA score
  - Jurnal score
  - FITB score
  - Mandiri/TM score
  - TK score
  - TP score
  - Pelanggaran score
  - Other adjustments
  - Total score (calculated)
- Existing scores are displayed in appropriate cells
- Empty cells show placeholder (e.g., "-" or "0")
- Table is scrollable horizontally and vertically

#### 3.3 View Score Input Fields
**Steps:**
1. Table is loaded with praktikan
2. Observe score cells

**Expected Results:**
- Score cells are input fields or editable cells
- Can click to edit
- Current values are displayed
- Input fields accept numeric values
- Max scores may be indicated (e.g., "/ 100")

#### 3.4 View Total Score Calculation
**Steps:**
1. Praktikan A has scores: TA=80, Jurnal=75, TM=85, TK=90
2. Observe Total column

**Expected Results:**
- Total score is automatically calculated
- Formula may be weighted (depends on implementation)
- Total updates when individual scores change
- Total is read-only (cannot edit directly)

---

### 4. Inputting Individual Scores

**Seed:** `tests/seed.spec.ts`

#### 4.1 Input TA Score
**Steps:**
1. Find praktikan "1234567890 - John Doe"
2. Click in TA score cell
3. Type "85"
4. Press Enter or click outside cell

**Expected Results:**
- Cell becomes editable (input field or inline edit)
- Can type numeric value
- Value "85" appears in cell
- Cell saves automatically or shows save indicator
- Total score updates to include new TA score

#### 4.2 Input Jurnal Score
**Steps:**
1. For same praktikan
2. Click Jurnal score cell
3. Type "90"
4. Press Tab to move to next cell

**Expected Results:**
- Jurnal score updates to 90
- Total score recalculates
- Tab moves focus to next editable cell (FITB or TM)
- Previous cell saves automatically

#### 4.3 Input Multiple Scores for One Praktikan
**Steps:**
1. For praktikan "John Doe"
2. Input: TA=85, Jurnal=90, FITB=80, TM=88, TK=92, TP=95
3. Observe total calculation

**Expected Results:**
- All individual scores are saved
- Total score reflects sum or weighted average
- All cells show updated values
- Can see complete score profile for praktikan

#### 4.4 Input Score with Decimal
**Steps:**
1. Click TM score cell for a praktikan
2. Type "87.5"
3. Press Enter

**Expected Results:**
- Decimal value is accepted (if allowed)
- Score displays as "87.5" or rounds to "88" (depends on validation)
- Total recalculates with decimal included
- If decimals not allowed, validation error appears

#### 4.5 Input Score Exceeding Maximum
**Steps:**
1. Click TA score cell (max 100)
2. Type "150"
3. Press Enter

**Expected Results:**
- Validation error appears: "Score cannot exceed 100"
- Value is not saved
- Cell reverts to previous value or stays empty
- Error message is displayed (toast or inline)
- Can re-enter valid value

#### 4.6 Input Negative Score
**Steps:**
1. Click Jurnal score cell
2. Type "-10"
3. Press Enter

**Expected Results:**
- Validation error: "Score cannot be negative"
- Value is rejected
- Cell reverts to previous value
- Error message displayed
- Can enter valid non-negative value

#### 4.7 Input Non-Numeric Value
**Steps:**
1. Click TK score cell
2. Type "abc"
3. Press Enter

**Expected Results:**
- Validation error: "Please enter a valid number"
- Non-numeric value is rejected
- Cell does not save invalid value
- Error feedback is shown

---

### 5. Inputting Pelanggaran (Violation) Scores

**Seed:** `tests/seed.spec.ts`

#### 5.1 Input Pelanggaran Deduction
**Steps:**
1. Praktikan "Jane Smith" has violations
2. Click Pelanggaran score cell
3. Type "10" (deduction of 10 points)
4. Press Enter

**Expected Results:**
- Pelanggaran value is saved as 10
- Total score decreases by 10 points
- Cell shows "-10" or "10" (depending on display format)
- Violation deduction is clearly indicated
- Total reflects penalty

#### 5.2 Input Large Pelanggaran
**Steps:**
1. Click Pelanggaran cell
2. Type "50"
3. Observe total score

**Expected Results:**
- Large deduction is applied
- Total score may become negative or capped at 0 (depends on rules)
- Deduction is clearly visible
- Can be edited if entered incorrectly

---

### 6. Batch Score Input

**Seed:** `tests/seed.spec.ts`

#### 6.1 Select Multiple Praktikan
**Steps:**
1. Nilai table is loaded
2. Click checkbox next to "John Doe"
3. Click checkbox next to "Jane Smith"
4. Click checkbox next to "Bob Johnson"
5. Observe selection state

**Expected Results:**
- Checkboxes are checked for selected praktikan
- Selected count indicator appears (e.g., "3 selected")
- Batch action buttons become enabled
- Can select/deselect individual praktikan

#### 6.2 Batch Input Same Score for TA
**Steps:**
1. Three praktikan are selected
2. Click "Batch Input" or similar button
3. Select score type: "TA"
4. Enter value: "85"
5. Click "Apply" or "Submit"

**Expected Results:**
- All three selected praktikan receive TA score of 85
- Their totals update accordingly
- Batch input modal/form closes
- Success message appears
- Table refreshes with new scores

#### 6.3 Batch Input for Multiple Score Types
**Steps:**
1. Five praktikan selected
2. Open batch input form
3. Enter: TA=80, Jurnal=85, TM=90
4. Apply batch input

**Expected Results:**
- All five praktikan receive all three scores
- Each praktikan's row updates
- Totals recalculate for all five
- Success notification
- Can undo if needed

---

### 7. Saving and Persistence

**Seed:** `tests/seed.spec.ts`

#### 7.1 Auto-Save Individual Score
**Steps:**
1. Input TA score: 85
2. Move to next cell (Tab or click)
3. Wait 2 seconds
4. Observe save status

**Expected Results:**
- Score auto-saves after leaving cell
- Save indicator appears (checkmark, "Saved", loading spinner)
- API call to save score is made
- Success toast or inline confirmation
- Score persists if page refreshed

#### 7.2 Manual Save Button
**Steps:**
1. Input multiple scores: TA=85, Jurnal=90, TM=88
2. Click "Save" or "Save Changes" button
3. Observe save process

**Expected Results:**
- Loading indicator on button
- API call saves all modified scores
- Success toast: "Scores saved successfully"
- Button returns to normal state
- Modified cells are marked as saved

#### 7.3 Save Validation Error
**Steps:**
1. Input invalid score: TA=150
2. Click "Save" button
3. Observe validation

**Expected Results:**
- Validation error before save
- Error message: "TA score exceeds maximum (100)"
- Invalid cell is highlighted
- Save is blocked until error corrected
- Can correct value and retry

#### 7.4 Save with Network Error
**Steps:**
1. Input valid scores
2. Simulate network disconnection
3. Click "Save"
4. Observe error handling

**Expected Results:**
- Error message: "Failed to save scores. Please check your connection."
- Scores remain in editable state (not lost)
- Retry button or option to save again
- No data loss
- Can retry after connection restored

#### 7.5 Verify Persistence After Refresh
**Steps:**
1. Input and save scores: TA=85, Jurnal=90
2. Refresh browser page (F5)
3. Navigate back to same kelas and modul
4. Observe praktikan scores

**Expected Results:**
- Previously saved scores are displayed
- TA shows 85, Jurnal shows 90
- No data loss after refresh
- Scores are fetched from database
- Total is recalculated correctly

---

### 8. Search and Filter Praktikan

**Seed:** `tests/seed.spec.ts`

#### 8.1 Search by NRP
**Steps:**
1. Table shows 30 praktikan
2. Type "1234567890" in search box
3. Observe filtered results

**Expected Results:**
- Table filters to show only matching NRP
- Single praktikan "1234567890" is displayed
- Other praktikan are hidden
- Can clear search to show all again

#### 8.2 Search by Name
**Steps:**
1. Type "John" in search box
2. Observe filtered results

**Expected Results:**
- All praktikan with "John" in name are shown
- Case-insensitive search
- Partial matches are included
- Can see "John Doe", "Johnny Smith", etc.

#### 8.3 Clear Search Filter
**Steps:**
1. Search is active with "John"
2. Clear search box or click "X" button
3. Observe table

**Expected Results:**
- Search filter is removed
- All praktikan are displayed again
- Table returns to full list
- Previous sort order maintained

---

### 9. Score History and Audit Trail

**Seed:** `tests/seed.spec.ts`

#### 9.1 View Score Modification History
**Steps:**
1. Find praktikan with existing scores
2. Click "History" or info icon next to score
3. Observe history modal/panel

**Expected Results:**
- Modal shows score change history
- Lists all modifications with:
  - Previous value
  - New value
  - Modified by (asisten name)
  - Timestamp
- Can see who changed what and when
- History is chronological

#### 9.2 Identify Own Modifications
**Steps:**
1. View score history
2. Look for entries modified by current asisten

**Expected Results:**
- Current asisten's modifications are highlighted or labeled
- Can distinguish own changes from others'
- Username or "You" is displayed

---

### 10. Special Cases and Edge Cases

**Seed:** `tests/seed.spec.ts`

#### 10.1 Input Score for Absent Praktikan
**Steps:**
1. Praktikan marked as absent for Modul 2
2. Attempt to input TA score
3. Observe behavior

**Expected Results:**
- Can still input score OR
- Warning: "Praktikan was absent" OR
- Score field is disabled with explanation
- Behavior depends on business rules

#### 10.2 Input Score for Module Not Yet Taken
**Steps:**
1. Select Modul 5 (not yet covered in semester)
2. Attempt to input scores
3. Observe behavior

**Expected Results:**
- Warning message may appear
- Scores can be entered (for advance planning) OR
- Input is disabled until module is activated
- Clear indication of module status

#### 10.3 Modify Score Multiple Times
**Steps:**
1. Input TA score: 80
2. Save
3. Change TA score to: 85
4. Save
5. Change TA score to: 90
6. Save
7. View history

**Expected Results:**
- Each modification is saved separately
- History shows all three values: 80 → 85 → 90
- Current score is 90
- Can see complete audit trail

#### 10.4 Concurrent Editing by Multiple Asisten
**Steps:**
1. Asisten A opens Kelas B, Modul 1
2. Asisten B opens same Kelas B, Modul 1
3. Asisten A inputs TA score: 85 for "John Doe"
4. Asisten B inputs TA score: 90 for "John Doe"
5. Both save

**Expected Results:**
- Last write wins (Asisten B's 90 overwrites Asisten A's 85) OR
- Conflict detection: Warning shown to second asisten OR
- Real-time update: Asisten A sees Asisten B's change
- Depends on concurrency handling

---

### 11. Export and Reporting

**Seed:** `tests/seed.spec.ts`

#### 11.1 Export Scores to Excel/CSV
**Steps:**
1. Select Kelas B, Modul 1
2. Click "Export" button
3. Choose "Excel" or "CSV" format
4. Observe download

**Expected Results:**
- File download initiates
- File contains all praktikan scores for selected kelas/modul
- Columns match table structure
- File name includes kelas, modul, date
- Data is formatted correctly

#### 11.2 Print Score Report
**Steps:**
1. View score table
2. Click "Print" button
3. Observe print preview

**Expected Results:**
- Print preview opens
- Table is formatted for printing
- Page breaks are appropriate
- Header/footer includes relevant info (kelas, modul, date)
- Can print or save as PDF

---

### 12. Permissions and Access Control

**Seed:** `tests/seed.spec.ts`

#### 12.1 Access as Asisten with Permission
**Steps:**
1. Login as asisten with `nilai praktikan` permission
2. Navigate to Nilai Praktikan page

**Expected Results:**
- Page loads successfully
- All features are accessible
- Can view and edit scores

#### 12.2 Access as Asisten without Permission
**Steps:**
1. Login as asisten without `nilai praktikan` permission
2. Attempt to navigate to `/assistants/nilai-praktikan`

**Expected Results:**
- Access is denied
- 403 Forbidden or redirect to dashboard
- Navigation link is not visible in sidebar
- Cannot access page directly via URL

#### 12.3 Access as Praktikan
**Steps:**
1. Login as praktikan
2. Attempt to access asisten nilai page

**Expected Results:**
- Access is denied
- Redirect to praktikan dashboard
- Cannot view asisten-only features

---

### 13. Performance and Usability

**Seed:** `tests/seed.spec.ts`

#### 13.1 Load Large Praktikan List
**Steps:**
1. Select kelas with 50+ praktikan
2. Observe table load time
3. Scroll through table

**Expected Results:**
- Table loads within 2-3 seconds
- Smooth scrolling
- No lag when editing cells
- Pagination or virtual scrolling for large lists

#### 13.2 Rapid Score Input
**Steps:**
1. Use Tab to navigate between cells
2. Rapidly input scores: 80 [Tab] 85 [Tab] 90 [Tab] 88 [Tab] 92
3. Observe responsiveness

**Expected Results:**
- No input lag
- Tab navigation works smoothly
- Each value is captured correctly
- Auto-save keeps up with input speed

#### 13.3 Keyboard Shortcuts
**Steps:**
1. Try Ctrl+S to save
2. Try Ctrl+F to search
3. Try Tab/Shift+Tab to navigate cells

**Expected Results:**
- Keyboard shortcuts work as expected
- Can navigate efficiently without mouse
- Shortcuts are documented or discoverable

---

### 14. Mobile and Responsive Behavior

**Seed:** `tests/seed.spec.ts`

#### 14.1 View on Mobile Device
**Steps:**
1. Open Nilai Praktikan page on mobile (375px width)
2. Observe layout

**Expected Results:**
- Table is horizontally scrollable
- Filters stack vertically
- Touch-friendly input fields
- Can still input scores on mobile
- May have simplified view

#### 14.2 View on Tablet
**Steps:**
1. Open page on tablet (768px width)
2. Test score input

**Expected Results:**
- Layout adapts to tablet size
- All features remain accessible
- Touch inputs work correctly
- Comfortable to use on tablet

---

## Test Data Requirements

### User Accounts Needed

1. **Asisten with Nilai Permission**
   - Must have `nilai praktikan` permission
   - Assigned to multiple classes

2. **Asisten without Nilai Permission**
   - For testing access control

3. **Multiple Praktikan Accounts**
   - At least 20 praktikan across 3 classes
   - Various score states (some with scores, some without)

### Data Setup

1. **Classes with Praktikan**
   - At least 3 classes (e.g., A, B, C)
   - Each with 10-20 praktikan

2. **Modules**
   - At least 5 modules with different assessment types

3. **Existing Scores**
   - Some praktikan with complete scores
   - Some with partial scores
   - Some with no scores (for testing input)

4. **Score History**
   - Some scores with modification history for audit testing

---

## Success Criteria

### Functional Success
- ✅ Can select kelas and modul to filter praktikan
- ✅ Praktikan list loads correctly
- ✅ Can input individual scores for all types (TA, Jurnal, FITB, TM, TK, TP, Pelanggaran)
- ✅ Total scores calculate automatically
- ✅ Scores save successfully to database
- ✅ Batch input works for multiple praktikan
- ✅ Validation prevents invalid scores
- ✅ Search and filter work correctly

### Data Integrity Success
- ✅ All scores persist after save
- ✅ Scores are accurate after refresh
- ✅ History/audit trail tracks all changes
- ✅ Concurrent edits are handled appropriately

### Usability Success
- ✅ Table is easy to navigate
- ✅ Input fields are intuitive
- ✅ Tab navigation works smoothly
- ✅ Error messages are clear
- ✅ Save feedback is immediate

### Performance Success
- ✅ Page loads within 3 seconds
- ✅ Score input is responsive
- ✅ Large lists (50+ praktikan) perform well
- ✅ Auto-save doesn't block user input

---

## Notes for Test Implementation

1. **Database State**: Ensure clean test data with known scores
2. **Validation Rules**: Confirm max scores for each assessment type
3. **Calculation Formula**: Understand how total score is calculated (sum vs weighted)
4. **Permissions**: Test with multiple asisten accounts
5. **Concurrent Users**: Test with multiple browsers for concurrency
6. **API Mocking**: Mock score save API for failure scenarios
7. **Accessibility**: Test keyboard navigation thoroughly

---

**Document Version**: 1.0  
**Last Updated**: November 2024  
**Target Component**: `resources/js/Components/Assistants/Content/ContentNilai.jsx`  
**Related Pages**: `resources/js/Pages/Assistants/NilaiPraktikan.jsx`  
**Backend Dependencies**: `/api-v1/nilai/*`, `/api-v1/kelas`, `/api-v1/modul`  
**Permissions Required**: `nilai praktikan`
