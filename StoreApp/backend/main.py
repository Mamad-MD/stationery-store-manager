from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import products, inventory, sales, reports
import os
import sys

Base.metadata.create_all(bind=engine)
app = FastAPI(title="Stationery Store Manager")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ۱. اضافه کردن روت‌های API بک‌اند
app.include_router(products.router, prefix="/api/products")
app.include_router(inventory.router, prefix="/api/inventory")
app.include_router(sales.router, prefix="/api/sales")
app.include_router(reports.router, prefix="/api/reports")

# ۲. منطق هوشمند پیدا کردن مسیر پوشه dist
if getattr(sys, 'frozen', False):
    base_dir = os.path.dirname(sys.executable)
else:
    base_dir = os.path.dirname(os.path.abspath(__file__))

frontend_dir = os.path.join(base_dir, "dist")

# چاپ مسیرها در ترمینال برای مانیتورینگ دقیق
print("\n" + "="*40)
print(f"[*] Base Directory: {base_dir}")
print(f"[*] Frontend Directory: {frontend_dir}")
print(f"[*] Frontend Exists: {os.path.exists(frontend_dir)}")
print("="*40 + "\n")

# ۳. سرو کردن فایل‌های ریکت (این بخش حتماً باید در انتهای فایل باشد)
if os.path.exists(frontend_dir):
    app.mount("/assets", StaticFiles(directory=os.path.join(frontend_dir, "assets")), name="assets")

    # هدایت صریح روت اصلی به فرانت‌اند
    @app.get("/")
    def serve_root():
        return FileResponse(os.path.join(frontend_dir, "index.html"))

    # هدایت سایر روت‌های ریکت (مثل /scanner و /sales)
    @app.api_route("/{full_path:path}", methods=["GET", "HEAD"])
    def serve_frontend(full_path: str):
        # جلوگیری از تداخل با APIهای بک‌اند
        if full_path.startswith("api/"):
            raise HTTPException(status_code=404, detail="API Route Not Found")
        return FileResponse(os.path.join(frontend_dir, "index.html"))