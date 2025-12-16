# DevTracker Backend API

Complete Node.js + Express + MongoDB backend for DevTracker application.

## 📦 Features

- ✅ User Authentication (JWT)
- ✅ Secure password hashing (bcrypt)
- ✅ Job CRUD operations
- ✅ Project management
- ✅ Settings & social links
- ✅ Resume upload support
- ✅ Rate limiting & security headers
- ✅ Data persistence forever

## 🚀 Quick Start

### Prerequisites

1. **Node.js** (v16 or higher)
   - Download: https://nodejs.org/
   - Check version: `node --version`

2. **MongoDB** (Choose one option):
   
   **Option A: Local MongoDB**
   - Download: https://www.mongodb.com/try/download/community
   - Install and start MongoDB service
   
   **Option B: MongoDB Atlas (Cloud - Recommended)**
   - Sign up: https://www.mongodb.com/cloud/atlas/register
   - Create a free cluster
   - Get connection string (looks like: `mongodb+srv://...`)

### Installation Steps

1. **Install Dependencies**
   ```powershell
   cd "c:\Users\DELL\OneDrive\Desktop\JOB TRACKING app\backend"
   npm install
   ```

2. **Configure Environment**
   
   Edit `.env` file and update:
   
   For **Local MongoDB**:
   ```
   MONGODB_URI=mongodb://localhost:27017/devtracker
   ```
   
   For **MongoDB Atlas** (Cloud):
   ```
   MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster.mongodb.net/devtracker
   ```
   
   Also change the JWT_SECRET to a random string:
   ```
   JWT_SECRET=your-random-secret-key-here-make-it-long-and-complex
   ```

3. **Start the Server**
   ```powershell
   npm start
   ```
   
   For development with auto-restart:
   ```powershell
   npm run dev
   ```

4. **Verify Server is Running**
   
   Open browser and go to: http://localhost:5000/api/health
   
   You should see:
   ```json
   {
     "status": "ok",
     "message": "DevTracker API is running"
   }
   ```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Jobs
- `GET /api/jobs` - Get all jobs (protected)
- `GET /api/jobs/:id` - Get single job (protected)
- `POST /api/jobs` - Create job (protected)
- `PUT /api/jobs/:id` - Update job (protected)
- `DELETE /api/jobs/:id` - Delete job (protected)
- `POST /api/jobs/bulk` - Import multiple jobs (protected)

### Projects
- `GET /api/projects` - Get all projects (protected)
- `POST /api/projects` - Create project (protected)
- `PUT /api/projects/:id` - Update project (protected)
- `DELETE /api/projects/:id` - Delete project (protected)

### Settings
- `GET /api/settings` - Get user settings (protected)
- `PUT /api/settings` - Update settings (protected)

### Resume
- `POST /api/resume/upload` - Upload resume (protected)
- `GET /api/resume/download` - Download resume (protected)

## 🔐 Authentication

All protected routes require a JWT token in the Authorization header:

```
Authorization: Bearer YOUR_JWT_TOKEN
```

## 🧪 Testing the API

You can test endpoints using:
- **Postman**: https://www.postman.com/downloads/
- **Thunder Client** (VS Code extension)
- **curl** commands

### Example: Register a User

```powershell
curl -X POST http://localhost:5000/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"John Doe\",\"email\":\"john@example.com\",\"password\":\"password123\"}'
```

### Example: Login

```powershell
curl -X POST http://localhost:5000/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"john@example.com\",\"password\":\"password123\"}'
```

Copy the `token` from the response and use it for protected routes.

## 📁 Project Structure

```
backend/
├── models/           # MongoDB schemas
│   ├── User.js
│   ├── Job.js
│   ├── Project.js
│   └── Settings.js
├── routes/           # API route handlers
│   ├── auth.js
│   ├── jobs.js
│   ├── projects.js
│   ├── settings.js
│   └── resume.js
├── middleware/       # Custom middleware
│   └── auth.js       # JWT authentication
├── .env             # Environment variables
├── server.js        # Express server setup
└── package.json     # Dependencies
```

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | development |
| `PORT` | Server port | 5000 |
| `MONGODB_URI` | MongoDB connection string | mongodb://localhost:27017/devtracker |
| `JWT_SECRET` | Secret key for JWT | (change this!) |
| `JWT_EXPIRE` | Token expiration time | 30d |
| `FRONTEND_URL` | Frontend URL for CORS | http://127.0.0.1:5500 |
| `MAX_FILE_SIZE` | Max upload size in bytes | 10485760 (10MB) |

## 🚨 Important Notes

1. **Security**: 
   - Change `JWT_SECRET` in production to a long random string
   - Never commit `.env` file to Git
   - Use HTTPS in production

2. **CORS**: 
   - Update `FRONTEND_URL` in `.env` to match your frontend URL
   - For production, use your deployed frontend URL

3. **Database**: 
   - MongoDB must be running before starting the server
   - Data is stored in the `devtracker` database
   - Collections: users, jobs, projects, settings

4. **Rate Limiting**: 
   - Default: 100 requests per 15 minutes per IP
   - Adjust in `server.js` if needed

## 📚 Next Steps

After backend is running:

1. Update frontend to use API instead of localStorage
2. Implement login/signup UI
3. Store JWT token in localStorage
4. Make API calls for all CRUD operations
5. Add loading states and error handling

## 🐛 Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution**: Make sure MongoDB is running. Start MongoDB service or use MongoDB Atlas.

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Change PORT in `.env` or kill the process using port 5000.

### JWT Expired
```
Error: jwt expired
```
**Solution**: Login again to get a new token.

## 📞 Support

If you encounter issues:
1. Check server logs in terminal
2. Verify MongoDB connection
3. Ensure all dependencies are installed
4. Check `.env` configuration

## 🎉 Success Indicators

✅ Server starts without errors  
✅ MongoDB connects successfully  
✅ Health check endpoint responds  
✅ Can register and login users  
✅ Can create/read/update/delete jobs  

---

**Your data is now stored in MongoDB and will persist forever!** 🎊
