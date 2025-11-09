# Polling Management and Submission - Comprehensive Test Plan

## Overview

This test plan covers the complete **Polling System workflow** including asisten creating polling types and controlling availability, praktikan filling and submitting polls, and asisten viewing poll results.

## Application Flow Context

### Asisten Polling Management (ContentPolling)
- Create/add new polling types (jenis polling)
- Turn polling on/off globally
- View polling results by category
- See submission statistics

### Praktikan Polling Page
- View available polling categories
- Select asisten to rate (filtered, no BOT asisten)
- Submit ratings for each category
- Track submitted categories

### Key Features
- **Multiple Categories**: Different polling types (e.g., Communication, Technical Skills, Responsiveness)
- **Per-Category Submission**: Praktikan submit once per category
- **Rating System**: Card-based selection (likely 1-5 scale)
- **Results Dashboard**: Asisten see aggregated results
- **Real-time Updates**: Status changes broadcast via WebSocket

---

## Test Scenarios

### 1. Asisten Creates Polling Categories

#### 1.1 Navigate to Polling Page as Asisten
**Steps:**
1. Login as asisten with `polling` permission
2. Click "Polling" in navigation sidebar
3. Observe polling management page

**Expected Results:**
- Page loads at `/assistants/polling`
- ContentPolling component renders
- Shows list of existing polling categories
- "Add Jenis Polling" or "Create Category" button visible
- Polling on/off toggle switch visible

#### 1.2 Add New Polling Category
**Steps:**
1. Click "Add Jenis Polling" button
2. Enter category name: "Communication Skills"
3. Enter description (optional): "Rate asisten's communication abilities"
4. Click "Save" or "Create"

**Expected Results:**
- Modal or form accepts input
- Category is created in database
- Success toast: "Polling category added successfully"
- New category appears in list
- Can add multiple categories

#### 1.3 Add Multiple Polling Categories
**Steps:**
1. Create category: "Technical Knowledge"
2. Create category: "Responsiveness"
3. Create category: "Helpfulness"
4. Create category: "Overall Performance"

**Expected Results:**
- Four categories are created
- All appear in asisten's polling list
- Each has unique ID
- Can be managed independently

### 2. Asisten Activates Polling

#### 2.1 Turn On Polling Globally
**Steps:**
1. Polling is currently off (toggle switch off)
2. Click polling toggle to enable
3. Observe activation

**Expected Results:**
- Toggle switches to "On" state
- Visual feedback (green color, checkmark)
- API call saves polling_active = true
- Success toast: "Polling activated"
- WebSocket broadcasts activation
- Praktikan can now access polling

#### 2.2 Verify Praktikan Can Access Polling
**Steps:**
1. Polling is activated by asisten
2. Praktikan navigates to `/praktikan/polling`
3. Observe polling page

**Expected Results:**
- Page shows available polling categories
- All four categories are listed
- Each category shows as available for submission
- Praktikan can select a category to begin

### 3. Praktikan Fills and Submits Polling

#### 3.1 View Available Categories
**Steps:**
1. Praktikan on polling page
2. Polling is active
3. Observe category list

**Expected Results:**
- Categories displayed: "Communication Skills", "Technical Knowledge", "Responsiveness", "Helpfulness"
- Each has description
- Selection buttons or cards visible
- Can choose which category to rate first

#### 3.2 Select First Category
**Steps:**
1. Click on "Communication Skills" category
2. Observe polling form

**Expected Results:**
- Category is marked as active/selected
- Form loads with list of asisten to rate
- BOT asisten are filtered out (not shown)
- Only real asisten appear
- Rating interface is displayed

#### 3.3 View Asisten List for Rating
**Steps:**
1. "Communication Skills" category selected
2. Observe asisten list

**Expected Results:**
- All asisten from praktikan's class are listed
- Asisten names and photos (if available) shown
- BOT asisten are excluded
- Rating cards or selection interface for each asisten
- Can scroll through list

