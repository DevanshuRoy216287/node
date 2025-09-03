// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 4000;

// middleware
app.use(express.json());
app.use(cookieParser());

// db connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Atlas connected'))
  .catch(err => console.error('❌ Mongo error:', err));

// auth guard
async function auth(req, res, next) {
  const userId = req.cookies?.userId;
  if (!userId) return res.status(401).json({ error: 'Not authenticated' });

  const user = await User.findById(userId).select('-password');
  if (!user) return res.status(401).json({ error: 'Invalid session' });

  req.user = user;
  next();
}

// routes
app.get('/', (req, res) => res.json({ ok: true, msg: 'API up' }));

app.post('/api/register', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ error: 'Email already registered' });

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hash });

  res.json({ ok: true, user: { id: user._id, email: user.email } });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Missing fields' });

  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: 'Invalid credentials' });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ error: 'Invalid credentials' });

  // Set cookie with userId
  res.cookie('userId', user._id.toString(), {
    httpOnly: true,
    sameSite: 'lax',
    secure: false, // set true if HTTPS
    maxAge: 60 * 60 * 1000
  });

  res.json({ ok: true });
});

app.get('/api/me', auth, (req, res) => {
  res.json({ user: req.user });
});

app.post('/api/logout', (req, res) => {
  res.clearCookie('userId');
  res.json({ ok: true });
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
