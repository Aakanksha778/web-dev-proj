const db = require('../db/database');

function authenticate(req, res, next) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ success: false, error: 'Not authenticated' });
  }

  const user = db
    .prepare('SELECT id, name, email, role, timezone FROM users WHERE id = ?')
    .get(req.session.userId);

  if (!user) {
    req.session.destroy(() => {});
    return res.status(401).json({ success: false, error: 'Not authenticated' });
  }

  req.user = user;
  next();
}

module.exports = { authenticate };