#### 3.4 Rate Asisten with Card Selection
**Steps:**
1. For asisten "John Doe", select rating card "5" (Excellent)
2. For asisten "Jane Smith", select rating card "4" (Good)
3. For asisten "Bob Johnson", select rating card "5" (Excellent)
4. Observe selections

**Expected Results:**
- Selected cards are highlighted
- Can change selection before submitting
- Visual feedback on selection (border, color change)
- All asisten must be rated (or optional based on rules)

#### 3.5 Submit Category Polling
**Steps:**
1. All asisten rated for "Communication Skills"
2. Click "Submit" button
3. Observe submission

**Expected Results:**
- Loading indicator on button
- API POST to `/api-v1/pollings` with ratings
- Success toast: "Polling submitted successfully"
- Category "Communication Skills" marked as submitted
- Cannot re-submit same category
- Redirects or returns to category selection

#### 3.6 Submit Second Category
**Steps:**
1. Select "Technical Knowledge" category
2. Rate all asisten again (may be different ratings)
3. Submit
4. Observe tracking

**Expected Results:**
- Second submission succeeds
- "Technical Knowledge" marked as submitted
- Two categories now completed
- Two remaining: "Responsiveness", "Helpfulness"

#### 3.7 Complete All Categories
**Steps:**
1. Submit "Responsiveness" polling
2. Submit "Helpfulness" polling
3. Observe completion state

**Expected Results:**
- All four categories submitted
- Completion message: "All polling categories completed. Thank you!"
- No more categories available
- Cannot submit again
- Submitted categories stored in localStorage

#### 3.8 Return to Polling Page After Completion
**Steps:**
1. All categories submitted
2. Navigate away and return to polling page
3. Observe state

**Expected Results:**
- Page shows "All categories submitted"
- No available categories to fill
- Previously submitted data persists
- Clear indication that polling is complete

### 4. Asisten Views Polling Results

#### 4.1 Access Results Dashboard
**Steps:**
1. Asisten on polling management page
2. Click "View Results" or "Results" tab
3. Observe results interface

**Expected Results:**
- Results dashboard is displayed
- Can filter by category
- Shows aggregated data
- Statistics and visualizations

#### 4.2 View Results for Specific Category
**Steps:**
1. Select "Communication Skills" category filter
2. Observe results

**Expected Results:**
- Shows all submissions for that category
- Displays ratings breakdown:
  - Count for each rating (1-5)
  - Average rating per asisten
  - Total submissions
- May show charts/graphs
- Can see individual asisten performance

#### 4.3 View Overall Results
**Steps:**
1. Select "All Categories" or clear filter
2. Observe comprehensive results

**Expected Results:**
- Shows combined data across all categories
- Overall average ratings per asisten
- Participation rate (% of praktikan who submitted)
- Total submissions per category
- Comparative data

#### 4.4 Export Results
**Steps:**
1. Click "Export" button
2. Choose format (Excel/CSV)
3. Observe download

**Expected Results:**
- File downloads with all polling data
- Includes: Category, Asisten, Ratings, Submissions
- Formatted and readable
- Can be analyzed further in spreadsheet

### 5. Asisten Deactivates Polling

#### 5.1 Turn Off Polling
**Steps:**
1. Polling is currently active
2. Some praktikan have submitted, some have not
3. Asisten toggles polling off
4. Observe deactivation

**Expected Results:**
- Toggle switches to "Off" state
- API saves polling_active = false
- Success toast: "Polling deactivated"
- WebSocket broadcasts deactivation

#### 5.2 Praktikan Cannot Access Inactive Polling
**Steps:**
1. Polling is deactivated
2. Praktikan (who has not completed all categories) visits polling page
3. Observe page

**Expected Results:**
- Page shows: "Polling is currently inactive"
- Cannot access categories or submit
- Previously submitted data is preserved
- Clear message about status

### 6. Edge Cases and Special Scenarios

#### 6.1 Attempt to Submit Same Category Twice
**Steps:**
1. Praktikan submits "Communication Skills"
2. Try to submit "Communication Skills" again
3. Observe behavior

