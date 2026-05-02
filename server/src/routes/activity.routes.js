const router = require('express').Router();
const { authenticate } = require('../middleware/auth.middleware');
const { query } = require('../config/database');
const { publish } = require('../services/redis.service');

router.get('/', authenticate, async (req, res, next) => {
  try {
    const { limit = 20, offset = 0 } = req.query;
    const result = await query(
      `SELECT ae.*, p.name as project_name, p.color as project_color
       FROM activity_events ae
       LEFT JOIN projects p ON p.id = ae.project_id
       WHERE ae.user_id = $1
       ORDER BY ae.created_at DESC
       LIMIT $2 OFFSET $3`,
      [req.user.id, parseInt(limit), parseInt(offset)]
    );
    res.json(result.rows);
  } catch (err) { next(err); }
});

router.post('/', authenticate, async (req, res, next) => {
  try {
    const { project_id, type, title, description, metadata } = req.body;
    const result = await query(
      `INSERT INTO activity_events (user_id, project_id, type, title, description, metadata)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [req.user.id, project_id, type, title, description, metadata || {}]
    );
    const event = result.rows[0];

    // Publish to Redis → Socket.io
    await publish('activity:new', { userId: req.user.id, ...event });

    res.status(201).json(event);
  } catch (err) { next(err); }
});

module.exports = router;