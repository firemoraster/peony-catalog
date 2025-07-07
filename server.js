require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const multer = require('multer');

const DATA_DIR   = process.env.DATA_DIR   || path.join(__dirname, 'data');
const UPLOAD_DIR = path.join(DATA_DIR, 'uploads');
const DATA_FILE  = path.join(DATA_DIR, 'flowers.json');

// Створення папок/файлу
fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(UPLOAD_DIR, { recursive: true });
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]');

// Multer: збереження зображень
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, UPLOAD_DIR),
  filename: (_, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(UPLOAD_DIR));
app.use(express.static(path.join(__dirname, 'public')));

// КЕШ
let cachedFlowers = null;
function loadFlowers() {
  return JSON.parse(fs.readFileSync(DATA_FILE));
}
function saveFlowers(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  cachedFlowers = null; // Очищаємо кеш
}

// --- API ---
// GET: отримати всі квіти
app.get('/api/flowers', (req, res) => {
  if (!cachedFlowers) {
    cachedFlowers = loadFlowers();
  }
  res.set('Cache-Control', 'public, max-age=300'); // 5 хв кеш
  res.json(cachedFlowers);
});

// POST: додати нову квітку
app.post('/api/flowers', upload.array('images'), (req, res) => {
  const flowers = loadFlowers();
  const { name, desc, price } = req.body;
  const images = req.files.map(f => `/uploads/${f.filename}`);
  const id = Date.now();
  const newFlower = { id, name, desc, price, images };
  flowers.push(newFlower);
  saveFlowers(flowers);
  res.status(201).json(newFlower);
});

// PUT: редагування
app.put('/api/flowers/:id', upload.array('images'), (req, res) => {
  const id = parseInt(req.params.id);
  let flowers = loadFlowers();
  const idx = flowers.findIndex(f => f.id === id);
  if (idx < 0) return res.status(404).end();
  const { name, desc, price } = req.body;
  let images = flowers[idx].images;
  if (req.files.length) images = req.files.map(f => `/uploads/${f.filename}`);
  flowers[idx] = { id, name, desc, price, images };
  saveFlowers(flowers);
  res.json(flowers[idx]);
});

// DELETE: видалити
app.delete('/api/flowers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let flowers = loadFlowers();
  flowers = flowers.filter(f => f.id !== id);
  saveFlowers(flowers);
  res.status(204).end();
});

// SPA: інші запити -> index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Запуск
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Сервер запущено на порту ${PORT}`));
