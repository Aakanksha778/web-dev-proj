const db = require('../db/database');

function getProfile(req, res) {
  const user = db
    .prepare('SELECT name, email, timezone FROM users WHERE id = ?')
    .get(req.user.id);
  res.json({ success: true, data: { profile: user } });
}

function updateProfile(req, res) {
  const { name, email, timezone } = req.body;
  const userId = req.user.id;

  if (email && email !== req.user.email) {
    const existing = db
      .prepare('SELECT id FROM users WHERE email = ? AND id != ?')
      .get(email, userId);
    if (existing) {
      return res.status(409).json({ success: false, error: 'Email already in use' });
    }
  }

  db.prepare(`
    UPDATE users
    SET name     = COALESCE(?, name),
        email    = COALESCE(?, email),
        timezone = COALESCE(?, timezone)
    WHERE id = ?
  `).run(name ?? null, email ?? null, timezone ?? null, userId);

  const updated = db
    .prepare('SELECT name, email, timezone FROM users WHERE id = ?')
    .get(userId);
  res.json({ success: true, data: { profile: updated } });
}

function getPreferences(req, res) {
  const prefs = db
    .prepare('SELECT notifications, auto_budget, dark_mode FROM user_preferences WHERE user_id = ?')
    .get(req.user.id);
  res.json({ success: true, data: { preferences: prefs } });
}

function updatePreferences(req, res) {
  const { notifications, auto_budget, dark_mode } = req.body;
  const userId = req.user.id;

  db.prepare(`
    UPDATE user_preferences
    SET notifications = COALESCE(?, notifications),
        auto_budget   = COALESCE(?, auto_budget),
        dark_mode     = COALESCE(?, dark_mode)
    WHERE user_id = ?
  `).run(
    notifications !== undefined ? (notifications ? 1 : 0) : null,
    auto_budget   !== undefined ? (auto_budget   ? 1 : 0) : null,
    dark_mode     !== undefined ? (dark_mode     ? 1 : 0) : null,
    userId
  );

  const updated = db
    .prepare('SELECT notifications, auto_budget, dark_mode FROM user_preferences WHERE user_id = ?')
    .get(userId);
  res.json({ success: true, data: { preferences: updated } });
}

module.exports = { getProfile, updateProfile, getPreferences, updatePreferences };
