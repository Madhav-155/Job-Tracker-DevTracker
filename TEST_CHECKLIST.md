# DevTracker - Manual Test Checklist

## ✅ Critical Functionality Tests

### Initial Load & Setup
- [ ] App loads without console errors
- [ ] Seed data appears (2 sample jobs, 1 sample project)
- [ ] Welcome toast notification shows
- [ ] All tabs are visible and clickable
- [ ] Background gradient orbs are animating

### Dashboard Tab
- [ ] KPI cards display correct values (Total Apps, Interviews, Offers, Response Rate, Avg Time)
- [ ] Applications over time chart renders
- [ ] Status distribution chart renders (donut)
- [ ] Conversion funnel chart renders (horizontal bars)
- [ ] Tags breakdown chart renders
- [ ] Top companies table displays correctly
- [ ] Date filters work (apply filters button)

### Jobs Tab - CRUD Operations
**Add Job:**
- [ ] Click "Add Job" button opens modal
- [ ] All fields from DATA_MODEL are present
- [ ] Required fields (Company, Role, Applied Date, Status) show validation
- [ ] Select dropdown for Status shows all 5 options (Applied, Phone, Interview, Offer, Rejected)
- [ ] Date pickers work correctly
- [ ] Save button adds job to list
- [ ] New job appears at top of grid
- [ ] Success toast shows "Job added successfully"
- [ ] Job card displays all entered data correctly

**Edit Job:**
- [ ] Click Edit button on job card opens modal
- [ ] Modal pre-fills with existing job data
- [ ] Update button saves changes
- [ ] Changes reflect immediately in job list
- [ ] Success toast shows "Job updated successfully"

**Duplicate Job:**
- [ ] Click Duplicate button creates copy
- [ ] Duplicate appears at top of list
- [ ] Duplicate has new ID (not same as original)
- [ ] Success toast shows "Job duplicated successfully"

**Delete Job:**
- [ ] Click Delete button shows confirmation dialog
- [ ] Confirm deletes job from list
- [ ] Cancel keeps job in list
- [ ] Success toast shows "Job deleted successfully"
- [ ] KPIs update after deletion

