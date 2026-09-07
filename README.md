# 🛒 Stationery Store Manager

A full-stack **POS and inventory management system** for stationery stores and small retail businesses.

## ✨ Features

- Product and inventory management
- Barcode scanning with a smartphone camera
- Sales and stock tracking
- Daily and monthly reports
- Offline-first SQLite database
- Local-network access
- Standalone Windows deployment

## 🛠 Tech Stack

- **Backend:** Python, FastAPI, SQLAlchemy, SQLite
- **Frontend:** React, Vite, Tailwind CSS
- **Barcode:** ZXing, html5-qrcode
- **Deployment:** Docker, PyInstaller, Inno Setup

## 📸 Screenshots

<p align="center">
  <img src="StoreApp/frontend/public/screenshots/dashboard.png" alt="Dashboard" width="360">
  <img src="StoreApp/frontend/public/screenshots/inventory.png" alt="Inventory" width="360">
</p>

<p align="center">
  <img src="StoreApp/frontend/public/screenshots/scanner.png" alt="Barcode Scanner" width="360">
  <img src="StoreApp/frontend/public/screenshots/sales.png" alt="Sales" width="360">
</p>

<p align="center">
  <img src="StoreApp/frontend/public/screenshots/reports.png" alt="Reports" width="360">
</p>

## 📁 Structure

```text
stationery-store-manager/
├── StoreApp/
│   ├── backend/       # FastAPI backend
│   ├── frontend/      # React + Vite frontend
│   └── docker-compose.yml
├── LICENSE
└── README.md
```

## 🚀 Development

### Backend

```bash
cd StoreApp/backend
python -m venv .venv
# Windows
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn run:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd StoreApp/frontend
npm install
npm run dev
```

## 📦 Production

The application can be packaged as a standalone Windows executable and installer using **PyInstaller** and **Inno Setup**.

## 👤 Developer

Made by [Mamad-MD](https://github.com/Mamad-MD)
