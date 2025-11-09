# Tugas Pendahuluan Management - Comprehensive Test Plan

## Overview

This test plan covers the interaction between **Praktikan accessing Tugas Pendahuluan (TP)** page and **Asisten managing TP activation** through ModalActiveTP, including automatic open/close scheduling functionality.

## Application Flow Context

### Praktikan TP Page
- View active TP module
- Answer TP questions (essay format)
- Submit TP answers
- See TP availability status

### Asisten ModalActiveTP
- Select active TP module (Regular and English versions)
- Turn TP on/off globally
- Schedule automatic open/close times
- Changes broadcast in real-time to praktikan

### Key Features
- **Global Toggle**: Enable/disable TP system-wide
- **Module Selection**: Activate specific module for TP
- **Scheduled Access**: Set start/end times for automatic open/close
- **Real-time Sync**: Praktikan see changes immediately via WebSocket

---

## Test Scenarios

### 1. Praktikan View TP Page - TP Disabled

#### 1.1 Access TP Page When Globally Disabled
**Steps:**
1. Admin has disabled TP globally via configuration
2. Login as praktikan
3. Navigate to Tugas Pendahuluan page

**Expected Results:**
- Page shows message: "Tugas Pendahuluan is currently inactive"
- No TP module or questions are displayed
- Cannot submit answers
- Clear indication that feature is disabled

### 2. Asisten Activates TP Module

#### 2.1 Open ModalActiveTP as Admin
**Steps:**
1. Login as admin asisten
2. Click "Tugas Pendahuluan" in sidebar footer
3. Observe modal opening

**Expected Results:**
- ModalActiveTP opens
- Shows global TP toggle (on/off)
- Shows module selection dropdowns (Regular and English)
- Shows schedule configuration (optional)
- Save button visible

#### 2.2 Enable TP Globally
**Steps:**
1. ModalActiveTP is open
2. TP is currently disabled (toggle off)
3. Click global TP toggle to enable
4. Click "Save"

**Expected Results:**
- Toggle switches to enabled state
- Success toast appears
- Changes saved to database
- WebSocket broadcasts TP activation

#### 2.3 Select Active Module for Regular Classes
**Steps:**
1. ModalActiveTP is open
2. TP is enabled
3. Select "Modul 3" from Regular module dropdown
4. Click "Save"

**Expected Results:**
- Modul 3 is set as active TP module
- Save succeeds
- WebSocket broadcasts module selection
- Praktikan in regular classes see Modul 3 TP

#### 2.4 Select Active Module for English Classes
**Steps:**
1. In same modal session
2. Select "Module 3 (English)" from English module dropdown
3. Click "Save"

**Expected Results:**
- English module is set separately
- Praktikan in English classes (TOT, isEnglish) see English version
- Both configurations coexist

### 3. Praktikan Sees Active TP Module

#### 3.1 Real-time Update When Modul Activated
**Steps:**
1. Praktikan is on TP page (showing inactive message)
2. Asisten activates Modul 3 and enables TP
3. Observe praktikan's page without refresh

**Expected Results:**
- Within 1-2 seconds, page updates
- TP questions for Modul 3 load automatically
- Can now view and answer questions
- WebSocket event triggered update

#### 3.2 View TP Questions
**Steps:**
1. TP is active with Modul 3
2. Praktikan on TP page
3. Observe question display

**Expected Results:**
- Modul 3 title displayed
- All TP questions listed (essay format)
- Text areas for answers
- Submit button enabled
- Can scroll through all questions

#### 3.3 Answer TP Questions
**Steps:**
1. Type answer in question #1 text area
2. Type answer in question #2 text area
3. Type answer in question #3 text area

**Expected Results:**
- Can type freely in text areas
- Autosave may trigger (if implemented)
- Answers persist in form
- No character limit (or high limit)

#### 3.4 Submit TP Answers
**Steps:**
1. All questions answered
2. Click "Submit" button
3. Observe submission

**Expected Results:**
- Loading indicator on button
- API POST to submit TP answers
- Success toast: "TP submitted successfully"
- Answers saved to database
- Cannot re-submit (button disabled or removed)

### 4. Asisten Changes Active Module

#### 4.1 Switch from Modul 3 to Modul 5
**Steps:**
1. Modul 3 is currently active
2. Asisten opens ModalActiveTP
3. Changes selection to "Modul 5"
4. Saves

