require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const User = require('./models/user.js');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 4000;

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://127.0.0.1:5500", // where your HTML is served from
  credentials: true
}));

// db connect
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB Atlas connected'))
  .catch(err => console.error('❌ Mongo error:', err));

// auth guard
function auth(req, res, next) {
  const userId = req.cookies?.userId;
  if (!userId) return res.status(401).json({ error: "Not logged in" });
  req.userId = userId;
  next();
}

// routes
app.get('/', (req, res) => res.json({ ok: true, msg: 'API up' }));

app.post('/api/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Missing fields" });

  const exists = await User.findOne({ email });
  if (exists) return res.status(400).json({ error: "Email already registered" });

  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, password: hash });

  res.json({ ok: true, user: { id: user._id, email: user.email } });
});

app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ error: "Invalid credentials" });

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(400).json({ error: "Invalid credentials" });

  // set cookie with userId
  res.cookie("userId", user._id.toString(), {
    httpOnly: true,
    sameSite: "lax",
    secure: false, // true only if HTTPS
    maxAge: 1000 * 60 * 60 // 1h
  });

  res.json({ ok: true, msg: "Logged in" });
});

app.get('/api/me', auth, async (req, res) => {
  const user = await User.findById(req.userId).select("-password");
  res.json({ user });
});

app.post('/api/logout', (req, res) => {
  res.clearCookie("userId");
  res.json({ ok: true });
});

app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
