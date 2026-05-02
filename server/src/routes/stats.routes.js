const router = require('express').Router();
const { authenticate } = require('../middleware/auth.middleware');
const { query } = require('../config/database');

router.get('/overview', authenticate, async (req, res, next) => {
  try {
    const [projectsRes, todayRes] = await Promise.all([
      query(
        `SELECT COUNT(*) as total, COUNT(*) FILTER (WHERE status = 'active') as active 
         FROM projects WHERE user_id = $1`,
        [req.user.id]
      ),
      query(
        'SELECT * FROM daily_stats WHERE user_id = $1 AND date = CURRENT_DATE',
        [req.user.id]
      ),
    ]);

    res.json({
      projects: projectsRes.rows[0],
      today: todayRes.rows[0] || { commits: 0, lines_added: 0, active_time_minutes: 0, events_count: 0 },
      currentStreak: 0,
    });
  } catch (err) { next(err); }
});

router.get('/daily', authenticate, async (req, res, next) => {
  try {
    const { days = 14 } = req.query;
    const result = await query(
      `SELECT date, events_count FROM daily_stats
       WHERE user_id = $1 AND date >= NOW() - INTERVAL '${parseInt(days)} days'
       ORDER BY date ASC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) { next(err); }
});

router.get('/heatmap', authenticate, async (req, res, next) => {
  try {
    const year = req.query.year || new Date().getFullYear();
    const result = await query(
      `SELECT date, events_count as count FROM daily_stats
       WHERE user_id = $1 AND EXTRACT(YEAR FROM date) = $2
       ORDER BY date ASC`,
      [req.user.id, year]
    );
    res.json(result.rows);
  } catch (err) { next(err); }
});

module.exports = router;