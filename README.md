CentSora – Personal Finance & Budgeting Web App
=============================================

Overview
--------
CentSora is a personal finance and budgeting web application that helps users track income, expenses, category budgets, and savings goals. The app also includes dashboard visualizations and a trusted approval feature for extra spending requests.

Main planned features:
- Landing page
- Register / Login
- Dashboard with financial summaries
- Transactions page
- Budget management
- Savings goals
- Financial insights / charts
- Settings page
- Trusted approval / request workflow

Tech Stack
----------
Frontend:
- Vue 3
- Vite
- Vue Router
- Bootstrap
- D3.js
- jQuery
- Axios
- AJAX

Backend:
- Node.js
- Express.js
- express-session
- bcrypt
- better-sqlite3
- dotenv
- cors

Project Structure
-----------------
```text
web-dev-proj/
├── package.json
├── README.md
├── client/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.js
│       ├── App.vue
│       ├── style.css
│       ├── assets/
│       │   ├── pictures/
│       │   └── styles/
│       │       └── main.css
│       ├── components/
│       │   ├── AddGoalModal.vue
│       │   ├── AddTransactionModal.vue
│       │   ├── AppNavbar.vue
│       │   ├── ApprovalRequestModal.vue
│       │   ├── BudgetCard.vue
│       │   ├── BudgetVsActualChart.vue
│       │   ├── ConfettiBurst.vue
│       │   ├── EditGoalModal.vue
│       │   ├── GoalCard.vue
│       │   ├── SpendingLineChart.vue
│       │   ├── SpendingPieChart.vue
│       │   ├── SummaryCard.vue
│       │   └── TransactionTable.vue
│       ├── pages/
│       │   ├── BudgetsPage.vue
│       │   ├── DashboardPage.vue
│       │   ├── GoalPage.vue
│       │   ├── LandingPage.vue
│       │   ├── LoginPage.vue
│       │   ├── RegisterPage.vue
│       │   ├── SettingsPage.vue
│       │   ├── TransactionsPage.vue
│       │   └── WelcomePage.vue
│       ├── router/
│       │   └── index.js
│       ├── services/
│       │   └── api.js
│       ├── stores/
│       │   ├── auth.js
│       │   └── darkMode.js
│       └── utils/
│           └── confettiUtils.js
├── server/
│   ├── package.json
│   ├── server.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── budgetController.js
│   │   ├── dashboardController.js
│   │   ├── goalController.js
│   │   ├── requestController.js
│   │   ├── settingsController.js
│   │   └── transactionController.js
│   ├── data/
│   ├── db/
│   │   ├── database.js
│   │   └── init.sql
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── roleMiddleware.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── budgetRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── goalRoutes.js
│   │   ├── requestRoutes.js
│   │   ├── routeHelpers.js
│   │   ├── settingsRoutes.js
│   │   └── transactionRoutes.js
│   └── seed/
│       └── seedData.js
└── docs/
    ├── group_members.html
    ├── contributions.txt
    ├── readme.txt
    └── ai-prompts.txt
```

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

> **Note:** If `nodemon` is not installed, use `node server.js` instead.

How the App Works
-----------------
1. **Frontend** (Vue 3 + Vite) runs on `localhost:5173`
2. **Backend** (Express.js) runs on `localhost:3000`
3. Frontend communicates with backend via **Axios API requests**
4. Backend handles:
   - User authentication & sessions
   - Transaction management
   - Budget tracking & calculations
   - Savings goals
   - Financial approval workflow
5. **SQLite database** stores all user data in `server/data/centsora.db`

Important Libraries
-------------------
**Frontend:**
- **Vue 3** – Progressive JavaScript framework for building UI
- **Vite** – Fast frontend tooling & build system
- **Vue Router** – Client-side routing between pages
- **Axios** – HTTP client for API requests
- **Bootstrap** – CSS framework for responsive layout & styling
- **D3.js** – Data visualization for charts and graphs
- **jQuery** – DOM manipulation and utilities

**Backend:**
- **Express.js** – Web framework for creating REST API
- **CORS** – Enables cross-origin requests between frontend & backend
- **express-session** – User session management & authentication
- **bcrypt** – Password hashing & security
- **better-sqlite3** – SQLite database driver
- **dotenv** – Environment variable management
- **nodemon** – Auto-restarts server during development

Notes
-----
- SQLite database file is automatically created at `server/data/centsora.db` on first run
- User session data is stored server-side via `express-session`
- Passwords are hashed with bcrypt before storage (never stored in plain text)
- Frontend uses `Pinia-like` store pattern for authentication state
- Responsive design works on desktop, tablet, and mobile devices


Development Notes
-----------------
This project demonstrates:
- **HTML & SVG** – Page structure & scalable graphics
- **CSS & Bootstrap** – Responsive styling & component framework
- **JavaScript & jQuery** – DOM manipulation & utilities
- **Vue 3** – Modern reactive framework & component architecture
- **Vue Router** – Client-side routing & navigation
- **D3.js** – Data-driven visualizations & charts
- **Node.js & Express.js** – Backend server & REST API
- **SQLite** – Relational database design & queries
- **Authentication** – Session management & password security
- **AJAX/Fetch** – Asynchronous API communication

