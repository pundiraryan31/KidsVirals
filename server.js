require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const ideaRoutes = require('./routes/ideas');
const scriptRoutes = require('./routes/scripts');
const titleRoutes = require('./routes/titles');
const seoRoutes = require('./routes/seo');
const analyticsRoutes = require('./routes/analytics');
const pipelineRoutes = require('./routes/pipeline');
const chatRoutes = require('./routes/chat');

const app = express();
const PORT = process.env.PORT || 5000;

// ── MIDDLEWARE ──────────────────────────────────────────────
app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '2mb' }));

// Rate limiting — protect AI endpoints
const aiLimiter = rateLimit({
  windowMs: 60 * 1000,   // 1 minute
  max: 20,
  message: { error: 'Too many requests. Please wait a moment.' }
});
app.use('/api/ideas', aiLimiter);
app.use('/api/scripts', aiLimiter);
app.use('/api/titles', aiLimiter);
app.use('/api/seo', aiLimiter);
app.use('/api/chat', aiLimiter);

// ── ROUTES ──────────────────────────────────────────────────
app.use('/api/ideas',     ideaRoutes);
app.use('/api/scripts',   scriptRoutes);
app.use('/api/titles',    titleRoutes);
app.use('/api/seo',       seoRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/pipeline',  pipelineRoutes);
app.use('/api/chat',      chatRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'KidsViral AI Backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    ai: !!process.env.ANTHROPIC_API_KEY ? 'connected' : 'no key'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found', path: req.path });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

app.listen(PORT, () => {
  console.log(`\n🚀 KidsViral AI Backend running on http://localhost:${PORT}`);
  console.log(`🤖 Anthropic API: ${process.env.ANTHROPIC_API_KEY ? '✅ Connected' : '❌ No API key set'}`);
  console.log(`📡 CORS origin: ${process.env.FRONTEND_URL || 'http://localhost:3000'}\n`);
});

module.exports = app;
