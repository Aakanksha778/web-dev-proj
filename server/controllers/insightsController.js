const db = require('../db/database');

function getInsights(req, res) {
  const userId = req.user.id;
  const currentMonth = new Date().toISOString().slice(0, 7);
  const lastMonth = new Date(new Date().setMonth(new Date().getMonth() - 1))
    .toISOString()
    .slice(0, 7);

  // Top spending category this month
  const categoryRows = db.prepare(`
    SELECT category, SUM(amount) AS amount
    FROM transactions
    WHERE user_id = ? AND type = 'expense'
      AND strftime('%Y-%m', date) = ?
    GROUP BY category
    ORDER BY amount DESC
  `).all(userId, currentMonth);

  const totalVariable = categoryRows.reduce((s, r) => s + r.amount, 0);
  const topCategory = categoryRows[0] || null;

  // Savings momentum: compare income this month vs last month
  const savingsThis = db.prepare(`
    SELECT COALESCE(SUM(amount), 0) AS total
    FROM transactions
    WHERE user_id = ? AND type = 'income'
      AND strftime('%Y-%m', date) = ?
  `).get(userId, currentMonth).total;

  const savingsLast = db.prepare(`
    SELECT COALESCE(SUM(amount), 0) AS total
    FROM transactions
    WHERE user_id = ? AND type = 'income'
      AND strftime('%Y-%m', date) = ?
  `).get(userId, lastMonth).total;

  const changePercent = savingsLast > 0
    ? Math.round(((savingsThis - savingsLast) / savingsLast) * 100)
    : null;

  // Monthly activity totals
  const activityRow = db.prepare(`
    SELECT
      SUM(CASE WHEN type = 'income'  THEN amount ELSE 0 END) AS income,
      SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END) AS expenses
    FROM transactions
    WHERE user_id = ? AND strftime('%Y-%m', date) = ?
  `).get(userId, currentMonth);

  res.json({
    success: true,
    data: {
      top_category: topCategory
        ? {
            name:                topCategory.category,
            amount:              Math.round(topCategory.amount * 100) / 100,
            percent_of_variable: totalVariable > 0
              ? Math.round((topCategory.amount / totalVariable) * 100)
              : 0,
          }
        : null,
      savings_momentum: {
        this_month_income: Math.round(savingsThis * 100) / 100,
        last_month_income: Math.round(savingsLast * 100) / 100,
        change_percent:    changePercent,
      },
      monthly_activity: {
        income:   Math.round((activityRow.income   || 0) * 100) / 100,
        expenses: Math.round((activityRow.expenses || 0) * 100) / 100,
      },
    },
  });
}

module.exports = { getInsights };
