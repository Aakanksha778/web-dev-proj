require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const bcrypt = require('bcrypt');
const db = require('../db/database');

function seed() {
  const run = db.transaction(() => {
    // Clear all tables (FK order matters)
    db.prepare('DELETE FROM spending_requests').run();
    db.prepare('DELETE FROM goals').run();
    db.prepare('DELETE FROM budgets').run();
    db.prepare('DELETE FROM transactions').run();
    db.prepare('DELETE FROM user_preferences').run();
    db.prepare('DELETE FROM users').run();

    // Users
    const hash1 = bcrypt.hashSync('admin123', 12);
    const hash2 = bcrypt.hashSync('approver456', 12);

    const u1 = db.prepare(
      'INSERT INTO users (name, email, password, role, timezone) VALUES (?, ?, ?, ?, ?)'
    ).run('Vibhavan', 'admin@centsora.com', hash1, 'user', 'America/New_York');

    const u2 = db.prepare(
      'INSERT INTO users (name, email, password, role, timezone) VALUES (?, ?, ?, ?, ?)'
    ).run('Avery Morgan', 'avery@centsora.com', hash2, 'approver', 'Europe/London');

    const uid  = u1.lastInsertRowid;
    const aid  = u2.lastInsertRowid;

    // Preferences
    db.prepare('INSERT INTO user_preferences (user_id, notifications, auto_budget, dark_mode) VALUES (?, 1, 0, 0)').run(uid);
    db.prepare('INSERT INTO user_preferences (user_id, notifications, auto_budget, dark_mode) VALUES (?, 1, 1, 0)').run(aid);

    // Transactions for Vibhavan (6 months: Oct 2025 – Apr 2026)
    const txn = db.prepare(
      'INSERT INTO transactions (user_id, description, category, amount, type, status, date) VALUES (?, ?, ?, ?, ?, ?, ?)'
    );

    // --- April 2026 (current month) ---
    txn.run(uid, 'Salary',              'Income',        3200,  'income',  'paid',    '2026-04-01');
    txn.run(uid, 'Grocery run',         'Food',          96,    'expense', 'paid',    '2026-04-03');
    txn.run(uid, 'Bus pass',            'Transport',     85,    'expense', 'paid',    '2026-04-02');
    txn.run(uid, 'Netflix',             'Entertainment', 18,    'expense', 'paid',    '2026-04-02');
    txn.run(uid, 'Electric bill',       'Utilities',     71,    'expense', 'pending', '2026-04-01');
    txn.run(uid, 'Savings deposit',     'Savings',       500,   'expense', 'paid',    '2026-04-01');

    // --- March 2026 ---
    txn.run(uid, 'Salary',              'Income',        3200,  'income',  'paid',    '2026-03-01');
    txn.run(uid, 'Freelance invoice',   'Income',        1280,  'income',  'paid',    '2026-03-28');
    txn.run(uid, 'Grocery run',         'Food',          94,    'expense', 'paid',    '2026-03-06');
    txn.run(uid, 'Grocery run',         'Food',          89,    'expense', 'paid',    '2026-03-13');
    txn.run(uid, 'Grocery run',         'Food',          95,    'expense', 'paid',    '2026-03-20');
    txn.run(uid, 'Groceries - Costco',  'Food',          142,   'expense', 'paid',    '2026-03-27');
    txn.run(uid, 'Bus pass',            'Transport',     85,    'expense', 'paid',    '2026-03-03');
    txn.run(uid, 'Uber ride',           'Transport',     22,    'expense', 'paid',    '2026-03-14');
    txn.run(uid, 'Netflix',             'Entertainment', 18,    'expense', 'paid',    '2026-03-15');
    txn.run(uid, 'Cinema tickets',      'Entertainment', 34,    'expense', 'paid',    '2026-03-21');
    txn.run(uid, 'Gym membership',      'Health',        45,    'expense', 'paid',    '2026-03-22');
    txn.run(uid, 'Electric bill',       'Utilities',     68,    'expense', 'pending', '2026-03-25');
    txn.run(uid, 'Restaurant dinner',   'Dining',        72,    'expense', 'paid',    '2026-03-18');
    txn.run(uid, 'Savings deposit',     'Savings',       500,   'expense', 'paid',    '2026-03-05');

    // --- February 2026 ---
    txn.run(uid, 'Salary',              'Income',        3200,  'income',  'paid',    '2026-02-01');
    txn.run(uid, 'Grocery run',         'Food',          91,    'expense', 'paid',    '2026-02-05');
    txn.run(uid, 'Grocery run',         'Food',          87,    'expense', 'paid',    '2026-02-12');
    txn.run(uid, 'Grocery run',         'Food',          102,   'expense', 'paid',    '2026-02-19');
    txn.run(uid, 'Bus pass',            'Transport',     85,    'expense', 'paid',    '2026-02-03');
    txn.run(uid, 'Spotify',             'Entertainment', 11,    'expense', 'paid',    '2026-02-10');
    txn.run(uid, 'Netflix',             'Entertainment', 18,    'expense', 'paid',    '2026-02-15');
    txn.run(uid, 'Gym membership',      'Health',        45,    'expense', 'paid',    '2026-02-22');
    txn.run(uid, 'Electric bill',       'Utilities',     74,    'expense', 'paid',    '2026-02-24');
    txn.run(uid, 'Restaurant lunch',    'Dining',        38,    'expense', 'paid',    '2026-02-16');
    txn.run(uid, 'Savings deposit',     'Savings',       500,   'expense', 'paid',    '2026-02-05');

    // --- January 2026 ---
    txn.run(uid, 'Salary',              'Income',        3200,  'income',  'paid',    '2026-01-01');
    txn.run(uid, 'Grocery run',         'Food',          108,   'expense', 'paid',    '2026-01-07');
    txn.run(uid, 'Grocery run',         'Food',          93,    'expense', 'paid',    '2026-01-14');
    txn.run(uid, 'Grocery run',         'Food',          99,    'expense', 'paid',    '2026-01-21');
    txn.run(uid, 'Bus pass',            'Transport',     85,    'expense', 'paid',    '2026-01-03');
    txn.run(uid, 'Uber ride',           'Transport',     18,    'expense', 'paid',    '2026-01-19');
    txn.run(uid, 'Netflix',             'Entertainment', 18,    'expense', 'paid',    '2026-01-15');
    txn.run(uid, 'Gym membership',      'Health',        45,    'expense', 'paid',    '2026-01-22');
    txn.run(uid, 'Electric bill',       'Utilities',     82,    'expense', 'paid',    '2026-01-25');
    txn.run(uid, 'Savings deposit',     'Savings',       400,   'expense', 'paid',    '2026-01-05');

    // --- December 2025 ---
    txn.run(uid, 'Salary',              'Income',        3200,  'income',  'paid',    '2025-12-01');
    txn.run(uid, 'Holiday bonus',       'Income',        800,   'income',  'paid',    '2025-12-15');
    txn.run(uid, 'Grocery run',         'Food',          120,   'expense', 'paid',    '2025-12-06');
    txn.run(uid, 'Grocery run',         'Food',          115,   'expense', 'paid',    '2025-12-13');
    txn.run(uid, 'Holiday gifts',       'Entertainment', 280,   'expense', 'paid',    '2025-12-20');
    txn.run(uid, 'Bus pass',            'Transport',     85,    'expense', 'paid',    '2025-12-03');
    txn.run(uid, 'Gym membership',      'Health',        45,    'expense', 'paid',    '2025-12-22');
    txn.run(uid, 'Electric bill',       'Utilities',     95,    'expense', 'paid',    '2025-12-26');
    txn.run(uid, 'Restaurant dinner',   'Dining',        110,   'expense', 'paid',    '2025-12-24');
    txn.run(uid, 'Savings deposit',     'Savings',       600,   'expense', 'paid',    '2025-12-05');

    // --- November 2025 ---
    txn.run(uid, 'Salary',              'Income',        3200,  'income',  'paid',    '2025-11-01');
    txn.run(uid, 'Grocery run',         'Food',          88,    'expense', 'paid',    '2025-11-06');
    txn.run(uid, 'Grocery run',         'Food',          96,    'expense', 'paid',    '2025-11-13');
    txn.run(uid, 'Bus pass',            'Transport',     85,    'expense', 'paid',    '2025-11-03');
    txn.run(uid, 'Netflix',             'Entertainment', 18,    'expense', 'paid',    '2025-11-15');
    txn.run(uid, 'Gym membership',      'Health',        45,    'expense', 'paid',    '2025-11-22');
    txn.run(uid, 'Electric bill',       'Utilities',     71,    'expense', 'paid',    '2025-11-24');
    txn.run(uid, 'Savings deposit',     'Savings',       450,   'expense', 'paid',    '2025-11-05');

    // --- October 2025 ---
    txn.run(uid, 'Salary',              'Income',        3200,  'income',  'paid',    '2025-10-01');
    txn.run(uid, 'Grocery run',         'Food',          92,    'expense', 'paid',    '2025-10-07');
    txn.run(uid, 'Grocery run',         'Food',          85,    'expense', 'paid',    '2025-10-14');
    txn.run(uid, 'Bus pass',            'Transport',     85,    'expense', 'paid',    '2025-10-03');
    txn.run(uid, 'Netflix',             'Entertainment', 18,    'expense', 'paid',    '2025-10-15');
    txn.run(uid, 'Gym membership',      'Health',        45,    'expense', 'paid',    '2025-10-22');
    txn.run(uid, 'Electric bill',       'Utilities',     67,    'expense', 'paid',    '2025-10-25');
    txn.run(uid, 'Savings deposit',     'Savings',       400,   'expense', 'paid',    '2025-10-05');

    // Transactions for Avery (approver — smaller set)
    txn.run(aid, 'Salary',        'Income',    4500, 'income',  'paid', '2026-03-01');
    txn.run(aid, 'Grocery run',   'Food',      120,  'expense', 'paid', '2026-03-08');
    txn.run(aid, 'Bus pass',      'Transport', 60,   'expense', 'paid', '2026-03-03');
    txn.run(aid, 'Netflix',       'Entertainment', 18, 'expense', 'paid', '2026-03-15');
    txn.run(aid, 'Savings deposit', 'Savings', 800,  'expense', 'paid', '2026-03-05');

    // Budgets for Aakanksha
    const budget = db.prepare(
      'INSERT INTO budgets (user_id, title, category, limit_amount, period) VALUES (?, ?, ?, ?, ?)'
    );
    budget.run(uid, 'Groceries',       'Food',          580,  'monthly');
    budget.run(uid, 'Transport',       'Transport',     240,  'monthly');
    budget.run(uid, 'Entertainment',   'Entertainment', 200,  'monthly');
    budget.run(uid, 'Health & Fitness','Health',        200,  'monthly');
    budget.run(uid, 'Savings',         'Savings',       1250, 'monthly');
    budget.run(uid, 'Utilities',       'Utilities',     150,  'monthly');
    budget.run(uid, 'Dining Out',      'Dining',        180,  'monthly');

    // Budgets for Avery
    budget.run(aid, 'Groceries',  'Food',    400, 'monthly');
    budget.run(aid, 'Savings',    'Savings', 1000,'monthly');

    // Goals for Aakanksha
    const goal = db.prepare(
      'INSERT INTO goals (user_id, title, description, target, saved) VALUES (?, ?, ?, ?, ?)'
    );
    goal.run(uid, 'Vacation fund',    'Saving for summer travel and weekend getaways.',       3000, 2010);
    goal.run(uid, 'Emergency reserve','Building a safety cushion for unexpected expenses.',   5000, 2600);
    goal.run(uid, 'Home upgrades',    'Set aside money for furniture and repairs.',           1800, 576);

    // Goals for Avery
    goal.run(aid, 'New laptop', 'Saving for a work laptop upgrade.', 2500, 900);

    // Spending requests
    const req = db.prepare(
      'INSERT INTO spending_requests (requester_id, approver_id, title, description, amount, status, created_at, resolved_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
    );
    req.run(uid, null, 'Travel budget change',  'Approve increased travel allowance for conference.', 350, 'pending',  '2026-03-23 09:00:00', null);
    req.run(uid, aid,  'Project bonus transfer', 'Confirm transfer to savings goal.',                  500, 'approved', '2026-03-18 14:00:00', '2026-03-19 10:00:00');
    req.run(uid, aid,  'Dining budget increase', 'Team lunch exceeded monthly dining budget.',          120, 'denied',   '2026-03-05 11:00:00', '2026-03-06 09:00:00');
  });

  run();
  console.log('Seed complete.');
  console.log('  User:     admin@centsora.com / admin123');
  console.log('  Approver: avery@centsora.com / approver456');
}

seed();
