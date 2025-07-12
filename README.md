# peony-catalog

![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![GitHub Stars](https://img.shields.io/github/stars/firemoraster/peony-catalog?style=for-the-badge)
![GitHub Forks](https://img.shields.io/github/forks/firemoraster/peony-catalog?style=for-the-badge)
![GitHub Issues](https://img.shields.io/github/issues/firemoraster/peony-catalog?style=for-the-badge)

Welcome to **peony-catalog**! This repository is a lightweight flower catalog built with Node.js and Express. Upload photos and descriptions of peonies with ease.

---

## 📑 Table of Contents

- [🎨 Demo](#-demo)
- [⚙️ Features](#-features)
- [🛠 Technologies](#-technologies)
- [🚀 Getting Started](#-getting-started)
- [📁 Project Structure](#-project-structure)
- [⚙️ Configuration](#-configuration)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## 🎨 Demo

<img width="1764" height="900" alt="image" src="https://github.com/user-attachments/assets/2ebb53b0-6c7c-48e1-8e30-d63505ca9694" />





---

## ⚙️ Features

- Browse a catalog of peony flowers
- Upload photos and metadata
- Simple, responsive design

---

## 🛠 Technologies

- Node.js + Express
- HTML, CSS, JavaScript
- Static file storage under `/data/uploads`

---

## 🚀 Getting Started

```bash
# 1. Clone the repository
git clone https://github.com/firemoraster/peony-catalog.git
cd peony-catalog

# 2. Install dependencies
npm install

# 3. Create the .env file
echo -e "PORT=3000\nUPLOAD_DIR=./data/uploads" > .env

# 4. Start the server
npm start

# 5. Visit in browser
http://localhost:3000
```

---

## 📁 Project Structure

```
peony-catalog/
├── data/          # Uploaded files
│   └── uploads/
├── public/        # Static assets
├── server.js      # Express server
├── package.json   # Project config
├── .env           # Environment config
└── .gitignore
```

---

## ⚙️ Configuration

- `PORT` – Port on which the server runs (default `3000`)
- `UPLOAD_DIR` – Directory to store uploads

> Make sure `data/uploads` exists and is writable.

---

## 🤝 Contributing

1. Fork the repository
2. Create a branch (`feature/your-feature`)
3. Commit your changes
4. Open a Pull Request

---

## 📄 License

MIT © [firemoraster](https://github.com/firemoraster)
