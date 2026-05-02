const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();

// Security
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));

// Rate limiting
app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
}));

// Parsing & compression
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('dev'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

const statsRoutes = require('./routes/stats.routes');
app.use('/api/stats', statsRoutes);

const projectRoutes = require('./routes/project.routes');
app.use('/api/projects', projectRoutes);

const activityRoutes = require('./routes/activity.routes');
app.use('/api/activity', activityRoutes);

const userRoutes = require('./routes/user.routes');
app.use('/api/users', userRoutes);

// 404
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.originalUrl} not found` });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ error: err.message });
});

module.exports = app;