const bcrypt = require('bcrypt');
const db = require('../db/database');

const SALT_ROUNDS = 12;

async function register(req, res) {
  const { name, email, password } = req.body;

  const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
  if (existing) {
    return res.status(409).json({ success: false, error: 'Email already in use' });
  }

  const hash = await bcrypt.hash(password, SALT_ROUNDS);

  const insertUser = db.prepare(
    'INSERT INTO users (name, email, password) VALUES (?, ?, ?)'
  );
  const insertPrefs = db.prepare(
    'INSERT INTO user_preferences (user_id) VALUES (?)'
  );

  const run = db.transaction(() => {
    const result = insertUser.run(name, email, hash);
    insertPrefs.run(result.lastInsertRowid);
    return result.lastInsertRowid;
  });

  const userId = run();
  const user = db
    .prepare('SELECT id, name, email, role FROM users WHERE id = ?')
    .get(userId);

  req.session.userId = user.id;
  res.status(201).json({ success: true, data: { user } });
}

async function login(req, res) {
  const { email, password } = req.body;

  const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Invalid email or password' });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    return res.status(401).json({ success: false, error: 'Invalid email or password' });
  }

  req.session.userId = user.id;
  res.json({
    success: true,
    data: {
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    },
  });
}

function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ success: false, error: 'Could not log out' });
    }
    res.clearCookie('connect.sid');
    res.json({ success: true, data: { message: 'Logged out' } });
  });
}

function me(req, res) {
  res.json({ success: true, data: { user: req.user } });
}

function getAllUsers(req, res) {
  const users = db.prepare('SELECT id, name, email, role FROM users').all();
  res.json({ success: true, data: { users } });
}

module.exports = { register, login, logout, me, getAllUsers };