**Expected Results:**
- Modul 5 becomes active TP module
- WebSocket broadcasts module change
- Praktikan on TP page see questions change to Modul 5
- Previous answers to Modul 3 are preserved
- New question set loads

#### 4.2 Praktikan Sees Module Switch Real-time
**Steps:**
1. Praktikan is viewing/answering Modul 3 TP
2. Asisten switches to Modul 5
3. Observe praktikan's page

**Expected Results:**
- Page updates to Modul 5 questions
- If typing answer, may show warning
- Previous Modul 3 work is saved (if submitted)
- Seamless transition to new module

### 5. Asisten Disables TP

#### 5.1 Turn Off TP Globally
**Steps:**
1. TP is currently enabled with active module
2. Asisten opens ModalActiveTP
3. Toggles TP off globally
4. Saves

**Expected Results:**
- TP disabled system-wide
- Success message
- WebSocket broadcasts deactivation
- All praktikan lose access

#### 5.2 Praktikan Sees TP Disabled Real-time
**Steps:**
1. Praktikan is on TP page with active questions
2. Asisten disables TP globally
3. Observe praktikan's page

**Expected Results:**
- Questions disappear or become disabled
- Message: "TP is currently inactive"
- Cannot submit answers
- Previous submissions are preserved
- Real-time update within 1-2 seconds

### 6. Scheduled TP Access (Automatic Open/Close)

#### 6.1 Configure Schedule Start Time
**Steps:**
1. ModalActiveTP is open
2. Enable "Schedule" toggle/checkbox
3. Set start time: Today at 2:00 PM
4. Set end time: Today at 5:00 PM
5. Save configuration

**Expected Results:**
- Schedule is saved with datetime values
- TP will automatically open at 2:00 PM
- TP will automatically close at 5:00 PM
- Success message confirms schedule
- Schedule stored in database

#### 6.2 Test Automatic TP Open
**Steps:**
1. Schedule configured: Opens at 2:00 PM
2. Current time is 1:58 PM
3. Praktikan is on TP page (showing inactive)
4. Wait until 2:00 PM
5. Observe page update

**Expected Results:**
- At exactly 2:00 PM (or within 1 minute)
- TP questions appear automatically
- No page refresh required
- Backend cron job or scheduler triggers open
- WebSocket broadcasts activation
- Praktikan can now submit answers

#### 6.3 Test Automatic TP Close
**Steps:**
1. TP is open and active (opened at 2:00 PM)
2. Current time approaches 5:00 PM
3. Praktikan is actively answering questions
4. Time reaches 5:00 PM
5. Observe automatic close

**Expected Results:**
- At 5:00 PM, TP closes automatically
- Questions become disabled or disappear
- Message: "TP submission period has ended"
- Cannot submit new answers
- If praktikan was typing, may show warning
- Real-time update triggered by scheduler

#### 6.4 Praktikan Attempts Access Outside Schedule
**Steps:**
1. Schedule: 2:00 PM - 5:00 PM
2. Current time is 6:00 PM (after close)
3. Praktikan navigates to TP page

**Expected Results:**
- Page shows: "TP is not currently available"
- Schedule times may be displayed: "Available: 2:00 PM - 5:00 PM"
- Cannot access questions
- Clear indication of when TP will be available next

#### 6.5 Modify Schedule While TP is Open
**Steps:**
1. TP is open, schedule: 2:00 PM - 5:00 PM
2. Current time is 3:00 PM
3. Asisten changes end time to 4:00 PM
4. Saves
5. Observe behavior

**Expected Results:**
- New end time takes effect
- TP will now close at 4:00 PM instead of 5:00 PM
- Praktikan are not immediately affected (still have until 4:00 PM)
- At 4:00 PM, auto-close triggers

#### 6.6 Disable Schedule and Use Manual Control
**Steps:**
1. Schedule is active
2. Asisten disables schedule toggle
3. Manually sets TP to active (toggle on)
4. Saves

**Expected Results:**
- Schedule is removed
- TP remains open indefinitely (no auto-close)
- Manual control mode is active
- Requires asisten to manually close later

### 7. Edge Cases

#### 7.1 Schedule Start Time in Past
**Steps:**
1. ModalActiveTP open
2. Set start time: Yesterday at 2:00 PM
3. Set end time: Tomorrow at 5:00 PM
4. Save

