# 🔲 QR Code Generator

Aplikasi web sederhana untuk generate QR Code dengan Node.js dan Express.

> **Note:** Ini adalah project coba-coba untuk belajar

**🌐 Live Demo:** [nodejs.apcelix.com](http://nodejs.apcelix.com)

## ✨ Fitur

- Generate QR Code dari text atau URL
- Custom ukuran dan warna
- Download sebagai PNG
- Copy to clipboard
- REST API endpoint
- Responsive design

## 🚀 Cara Install

1. **Clone repository**
```bash
git clone https://github.com/ikbaladi/nodejs-qr-code-generator.git
cd nodejs-qr-code-generator
```

2. **Install dependencies**
```bash
npm install
```

3. **Buat file .env**
```env
PORT=3000
NODE_ENV=development
```

4. **Jalankan aplikasi**
```bash
npm run dev
```

5. **Buka browser**
```
http://localhost:3000
```

## 📁 Struktur Project

```
qr-code-generator/
├── public/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── .env
├── .gitignore
├── server.js
└── package.json
```

## 🔌 API Endpoints

### Generate QR Code
```bash
POST /api/generate
Content-Type: application/json

{
  "text": "https://example.com",
  "size": 300
}
```

### Generate dengan Custom Warna
```bash
POST /api/generate-custom
Content-Type: application/json

{
  "text": "Hello World",
  "darkColor": "#000000",
  "lightColor": "#FFFFFF"
}
```

### Download QR Code
```bash
GET /api/download?text=Hello%20World&size=500
```

## 🛠️ Technology Stack

- Node.js
- Express.js
- QRCode library
- HTML/CSS/JavaScript

## 📝 License

MIT License

---

Made with ❤️ by  [ikbal.web.id](https://ikbal.web.id)