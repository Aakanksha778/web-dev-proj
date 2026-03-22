BUDMON – Personal Finance & Budgeting Web App
=============================================

Overview
--------
BUDMON is a personal finance and budgeting web application that helps users track income, expenses, category budgets, and savings goals. The app also includes dashboard visualizations and a trusted approval feature for extra spending requests.

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
   client/
      index.html
      package.json
      vite.config.js
      public/
      src/
         main.js
         App.vue
         style.css
         router/
            index.js
         assets/
            styles/
               main.css
            icons/
         components/
            AppNavbar.vue
            SummaryCard.vue
            TransactionTable.vue
            BudgetCard.vue
            GoalCard.vue
            ApprovalRequestModal.vue
            SpendingPieChart.vue
            SpendingLineChart.vue
            BudgetVsActualChart.vue
         pages/
            LandingPage.vue
            LoginPage.vue
            RegisterPage.vue
            DashboardPage.vue
            TransactionsPage.vue
            BudgetsPage.vue
            GoalsPage.vue
            InsightsPage.vue
            SettingsPage.vue
            ApprovalDashboardPage.vue
            RequestHistoryPage.vue
         services/
            api.js
   server/
      package.json
      server.js
      db/
         database.js
         init.sql
         (budmon.db and .env are generated at runtime)
      routes/
         authRoutes.js
         transactionRoutes.js
         budgetRoutes.js
         goalRoutes.js
         requestRoutes.js
         dashboardRoutes.js
         settingsRoutes.js
      controllers/
         authController.js
         transactionController.js
         budgetController.js
         goalController.js
         requestController.js
         dashboardController.js
         settingsController.js
      middleware/
         authMiddleware.js
         roleMiddleware.js
         errorMiddleware.js
      seed/
         seedData.js
   docs/
      group_members.html
      contributions.txt
      readme.txt
      ai-prompts.txt
   package.json
   README.md
```

Installation
------------
Important:
Make sure Node.js and npm are installed on your computer before running the project.

1. Open a terminal in the project root folder.

2. Install frontend dependencies:
   cd client
   npm install
   npm install axios vue-router bootstrap d3 jquery

3. Install backend dependencies:
   cd ..\server
   npm install
   npm install express cors express-session bcrypt better-sqlite3 dotenv
   npm install --save-dev nodemon

Running the Application
-----------------------
The client and server must be run in separate terminals.

Terminal 1 – Start the frontend:
   cd client
   npm run dev

Expected frontend URL:
   http://localhost:5173

Terminal 2 – Start the backend:
   cd server
   npx nodemon server.js

If nodemon does not work, use:
   node server.js

Expected backend URL:
   http://localhost:3000

How the App Works
-----------------
- The Vue frontend runs on localhost:5173
- The Express backend runs on localhost:3000
- The frontend sends AJAX/API requests to the backend
- The backend handles authentication, transactions, budgets, goals, requests, and dashboard data
- SQLite is used for data storage

Important Libraries
-------------------
Frontend:
- axios: used for API requests
- vue-router: used for navigation between pages
- bootstrap: used for layout and styling
- d3: used for dashboard and insights charts
- jquery: included for rubric coverage and DOM interactions

Backend:
- express: used to create the server and API routes
- cors: allows communication between frontend and backend
- express-session: handles login sessions
- bcrypt: hashes passwords securely
- better-sqlite3: connects the app to SQLite
- dotenv: stores environment variables
- nodemon: restarts the server automatically during development

Notes
-----
- If server.js is empty, the backend will not start correctly until code is added.
- If App.vue, main.js, and router/index.js are empty, the frontend will not behave correctly until starter code is added.
- The SQLite database file will be stored in server/db/budmon.db once the database is initialized.

Required Submission Files
-------------------------
The final submission should include:
- group_members.html
- contributions.txt
- readme.txt
- intro.mp4
- ai-prompts.txt

Development Notes
-----------------
This project is designed to demonstrate:
- HTML and SVG
- CSS and CSS framework usage
- JavaScript, jQuery, and D3
- Dynamic DOM updates
- AJAX / web services
- Node.js / Express.js
- Vue framework

Author / Group
--------------
Group name: [Add your group name here]
Course: [Add course code here]
Instructor: [Add instructor name here]
