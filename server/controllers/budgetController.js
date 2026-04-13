const db = require('../db/database');

const BUDGET_WITH_COMPUTED = `
  SELECT
    b.id, b.user_id, b.title, b.category, b.limit_amount, b.period, b.created_at,
    COALESCE(SUM(t.amount), 0)                                          AS used,
    b.limit_amount - COALESCE(SUM(t.amount), 0)                        AS remaining,
    ROUND(COALESCE(SUM(t.amount), 0) / b.limit_amount * 100, 1)        AS progress
  FROM budgets b
  LEFT JOIN transactions t
    ON  t.user_id  = b.user_id
    AND t.category = b.category
    AND t.type     = 'expense'
    AND strftime('%Y-%m', t.date) = strftime('%Y-%m', 'now')
  WHERE b.user_id = ?
  GROUP BY b.id
  ORDER BY b.created_at DESC
`;

function getAll(req, res) {
  try {
    const budgets = db.prepare(BUDGET_WITH_COMPUTED).all(req.user.id);
    res.json({ success: true, data: { budgets } });
  } catch (error) {
    console.error('Error fetching budgets:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch budgets' });
  }
}

function create(req, res) {
  try {
    const { title, category, limit_amount, period = 'monthly' } = req.body;
    const userId = req.user.id;

    const result = db.prepare(`
      INSERT INTO budgets (user_id, title, category, limit_amount, period)
      VALUES (?, ?, ?, ?, ?)
    `).run(userId, title, category, limit_amount, period);

    const budget = db
      .prepare(`${BUDGET_WITH_COMPUTED.replace('WHERE b.user_id = ?', 'WHERE b.id = ? AND b.user_id = ?')}`)
      .get(result.lastInsertRowid, userId);
    res.status(201).json({ success: true, data: { budget } });
  } catch (error) {
    console.error('Error creating budget:', error);
    res.status(500).json({ success: false, error: 'Failed to create budget' });
  }
}

function update(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existing = db
      .prepare('SELECT id FROM budgets WHERE id = ? AND user_id = ?')
      .get(id, userId);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Budget not found' });
    }

    const { title, category, limit_amount, period } = req.body;

    db.prepare(`
      UPDATE budgets
      SET title        = COALESCE(?, title),
          category     = COALESCE(?, category),
          limit_amount = COALESCE(?, limit_amount),
          period       = COALESCE(?, period)
      WHERE id = ? AND user_id = ?
    `).run(title ?? null, category ?? null, limit_amount ?? null, period ?? null, id, userId);

    const budget = db
      .prepare(`${BUDGET_WITH_COMPUTED.replace('WHERE b.user_id = ?', 'WHERE b.id = ? AND b.user_id = ?')}`)
      .get(id, userId);
    res.json({ success: true, data: { budget } });
  } catch (error) {
    console.error('Error updating budget:', error);
    res.status(500).json({ success: false, error: 'Failed to update budget' });
  }
}

function remove(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = db
      .prepare('DELETE FROM budgets WHERE id = ? AND user_id = ?')
      .run(id, userId);

    if (result.changes === 0) {
      return res.status(404).json({ success: false, error: 'Budget not found' });
    }
    res.json({ success: true, data: { message: 'Budget deleted' } });
  } catch (error) {
    console.error('Error deleting budget:', error);
    res.status(500).json({ success: false, error: 'Failed to delete budget' });
  }
}

module.exports = { getAll, create, update, remove, BUDGET_WITH_COMPUTED };
