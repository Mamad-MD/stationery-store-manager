# Stationery Store Manager

A web-based inventory & sales management system designed for small stationery stores.

## Features
- **Barcode Scanning:** Fast product entry and checkout.
- **Stock Tracking:** Real-time inventory monitoring.
- **Financial Reports:** Daily and monthly sales insights.
- **Multi-device Support:** Responsive design for various devices.

## Tech Stack
- **Backend:** Python, FastAPI, SQLite
- **Frontend:** React, Vite, TailwindCSS

## Setup
1. Clone the repository:
   `git clone https://github.com/Mamad-MD/stationery-store-manager.git`
2. Install backend dependencies (inside `backend` folder):
   `pip install -r requirements.txt`
3. Install frontend dependencies (inside `frontend` folder):
   `npm install`
4. Run the project!

### 📱 Mobile Barcode Scanner (Local Network Setup)
If you are running the system on a local network (e.g., a store's Wi-Fi) and want to use a smartphone's camera for barcode scanning, the mobile browser might block camera access due to the lack of HTTPS. 

**Quick Fix for Chrome:**
1. Open Google Chrome on the smartphone.
2. Type `chrome://flags/#unsafely-treat-insecure-origin-as-secure` in the address bar.
3. In the highlighted text box, enter the local IP address of your server (e.g., `http://192.168.1.50:8000`).
4. Change the dropdown menu from **Disabled** to **Enabled**.
5. Tap **Relaunch**. The camera will now work perfectly on your local network!

## License
This project is licensed under the MIT License.