### Jobs Tab - Filtering & Search
- [ ] Search box filters jobs by company name
- [ ] Search box filters jobs by role title
- [ ] Search box filters jobs by tags
- [ ] Search is case-insensitive
- [ ] Search debounces (doesn't search on every keystroke)
- [ ] Status filter chips work (All, Applied, Phone, Interview, Offer, Rejected)
- [ ] Active chip highlights in blue
- [ ] Filtering updates job count immediately

### Jobs Tab - View Modes
- [ ] Card view button shows grid layout
- [ ] List view button shows list layout
- [ ] View toggle persists within session
- [ ] Cards display correctly in both views
- [ ] Hover effects work in both views

### Jobs Tab - Empty State
- [ ] When no jobs exist, shows empty state message
- [ ] Empty state shows icon and "Add First Job" button
- [ ] Clicking "Add First Job" opens add modal

### Export Functionality
**Excel Export:**
- [ ] Click Export dropdown shows menu
- [ ] Click "Export to Excel" downloads .xlsx file
- [ ] File opens correctly in Excel/LibreOffice
- [ ] All job fields are exported as columns
- [ ] All jobs are exported as rows
- [ ] Success toast shows

**Word Export:**
- [ ] Click "Export to Word" downloads .docx file
- [ ] File opens correctly in Word
- [ ] Jobs are formatted nicely
- [ ] All job data is included
- [ ] Success toast shows

**CSV Export:**
- [ ] Click "Export to CSV" downloads .csv file
- [ ] File opens correctly in text editor/Excel
- [ ] Headers match DATA_MODEL labels
- [ ] All jobs are present
- [ ] Success toast shows

**JSON Backup:**
- [ ] Click "Backup JSON" downloads .json file
- [ ] JSON is valid (can be opened in text editor)
- [ ] Contains jobs, projects, socialLinks, settings
- [ ] Has version and exportDate fields
- [ ] Success toast shows

### Import Functionality
**Excel Import:**
- [ ] Click "Import" and select .xlsx file
- [ ] Shows success toast with count
- [ ] Imported jobs appear in list
- [ ] Existing jobs are preserved (merge, not replace)
- [ ] Invalid/malformed Excel shows error toast

**JSON Import:**
- [ ] Click "Import" and select .json backup file
- [ ] All data restores (jobs, projects, social links, settings)
- [ ] UI refreshes to show imported data
- [ ] Success toast shows
- [ ] Invalid JSON shows error toast

### Projects Tab
**Add Project:**
- [ ] Click "Add Project" opens modal
- [ ] All project fields are present (title, description, tech stack, link, image URL, job-related checkbox)
- [ ] Required fields validate
- [ ] Save adds project to grid
- [ ] Success toast shows

**Edit Project:**
- [ ] Click Edit on project card opens modal
- [ ] Modal pre-fills with project data
- [ ] Update saves changes
- [ ] Success toast shows

**Delete Project:**
- [ ] Click Delete shows confirmation
- [ ] Confirm deletes project
- [ ] Success toast shows

**Project Filters:**
- [ ] "All Projects" shows everything
- [ ] "Portfolio" shows only non-job-related projects
- [ ] "Job-Related" shows only job-related projects
- [ ] Filter chips highlight correctly

**Project Card Display:**
- [ ] Image URL displays as image
- [ ] Missing image shows fallback icon
- [ ] Tech stack tags display correctly
- [ ] External link opens in new tab
- [ ] Hover effect works

### Settings Tab
**Appearance:**
- [ ] Glass intensity slider changes blur effect (visible immediately)
- [ ] Enable animations checkbox toggles animations
- [ ] Reduce motion checkbox disables animations (accessibility)
- [ ] Settings persist after page reload

**Social Links:**
- [ ] Default social links display (GitHub, LinkedIn, Twitter, Email)
- [ ] Can edit platform name
- [ ] Can edit URL
- [ ] Changes reflect in header immediately
- [ ] Can delete social link
- [ ] Click "Add Link" adds new row
- [ ] Changes persist after reload

**Resume Management:**
- [ ] Shows "No resume uploaded" initially
- [ ] Click "Upload Resume" opens file picker
- [ ] Can upload PDF file
- [ ] Can upload DOC/DOCX file
- [ ] File size and name display after upload
- [ ] "Download Resume" button works
- [ ] "Remove Resume" button deletes resume
- [ ] Warning shows for files > 10MB
- [ ] Success toast shows after upload

**Data Management:**
- [ ] "Export All Data (JSON)" downloads backup
- [ ] "Import Data" restores from JSON backup
- [ ] "Reset All Data" shows double confirmation
- [ ] Reset clears all data and reloads page

### Resume in Header
- [ ] Resume icon button in header is visible
- [ ] Click downloads resume if uploaded
- [ ] Shows info toast "No resume uploaded yet" if none exists

### Help Tab
- [ ] Keyboard shortcuts list displays
- [ ] Accessibility notes display
- [ ] FAQ accordion items expand/collapse
- [ ] Privacy & security info displays

### Responsive Design
**Desktop (1920px):**
- [ ] All content fits without horizontal scroll
- [ ] KPI grid shows 5 columns
- [ ] Charts grid shows 2 columns
- [ ] Jobs grid shows 3-4 columns
- [ ] Tab labels show full text

**Tablet (768px):**
- [ ] Content adapts to smaller screen
- [ ] Jobs grid shows 2 columns
- [ ] Charts stack vertically
- [ ] Header wraps correctly
- [ ] Tab labels may be icon-only

**Mobile (375px):**
- [ ] Single column layout
- [ ] Tab navigation scrolls horizontally
- [ ] Tab labels are icon-only
- [ ] Job cards stack vertically
- [ ] Touch targets are at least 44px
- [ ] Search box fills width
- [ ] Modal fills screen with proper padding
- [ ] All buttons are accessible

### Accessibility
- [ ] All interactive elements are keyboard accessible
- [ ] Tab key navigates in logical order
- [ ] Enter/Space activates buttons
- [ ] Escape closes modals
- [ ] ARIA labels are present on important elements
- [ ] Form inputs have associated labels
- [ ] Status badges have appropriate contrast
- [ ] Keyboard focus is visible

### Keyboard Shortcuts
- [ ] Ctrl+N opens "Add Job" modal (when on Jobs tab)
- [ ] Escape closes open modals
- [ ] Tab navigation works throughout app

### Performance
- [ ] App loads in < 2 seconds
- [ ] No jank during animations
- [ ] Smooth scrolling
- [ ] Charts render in < 500ms
- [ ] Export happens without freezing UI
- [ ] Search is responsive (debounced)
- [ ] View switching is instant

### Browser Storage
- [ ] Jobs persist after page reload
- [ ] Projects persist after page reload
- [ ] Settings persist after page reload
- [ ] Social links persist after page reload
- [ ] Resume persists in IndexedDB after reload
- [ ] Data survives browser restart

### Edge Cases
**Large Data Sets:**
- [ ] App handles 100+ jobs without lag
- [ ] Export works with 100+ jobs
- [ ] Charts render correctly with many data points

**Empty States:**
- [ ] Dashboard works with 0 jobs
- [ ] Charts show "No data available" when empty
- [ ] Projects tab shows empty state
- [ ] Top companies table shows empty message

**Validation:**
- [ ] Cannot save job without required fields
- [ ] Cannot save project without required fields
- [ ] Email field validates email format
- [ ] URL field validates URL format
- [ ] Date fields enforce date format

**File Handling:**
- [ ] Resume upload rejects files > 10MB
- [ ] Resume upload accepts .pdf, .doc, .docx only
- [ ] Import validates file types
- [ ] Import handles corrupted files gracefully

### UI/UX Polish
- [ ] Glassmorphism effect is visible (blur + transparency)
- [ ] Gradient orbs animate smoothly
- [ ] Hover effects on all interactive elements
- [ ] Toast notifications auto-dismiss after 3 seconds
- [ ] Toast notifications slide in/out smoothly
- [ ] Modal animations are smooth
- [ ] Status badges have correct colors (Applied=cyan, Phone=orange, Interview=purple, Offer=green, Rejected=red)
- [ ] Loading states show when appropriate
- [ ] Buttons disable during async operations (if implemented)

### Cross-Browser Testing
- [ ] Works in Chrome/Edge (Chromium)
- [ ] Works in Firefox
- [ ] Works in Safari (if available)
- [ ] Works on iOS Safari (if available)
- [ ] Works on Android Chrome (if available)

### Console Errors
- [ ] No JavaScript errors in console
- [ ] No CSS warnings (except vendor prefix suggestions)
- [ ] CDN libraries load successfully
- [ ] No 404 errors for assets

---

## 🐛 Known Issues / Expected Behavior

1. **Seed data appears on first load** - This is intentional for demo purposes. Comment out `generateSeedData()` in app.js to disable.

2. **CDN dependencies** - If offline or CDN is down, charts/export may not work. Libraries are loaded from CDN for zero build setup.

3. **Browser storage limits** - localStorage ~5-10MB, IndexedDB ~50MB+. Export and reset if hitting limits.

4. **No server** - This is a client-only app. No backend sync. All data is local.

## ✅ Test Results

**Date Tested:** _____________

**Browser:** _____________

**Screen Size:** _____________

**Pass Rate:** _____ / _____ tests passed

**Critical Issues Found:**


**Minor Issues Found:**


**Notes:**
