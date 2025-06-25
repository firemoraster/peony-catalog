// Сервер + API + роздача фронтенду
require('dotenv').config();
const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const multer = require('multer');

const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, 'data');
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, 'uploads');
const DATA_FILE = path.join(DATA_DIR, 'flowers.json');

// Створюємо папки й файл, якщо немає
fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(UPLOAD_DIR, { recursive: true });
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, '[]');

// Multer для збереження зображень
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(UPLOAD_DIR));
app.use(express.static(path.join(__dirname, 'public')));

// --- CRUD API ---

// GET: повернути всі півонії
app.get('/api/flowers', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_FILE));
  res.json(data);
});

// POST: додати нову (multiple фото)
app.post('/api/flowers', upload.array('images'), (req, res) => {
  const flowers = JSON.parse(fs.readFileSync(DATA_FILE));
  const { name, desc, price } = req.body;
  const images = req.files.map(f => `/uploads/${f.filename}`);
  const id = Date.now();
  const newF = { id, name, desc, price, images };
  flowers.push(newF);
  fs.writeFileSync(DATA_FILE, JSON.stringify(flowers, null, 2));
  res.status(201).json(newF);
});

// PUT: оновити існуючу
app.put('/api/flowers/:id', upload.array('images'), (req, res) => {
  const id = parseInt(req.params.id);
  let flowers = JSON.parse(fs.readFileSync(DATA_FILE));
  const idx = flowers.findIndex(f => f.id === id);
  if (idx < 0) return res.status(404).end();
  const { name, desc, price } = req.body;
  let images = flowers[idx].images;
  if (req.files.length) images = req.files.map(f => `/uploads/${f.filename}`);
  flowers[idx] = { id, name, desc, price, images };
  fs.writeFileSync(DATA_FILE, JSON.stringify(flowers, null, 2));
  res.json(flowers[idx]);
});

// DELETE: видалити за id
app.delete('/api/flowers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  let flowers = JSON.parse(fs.readFileSync(DATA_FILE));
  flowers = flowers.filter(f => f.id !== id);
  fs.writeFileSync(DATA_FILE, JSON.stringify(flowers, null, 2));
  res.status(204).end();
});

// Для SPA: всі інші запити — index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`));
