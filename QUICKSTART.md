# 🚀 Quick Start Guide - DevTracker

## Open the App (Recommended)
Simply **double-click `index.html`** in your file explorer. The app will open in your default browser and is ready to use immediately!

## What You'll See

### First Load
- ✅ **Welcome toast** appears in top-right
- ✅ **2 sample jobs** pre-loaded (TechCorp, StartupXYZ)
- ✅ **1 sample project** pre-loaded
- ✅ **Dashboard tab** active by default

### Try These Right Away

1. **View Dashboard Analytics**
   - Already on Dashboard tab
   - See KPIs (Total Apps, Interviews, Offers, etc.)
   - Scroll down to see interactive charts

2. **Add Your First Real Job**
   - Click **Jobs** tab
   - Click **Add Job** button (blue, top-right)
   - Fill in: Company, Role, Applied Date, Status
   - Click **Add Job**
   - Your job appears at the top!

3. **Export Your Data**
   - Click **Export** dropdown (Jobs tab)
   - Choose **Export to Excel**
   - Excel file downloads automatically
   - Open it to see your jobs in a spreadsheet

4. **Upload Your Resume**
   - Click **Settings** tab
   - Find **Resume Management** card
   - Click **Upload Resume**
   - Select your PDF resume
   - Now you can download it anytime from the header icon 📄

5. **Customize Colors & Effects**
   - Still in **Settings** tab
   - Find **Appearance** card
   - Move the **Glass Effect Intensity** slider
   - Watch the background blur change in real-time!

## 💡 Pro Tips

### Keep Your Data Safe
⚠️ **IMPORTANT**: All data is stored in your browser. To back up:
1. Go to **Settings** > **Data Management**
2. Click **Export All Data (JSON)**
3. Save the file somewhere safe
4. To restore later: **Import Data** and select that file

### Keyboard Shortcuts
- `Ctrl + N` - Add new job (when on Jobs tab)
- `Esc` - Close any modal
- `Tab` - Navigate between elements

### Best Practices
1. **Tag your jobs** - Use tags like "Remote, React, Senior" for better filtering
2. **Set next action dates** - Never miss a follow-up
3. **Export weekly** - Create backups regularly
4. **Use search** - Quickly find jobs by company or role

## 📱 Mobile?
Yes! Open the same `index.html` file on your phone's browser. The app is fully responsive and touch-friendly.

## ❓ Need Help?
- Read the full **README.md** for detailed documentation
- Check **TEST_CHECKLIST.md** to see all features
- Click the **Help** tab in the app for FAQs

## 🎨 Want to Customize?

### Change Colors
Open `styles.css` and edit line 11-15:
```css
--accent-primary: #00d4ff;      /* Change this cyan color */
--accent-secondary: #7000ff;    /* Change this purple color */
```

### Add New Job Fields
Open `app.js` and find `DATA_MODEL` (line 10). Add your field:
```javascript
myCustomField: { label: 'My Field', type: 'text', required: false }
```
The UI auto-updates!

## 🔥 Next Steps
1. Delete the sample jobs (click Delete button on each)
2. Add your real job applications
3. Upload your resume
4. Customize social links in Settings
5. Start tracking your job search journey!

---

**Enjoy DevTracker! Happy job hunting! 🚀**
