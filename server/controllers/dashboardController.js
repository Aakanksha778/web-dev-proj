const db = require('../db/database');

function getSummary(req, res) {
  const userId = req.user.id;
  const currentMonth = new Date().toISOString().slice(0, 7); // 'YYYY-MM'

  const balanceRow = db.prepare(`
    SELECT
      SUM(CASE WHEN type = 'income'  THEN amount ELSE 0 END) -
      SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS net_balance
    FROM transactions WHERE user_id = ?
  `).get(userId);

  const monthlyRow = db.prepare(`
    SELECT
      SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS monthly_spend,
      SUM(CASE WHEN type = 'income'  THEN amount ELSE 0 END) AS monthly_income
    FROM transactions
    WHERE user_id = ? AND strftime('%Y-%m', date) = ?
  `).get(userId, currentMonth);

  const goalsRow = db.prepare(`
    SELECT COALESCE(SUM(target), 0) AS total_target,
           COALESCE(SUM(saved),  0) AS total_saved
    FROM goals WHERE user_id = ?
  `).get(userId);

  const budgetCount = db.prepare(
    'SELECT COUNT(*) AS count FROM budgets WHERE user_id = ?'
  ).get(userId).count;

  const totalTarget = goalsRow.total_target || 0;
  const totalSaved  = goalsRow.total_saved  || 0;

  res.json({
    success: true,
    data: {
      net_balance:    Math.round((balanceRow.net_balance  || 0) * 100) / 100,
      monthly_spend:  Math.round((monthlyRow.monthly_spend || 0) * 100) / 100,
      monthly_income: Math.round((monthlyRow.monthly_income || 0) * 100) / 100,
      savings_goal: {
        total_target: totalTarget,
        total_saved:  totalSaved,
        progress:     totalTarget > 0 ? Math.round((totalSaved / totalTarget) * 100) : 0,
      },
      active_budgets: budgetCount,
    },
  });
}

function getSpendingTrend(req, res) {
  const userId = req.user.id;

  const rows = db.prepare(`
    SELECT
      strftime('%Y-%m', date)                                   AS month,
      SUM(CASE WHEN type = 'income'  THEN amount ELSE 0 END)   AS income,
      SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END)   AS expenses
    FROM transactions
    WHERE user_id = ?
      AND date >= date('now', '-5 months', 'start of month')
    GROUP BY month
    ORDER BY month ASC
  `).all(userId);

  res.json({ success: true, data: { trend: rows } });
}

function getCategorySplit(req, res) {
  const userId = req.user.id;
  const currentMonth = new Date().toISOString().slice(0, 7);

  const rows = db.prepare(`
    SELECT category, SUM(amount) AS amount
    FROM transactions
    WHERE user_id = ? AND type = 'expense'
      AND strftime('%Y-%m', date) = ?
    GROUP BY category
    ORDER BY amount DESC
  `).all(userId, currentMonth);

  const total = rows.reduce((sum, r) => sum + r.amount, 0);
  const categories = rows.map((r) => ({
    name:    r.category,
    amount:  Math.round(r.amount * 100) / 100,
    percent: total > 0 ? Math.round((r.amount / total) * 1000) / 10 : 0,
  }));

  res.json({ success: true, data: { categories, total: Math.round(total * 100) / 100 } });
}

function getBudgetVsActual(req, res) {
  const userId = req.user.id;

  const items = db.prepare(`
    SELECT
      b.category,
      b.limit_amount                                                AS budget,
      COALESCE(SUM(t.amount), 0)                                   AS actual,
      ROUND(COALESCE(SUM(t.amount), 0) / b.limit_amount * 100, 1) AS percent
    FROM budgets b
    LEFT JOIN transactions t
      ON  t.user_id  = b.user_id
      AND t.category = b.category
      AND t.type     = 'expense'
      AND strftime('%Y-%m', t.date) = strftime('%Y-%m', 'now')
    WHERE b.user_id = ?
    GROUP BY b.id
    ORDER BY percent DESC
  `).all(userId);

  res.json({ success: true, data: { items } });
}

module.exports = { getSummary, getSpendingTrend, getCategorySplit, getBudgetVsActual };