**Expected Results:**
- Validation error: "Start time cannot be in the past" OR
- TP opens immediately (past start time = open now)
- Depends on validation rules

#### 7.2 End Time Before Start Time
**Steps:**
1. Set start time: 5:00 PM
2. Set end time: 2:00 PM (same day)
3. Attempt to save

**Expected Results:**
- Validation error: "End time must be after start time"
- Cannot save invalid schedule
- Form highlights error
- Can correct and re-save

#### 7.3 Concurrent Schedule and Manual Toggle
**Steps:**
1. Schedule is set and TP is auto-open
2. Asisten manually toggles TP off
3. Schedule end time has not been reached
4. Observe behavior

**Expected Results:**
- Manual toggle takes precedence OR
- Conflict warning appears
- TP closes immediately despite schedule
- Schedule may be disabled automatically

#### 7.4 Praktikan Submits Just Before Auto-Close
**Steps:**
1. TP closes at 5:00 PM
2. Praktikan clicks submit at 4:59:55 PM
3. Submission processing takes 3 seconds
4. Auto-close triggers at 5:00 PM
5. Observe submission outcome

**Expected Results:**
- Submission completes successfully OR
- Error: "Submission period has ended"
- Backend validates submission timestamp
- If submission started before close, may be accepted
- Clear feedback to praktikan

### 8. Multiple Praktikan Scenarios

#### 8.1 Different Classes See Different Modules
**Steps:**
1. Regular class praktikan on TP page
2. English class (TOT) praktikan on TP page
3. Asisten sets: Regular=Modul 2, English=Module 3
4. Observe both praktikan pages

**Expected Results:**
- Regular class sees Modul 2 questions
- English class sees Module 3 questions
- Each sees appropriate version
- No confusion between modules

#### 8.2 Simultaneous Submissions
**Steps:**
1. 20 praktikan all submit TP at 4:58 PM (2 min before close)
2. Server processes all submissions
3. TP closes at 5:00 PM

**Expected Results:**
- All 20 submissions are accepted
- No race conditions
- Database handles concurrent writes
- All praktikan see success confirmations
- No lost submissions

### 9. Admin and Permission Controls

#### 9.1 Non-Admin Tries to Access ModalActiveTP
**Steps:**
1. Login as regular asisten (non-admin)
2. Look for "Tugas Pendahuluan" button in footer

**Expected Results:**
- Button is not visible (role-based filtering)
- Cannot access modal
- Only admin roles can manage TP

#### 9.2 Praktikan Tries Direct Access to Inactive TP
**Steps:**
1. TP is disabled
2. Praktikan navigates to `/praktikan/tugas-pendahuluan`
3. Observe page

**Expected Results:**
- Page loads but shows inactive state
- Cannot access questions
- Backend blocks submission attempts
- Clear messaging about status

---

## Test Data Requirements

### User Accounts
1. **Admin Asisten** - Can access ModalActiveTP
2. **Regular Praktikan** - In non-English class
3. **English Class Praktikan** - In TOT or English class

### Data Setup
1. **Modules with TP Questions** - At least 5 modules with TP questions
2. **Configuration** - TP globally enabled/disabled setting
3. **Schedule Data** - Datetime fields for start/end times

### System Requirements
- Laravel scheduler running for auto open/close
- WebSocket for real-time updates
- Cron job or task scheduler configured

---

## Success Criteria

✅ Asisten can enable/disable TP globally  
✅ Asisten can select active modules (Regular & English)  
✅ Asisten can set schedule for automatic open/close  
✅ Praktikan see TP availability in real-time  
✅ Automatic open/close triggers at scheduled times  
✅ Module changes update praktikan pages immediately  
✅ Submissions work correctly within active periods  
✅ Access is denied outside scheduled times  
✅ Role-based access control works correctly  

---

**Document Version**: 1.0  
**Last Updated**: November 2024  
**Target Components**:
- Praktikan: `resources/js/Pages/Praktikan/TugasPendahuluanPage.jsx`
- Asisten: `resources/js/Components/Assistants/Modals/ModalActiveTP.jsx`
**Backend Dependencies**: `/api-v1/tugas-pendahuluan`, `/api-v1/configuration`, Laravel Scheduler, WebSocket
