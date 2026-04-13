const db = require('../db/database');

function getAll(req, res) {
  try {
    const userId = req.user.id;
    const { category, status, from, to, page = 1, limit = 20 } = req.query;

    let where = 'WHERE user_id = ?';
    const params = [userId];

    if (category) { where += ' AND category = ?'; params.push(category); }
    if (status)   { where += ' AND status = ?';   params.push(status); }
    if (from)     { where += ' AND date >= ?';     params.push(from); }
    if (to)       { where += ' AND date <= ?';     params.push(to); }

    const offset = (Number(page) - 1) * Number(limit);

    const total = db
      .prepare(`SELECT COUNT(*) AS count FROM transactions ${where}`)
      .get(...params).count;

    const transactions = db
      .prepare(`SELECT * FROM transactions ${where} ORDER BY date DESC, id DESC LIMIT ? OFFSET ?`)
      .all(...params, Number(limit), offset);

    res.json({ success: true, data: { transactions, total, page: Number(page), limit: Number(limit) } });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch transactions' });
  }
}

function create(req, res) {
  try {
    const { description, category, amount, type, status = 'pending', date } = req.body;
    const userId = req.user.id;

    // Convert ISO date to just the date part for consistency
    const dateOnly = typeof date === 'string' ? date.split('T')[0] : date;

    const result = db.prepare(`
      INSERT INTO transactions (user_id, description, category, amount, type, status, date)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(userId, description, category, amount, type, status, dateOnly);

    const transaction = db
      .prepare('SELECT * FROM transactions WHERE id = ?')
      .get(result.lastInsertRowid);
    res.status(201).json({ success: true, data: { transaction } });
  } catch (error) {
    console.error('Error creating transaction:', error);
    res.status(500).json({ success: false, error: 'Failed to create transaction' });
  }
}

function update(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const existing = db
      .prepare('SELECT id FROM transactions WHERE id = ? AND user_id = ?')
      .get(id, userId);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Transaction not found' });
    }

    const { description, category, amount, type, status, date } = req.body;
    const dateOnly = date ? (typeof date === 'string' ? date.split('T')[0] : date) : null;

    db.prepare(`
      UPDATE transactions
      SET description = COALESCE(?, description),
          category    = COALESCE(?, category),
          amount      = COALESCE(?, amount),
          type        = COALESCE(?, type),
          status      = COALESCE(?, status),
          date        = COALESCE(?, date)
      WHERE id = ? AND user_id = ?
    `).run(
      description ?? null, category ?? null, amount ?? null,
      type ?? null, status ?? null, dateOnly ?? null,
      id, userId
    );

    const transaction = db.prepare('SELECT * FROM transactions WHERE id = ?').get(id);
    res.json({ success: true, data: { transaction } });
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ success: false, error: 'Failed to update transaction' });
  }
}

function remove(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = db
      .prepare('DELETE FROM transactions WHERE id = ? AND user_id = ?')
      .run(id, userId);

    if (result.changes === 0) {
      return res.status(404).json({ success: false, error: 'Transaction not found' });
    }
    res.json({ success: true, data: { message: 'Transaction deleted' } });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ success: false, error: 'Failed to delete transaction' });
  }
}

module.exports = { getAll, create, update, remove };
