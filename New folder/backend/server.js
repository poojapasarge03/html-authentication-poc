require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initDB } = require('./config/db');
const errorHandler = require('./middleware/error');

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/items', require('./routes/items'));

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

initDB()
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch((err) => { console.error('DB init failed:', err); process.exit(1); });
