Installation
------------
**Prerequisites:**
Make sure you have Node.js (v16+) and npm installed on your computer.

**Step 1: Install Frontend Dependencies**
```bash
cd client
npm install
npm install axios vue-router bootstrap d3 jquery
```

**Frontend Libraries Installed:**
- `vue` – Vue 3 framework
- `vue-router` – Client-side routing
- `axios` – HTTP client for API requests
- `bootstrap` – CSS framework
- `d3` – Data visualization
- `jquery` – DOM manipulation
- `vite` – Build tool

**Step 2: Install Backend Dependencies**
```bash
cd ../server
npm install
npm install express cors express-session bcrypt better-sqlite3 dotenv
npm install --save-dev nodemon
```

**Backend Libraries Installed:**
- `express` – Web framework
- `cors` – Cross-origin support
- `express-session` – Session management
- `bcrypt` – Password hashing
- `better-sqlite3` – SQLite database driver
- `dotenv` – Environment variables
- `nodemon` – Development auto-reload (dev dependency)

Running the Application
-----------------------
The frontend and backend must run in separate terminal sessions.

**Terminal 1 – Start the Frontend:**
```bash
cd client
npm run dev
```
Frontend will be available at: **http://localhost:5173**

**Terminal 2 – Start the Backend:**
```bash
cd server
npx nodemon server.js
```
Backend will be available at: **http://localhost:3000**
