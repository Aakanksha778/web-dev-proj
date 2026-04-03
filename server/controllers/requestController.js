const db = require('../db/database');

const REQUEST_WITH_USERS = `
  SELECT
    r.id, r.title, r.description, r.amount, r.status,
    r.created_at, r.resolved_at,
    json_object('id', u.id, 'name', u.name) AS requester,
    CASE WHEN a.id IS NOT NULL
         THEN json_object('id', a.id, 'name', a.name)
         ELSE NULL END AS approver
  FROM spending_requests r
  JOIN users u ON u.id = r.requester_id
  LEFT JOIN users a ON a.id = r.approver_id
`;

function parseRequest(row) {
  return {
    ...row,
    requester: typeof row.requester === 'string' ? JSON.parse(row.requester) : row.requester,
    approver:  row.approver && typeof row.approver === 'string'
      ? JSON.parse(row.approver)
      : row.approver,
  };
}

function getMyRequests(req, res) {
  const rows = db.prepare(`${REQUEST_WITH_USERS} WHERE r.requester_id = ? ORDER BY r.created_at DESC`)
    .all(req.user.id);
  res.json({ success: true, data: { requests: rows.map(parseRequest) } });
}

function createRequest(req, res) {
  const { title, description = '', amount } = req.body;
  const userId = req.user.id;

  const result = db.prepare(`
    INSERT INTO spending_requests (requester_id, title, description, amount)
    VALUES (?, ?, ?, ?)
  `).run(userId, title, description, amount);

  const row = db.prepare(`${REQUEST_WITH_USERS} WHERE r.id = ?`)
    .get(result.lastInsertRowid);
  res.status(201).json({ success: true, data: { request: parseRequest(row) } });
}

function getPendingRequests(req, res) {
  const rows = db.prepare(`${REQUEST_WITH_USERS} WHERE r.status = 'pending' ORDER BY r.created_at DESC`)
    .all();
  res.json({ success: true, data: { requests: rows.map(parseRequest) } });
}

function getAllRequests(req, res) {
  const rows = db.prepare(`${REQUEST_WITH_USERS} ORDER BY r.created_at DESC`).all();
  res.json({ success: true, data: { requests: rows.map(parseRequest) } });
}

function resolveRequest(status) {
  return (req, res) => {
    const { id } = req.params;
    const approverId = req.user.id;

    const existing = db
      .prepare("SELECT id FROM spending_requests WHERE id = ? AND status = 'pending'")
      .get(id);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'Pending request not found' });
    }

    db.prepare(`
      UPDATE spending_requests
      SET status = ?, approver_id = ?, resolved_at = datetime('now')
      WHERE id = ?
    `).run(status, approverId, id);

    const row = db.prepare(`${REQUEST_WITH_USERS} WHERE r.id = ?`).get(id);
    res.json({ success: true, data: { request: parseRequest(row) } });
  };
}

module.exports = {
  getMyRequests,
  createRequest,
  getPendingRequests,
  getAllRequests,
  approveRequest: resolveRequest('approved'),
  denyRequest:    resolveRequest('denied'),
};
