# STEP-BY-STEP SETUP GUIDE

## 🎯 Goal
Connect your DevTracker frontend to a persistent MongoDB database so your data **never gets lost**.

---

## ⚡ Quick Setup (5 steps)

### Step 1: Install Node.js

**Check if you have Node.js:**
```powershell
node --version
```

If you get a version number (v16 or higher), skip to Step 2.

**If not installed:**
1. Download from: https://nodejs.org/
2. Install LTS version (left button)
3. Restart PowerShell
4. Verify: `node --version`

---

### Step 2: Choose Your Database

**Option A: MongoDB Atlas (Cloud - EASIEST, RECOMMENDED)**

1. Go to: https://www.mongodb.com/cloud/atlas/register
2. Sign up (free forever)
3. Create a free cluster:
   - Click "Build a Database"
   - Choose "FREE" (M0)
   - Pick a region close to you
   - Click "Create"
4. Create a database user:
   - Click "Database Access" (left menu)
   - Click "Add New Database User"
   - Username: `devtracker`
   - Password: (auto-generate and SAVE IT!)
   - Click "Add User"
5. Allow network access:
   - Click "Network Access" (left menu)
   - Click "Add IP Address"
   - Click "Allow Access From Anywhere" (for development)
   - Click "Confirm"
6. Get connection string:
   - Click "Database" (left menu)
   - Click "Connect" on your cluster
   - Click "Connect your application"
   - Copy the connection string (starts with `mongodb+srv://...`)
   - **SAVE THIS!** You'll need it in Step 3

**Option B: Local MongoDB (Advanced)**
1. Download: https://www.mongodb.com/try/download/community
2. Install MongoDB Community Server
3. Start MongoDB service
4. Connection string: `mongodb://localhost:27017/devtracker`

---

### Step 3: Install Backend Dependencies

**Open PowerShell and run:**

```powershell
cd "c:\Users\DELL\OneDrive\Desktop\JOB TRACKING app\backend"
npm install
```

Wait for installation to complete (2-3 minutes).

---

### Step 4: Configure Environment

**Edit the `.env` file** in `backend` folder:

1. Open: `c:\Users\DELL\OneDrive\Desktop\JOB TRACKING app\backend\.env`
2. Update these lines:

```env
# If using MongoDB Atlas (Cloud):
MONGODB_URI=mongodb+srv://devtracker:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/devtracker

# If using Local MongoDB:
MONGODB_URI=mongodb://localhost:27017/devtracker

# Change this to a random secret (important for security!):
JWT_SECRET=my-super-secret-random-key-12345-change-this

# Your frontend URL (keep as is for local development):
FRONTEND_URL=http://127.0.0.1:5500
```

**Replace:**
- `YOUR_PASSWORD` with your MongoDB Atlas password
- `cluster0.xxxxx` with your actual cluster URL (from Atlas connection string)
- `JWT_SECRET` with any random string (at least 32 characters)

**Save the file!**

---

### Step 5: Start the Backend Server

**In PowerShell:**

```powershell
cd "c:\Users\DELL\OneDrive\Desktop\JOB TRACKING app\backend"
npm start
```

**You should see:**
```
╔════════════════════════════════════════╗
║   🚀 DevTracker API Server Running    ║
║   📡 Port: 5000                        ║
║   🌍 Environment: development          ║
╚════════════════════════════════════════╝
✅ MongoDB Connected Successfully
```

**Success!** Keep this PowerShell window open while using the app.

---

## ✅ Verify Backend is Working

**Open browser and visit:**
```
http://localhost:5000/api/health
```

**You should see:**
```json
{
  "status": "ok",
  "message": "DevTracker API is running",
  "timestamp": "2025-10-27T..."
}
```

✅ **Perfect!** Your backend is ready.

---

## 🔄 Next: Connect Frontend to Backend

Now you need to update your frontend `app.js` to use the API instead of localStorage.

**I'll create the updated frontend integration code in the next step.**

Would you like me to:
1. Create the frontend API integration code?
2. Add login/signup UI to your existing app?
3. Migrate your existing localStorage data to the backend?

---

## 📝 Daily Usage

**Every time you want to use DevTracker:**

1. Start backend server (if not running):
   ```powershell
   cd "c:\Users\DELL\OneDrive\Desktop\JOB TRACKING app\backend"
   npm start
   ```

2. Open `index.html` in your browser (as usual)

3. Your data now persists in MongoDB! 🎉

---

## 🐛 Common Issues

### Issue: "Cannot find module"
**Solution:**
```powershell
npm install
```

### Issue: "MongoDB connection failed"
**Solution:**
- Check `.env` has correct `MONGODB_URI`
- If using Atlas, verify IP whitelist includes your IP
- If local, ensure MongoDB service is running

### Issue: "Port 5000 already in use"
**Solution:**
```powershell
# Kill the process
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force

# Or change port in .env:
PORT=5001
```

### Issue: "CORS error in browser console"
**Solution:**
- Verify `FRONTEND_URL` in `.env` matches your actual frontend URL
- Make sure backend server is running

---

## 🎉 What You've Achieved

✅ Professional backend API  
✅ Secure authentication system  
✅ MongoDB database (cloud or local)  
✅ Data persistence forever  
✅ Multi-device support ready  
✅ Scalable architecture  

**Your data will NEVER be lost again!** 🚀

---

## 📞 Need Help?

Run these diagnostic commands:

```powershell
# Check Node.js version
node --version

# Check if backend is running
curl http://localhost:5000/api/health

# View backend logs
# (check the PowerShell window where you ran `npm start`)
```

---

**Ready for the next step?** Let me know and I'll create the frontend integration! 🔥
