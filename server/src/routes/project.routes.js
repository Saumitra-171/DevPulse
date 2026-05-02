const router = require('express').Router();
const { authenticate } = require('../middleware/auth.middleware');
const { query } = require('../config/database');

router.get('/', authenticate, async (req, res, next) => {
  try {
    const result = await query(
      `SELECT p.*, COUNT(DISTINCT ae.id) as activity_count
       FROM projects p
       LEFT JOIN activity_events ae ON ae.project_id = p.id
       WHERE p.user_id = $1
       GROUP BY p.id
       ORDER BY p.updated_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) { next(err); }
});

router.post('/', authenticate, async (req, res, next) => {
  try {
    const { name, description, repo_url, language, tags, color } = req.body;
    const result = await query(
      `INSERT INTO projects (user_id, name, description, repo_url, language, tags, color)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [req.user.id, name, description, repo_url, language, tags || [], color || '#6366f1']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) { next(err); }
});

router.delete('/:id', authenticate, async (req, res, next) => {
  try {
    const result = await query(
      'DELETE FROM projects WHERE id = $1 AND user_id = $2 RETURNING id',
      [req.params.id, req.user.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Project not found' });
    res.json({ message: 'Project deleted' });
  } catch (err) { next(err); }
});

module.exports = router;