**Expected Results:**
- Cannot re-select submitted category
- Category is grayed out or disabled
- Message: "Already submitted"
- Submission is rejected if attempted via API

#### 6.2 Partial Submission (Not All Asisten Rated)
**Steps:**
1. Select "Responsiveness" category
2. Rate only 3 out of 5 asisten
3. Attempt to submit

**Expected Results:**
- Validation error: "Please rate all asisten" OR
- Partial submission allowed (depends on rules)
- Clear feedback on what's missing

#### 6.3 Network Error During Submission
**Steps:**
1. Fill polling for "Helpfulness"
2. Simulate network disconnection
3. Click submit

**Expected Results:**
- Error toast: "Failed to submit. Please try again."
- Ratings remain in form (not lost)
- Can retry after connection restored
- No duplicate submission

#### 6.4 Concurrent Submissions from Multiple Praktikan
**Steps:**
1. 30 praktikan submit "Communication Skills" simultaneously
2. Server processes all requests

**Expected Results:**
- All submissions are accepted
- No data loss or conflicts
- Database handles concurrent writes
- Results accurately reflect all submissions

#### 6.5 localStorage Cleared Mid-Session
**Steps:**
1. Praktikan submits 2 categories
2. localStorage is manually cleared
3. Refresh page
4. Observe state

**Expected Results:**
- May show all categories as available again OR
- Fetches submission status from backend
- Prevents duplicate submissions via backend validation
- State is recoverable

### 7. Polling Reactivation and Reset

#### 7.1 Reactivate Polling for New Period
**Steps:**
1. Previous polling period ended, results collected
2. Asisten wants to start new polling
3. Asisten reactivates polling toggle

**Expected Results:**
- Polling opens again
- Praktikan who completed previous period can submit again OR
- Previous submissions are reset OR
- System tracks multiple polling periods

#### 7.2 Add New Category Mid-Polling
**Steps:**
1. Polling is active, praktikan are submitting
2. Asisten adds new category: "Punctuality"
3. Observe praktikan's page

**Expected Results:**
- New category appears in praktikan's list
- Real-time update via WebSocket
- Praktikan can submit for new category
- Previously completed categories remain submitted

### 8. Results Analysis Features

#### 8.1 View Top Rated Asisten
**Steps:**
1. Results dashboard is open
2. Sort by average rating (descending)
3. Observe ranking

**Expected Results:**
- Asisten ranked by performance
- Highest rated asisten at top
- Shows average rating score
- May highlight top performers

---

## Test Data Requirements

### User Accounts
1. **Asisten with Polling Permission** - Can manage polling
2. **Admin Asisten** - May have additional controls
3. **Multiple Praktikan** (at least 10) - For submissions
4. **BOT Asisten** - Should be filtered out from praktikan rating list

### Data Setup
1. **Polling Categories** - Create 4-5 categories
2. **Asisten List** - At least 5 real asisten + 1-2 BOT asisten
3. **Configuration** - polling_active setting in database

---

## Success Criteria

✅ Asisten can create polling categories  
✅ Asisten can activate/deactivate polling  
✅ Praktikan can access active polling  
✅ Praktikan can rate asisten across categories  
✅ Submissions save successfully  
✅ Duplicate submissions are prevented  
✅ BOT asisten are filtered from rating list  
✅ Asisten can view aggregated results  
✅ Results dashboard shows meaningful data  
✅ Real-time activation/deactivation works  

---

**Document Version**: 1.0  
**Last Updated**: November 2024  
**Target Components**:
- Praktikan: `resources/js/Pages/Praktikan/PollingPage.jsx`
- Asisten: `resources/js/Pages/Assistants/PollingAssistant.jsx`, `resources/js/Components/Assistants/Content/ContentPolling.jsx`
**Backend Dependencies**: `/api-v1/jenis-polling`, `/api-v1/pollings`, `/api-v1/asisten`
