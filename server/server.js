require('dotenv').config();

const express = require('express');
const session = require('express-session');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// 1. Secure HTTP headers
app.use(helmet());

// 2. CORS — locked to frontend origin
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));

// 3. Body parsing
app.use(express.json());

// 4. Session
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
  },
}));

// 5. Rate limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 10 : 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests, please try again later.' },
});

// 6. Routes
app.use('/api/auth',         authLimiter, require('./routes/authRoutes'));
app.use('/api/transactions', require('./routes/transactionRoutes'));
app.use('/api/budgets',      require('./routes/budgetRoutes'));
app.use('/api/goals',        require('./routes/goalRoutes'));
app.use('/api/dashboard',    require('./routes/dashboardRoutes'));
app.use('/api/insights',     require('./routes/insightsRoutes'));
app.use('/api/settings',     require('./routes/settingsRoutes'));
app.use('/api/requests',     require('./routes/requestRoutes'));

// 7. 404
app.use((req, res) => {
  res.status(404).json({ success: false, error: 'Route not found' });
});

// 8. Centralized error handler (must be last)
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`CentSora server running on http://localhost:${PORT}`);
});
