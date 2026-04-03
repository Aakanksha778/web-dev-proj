const db = require('../db/database');

function getAll(req, res) {
  const goals = db.prepare(`
    SELECT id, title, description, target, saved,
           ROUND(saved / target * 100, 1) AS progress,
           created_at
    FROM goals
    WHERE user_id = ?
    ORDER BY created_at DESC
  `).all(req.user.id);
  res.json({ success: true, data: { goals } });
}

function create(req, res) {
  const { title, description = '', target, saved = 0 } = req.body;
  const userId = req.user.id;

  const result = db.prepare(`
    INSERT INTO goals (user_id, title, description, target, saved)
    VALUES (?, ?, ?, ?, ?)
  `).run(userId, title, description, target, saved);

  const goal = db.prepare(`
    SELECT id, title, description, target, saved,
           ROUND(saved / target * 100, 1) AS progress, created_at
    FROM goals WHERE id = ?
  `).get(result.lastInsertRowid);

  res.status(201).json({ success: true, data: { goal } });
}

function update(req, res) {
  const { id } = req.params;
  const userId = req.user.id;

  const existing = db
    .prepare('SELECT id FROM goals WHERE id = ? AND user_id = ?')
    .get(id, userId);
  if (!existing) {
    return res.status(404).json({ success: false, error: 'Goal not found' });
  }

  const { title, description, target, saved } = req.body;

  db.prepare(`
    UPDATE goals
    SET title       = COALESCE(?, title),
        description = COALESCE(?, description),
        target      = COALESCE(?, target),
        saved       = COALESCE(?, saved)
    WHERE id = ? AND user_id = ?
  `).run(title ?? null, description ?? null, target ?? null, saved ?? null, id, userId);

  const goal = db.prepare(`
    SELECT id, title, description, target, saved,
           ROUND(saved / target * 100, 1) AS progress, created_at
    FROM goals WHERE id = ?
  `).get(id);

  res.json({ success: true, data: { goal } });
}

function remove(req, res) {
  const { id } = req.params;
  const userId = req.user.id;

  const result = db
    .prepare('DELETE FROM goals WHERE id = ? AND user_id = ?')
    .run(id, userId);

  if (result.changes === 0) {
    return res.status(404).json({ success: false, error: 'Goal not found' });
  }
  res.json({ success: true, data: { message: 'Goal deleted' } });
}

module.exports = { getAll, create, update, remove };
