const router = require('express').Router();
const { authenticate } = require('../middleware/auth.middleware');
const { query } = require('../config/database');

router.patch('/profile', authenticate, async (req, res, next) => {
  try {
    const { username, bio, avatar_url } = req.body;
    const result = await query(
      `UPDATE users SET
        username = COALESCE($1, username),
        bio = COALESCE($2, bio),
        avatar_url = COALESCE($3, avatar_url)
       WHERE id = $4
       RETURNING id, username, email, bio, avatar_url, role`,
      [username, bio, avatar_url, req.user.id]
    );
    res.json(result.rows[0]);
  } catch (err) { next(err); }
});

module.exports = router;