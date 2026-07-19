# 🛒 Stationery Store Management System

A comprehensive, full-stack POS (Point of Sale) and Inventory Management system designed specifically for small retail businesses and stationery stores. This application can be run directly from the source code for development or deployed as a monolithic executable (`.exe`), ensuring a zero-dependency, offline-first installation on client Windows machines.

## ✨ Features
- **Barcode Scanning:** Fast product entry and checkout utilizing smartphone cameras via local network.
- **Stock Tracking:** Real-time inventory monitoring and management.
- **Financial Reports:** Daily and monthly sales insights with detailed logs.
- **Offline-First Architecture:** Local SQLite database ensures the system runs perfectly without an active internet connection.
- **Monolithic Deployment:** Bundled as a single Windows installer for end-users.

## 🚀 Tech Stack
- **Backend:** Python, FastAPI, SQLAlchemy, SQLite
- **Frontend:** React.js, Vite, TailwindCSS, ZXing (Barcode Decoder)
- **Packaging:** PyInstaller (Executable), Inno Setup (Windows Installer)

## 🏗️ Architecture
This project utilizes a unique monolithic deployment strategy for production:
1. The React frontend is built statically via Vite.
2. The FastAPI backend serves both the API endpoints and the static React files from the `dist` folder.
3. The entire backend environment (Python, Uvicorn, SQLAlchemy) is bundled into a single `.exe` file using PyInstaller.
4. The server binds to `0.0.0.0`, allowing mobile devices on the same local Wi-Fi network to access the web app and use their cameras as barcode scanners.

---

## 💻 Development Setup
For developers who want to clone the repository and run the source code locally:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Mamad-MD/stationery-store-manager.git
   cd stationery-store-manager
   ```

2. **Install Backend Dependencies:**
   ```bash
   cd backend
   python -m venv .venv
   source .venv/Scripts/activate  # On Windows
   pip install -r requirements.txt
   ```

3. **Install Frontend Dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Run the Application (Development Mode):**
   - Backend: `uvicorn run:app --reload --host 0.0.0.0 --port 8000`
   - Frontend: `npm run dev`

---

## 📦 Build and Deployment Process (Production)

To create the final standalone Windows installer for end-users:

### 1. Build the Frontend

```bash
cd frontend
npm run build
```

*Copy the generated `dist` folder to your deployment staging directory (e.g., `FINAL_PWA`).*

### 2. Build the Backend (Standalone Executable)

Activate your Python virtual environment and run PyInstaller with hidden imports to ensure Uvicorn starts correctly:

```bash
cd backend
pyinstaller --onefile \
  --hidden-import=uvicorn.logging \
  --hidden-import=uvicorn.loops \
  --hidden-import=uvicorn.loops.auto \
  --hidden-import=uvicorn.protocols.http.auto \
  --hidden-import=uvicorn.protocols.websockets.auto \
  --hidden-import=uvicorn.lifespan.on \
  run.py
```

*Move the generated `run.exe` from `backend/dist` to your deployment staging directory.*

### 3. Create Windows Installer

Use **Inno Setup** with the provided `setup.iss` script. The staging folder must look like this:

```text
FINAL_PWA/
├── run.exe        # Core backend and server executable
├── data/          # SQLite database folder (Installer will grant write permissions)
└── dist/          # React static build files
```

Compile the script in Inno Setup to generate `Stationery_Setup.exe`.

---

## 📱 Mobile Barcode Scanner (Local Network Setup)

If you are running the system on a local network (e.g., a store's Wi-Fi) and want to use a smartphone's camera for barcode scanning, the mobile browser might block camera access due to the lack of an SSL certificate (HTTPS).

**Quick Fix for Google Chrome on Mobile:**

1. Open Google Chrome on the smartphone.
2. Type `chrome://flags/#unsafely-treat-insecure-origin-as-secure` in the address bar.
3. In the highlighted text box, enter the exact local IP address of your server (e.g., `http://192.168.1.50:8000`).
4. Change the dropdown menu from **Disabled** to **Enabled**.
5. Tap **Relaunch**.

*The browser will now trust the local connection, allowing the ZXing barcode scanner to access the main rear camera with auto-focus capabilities.*

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
