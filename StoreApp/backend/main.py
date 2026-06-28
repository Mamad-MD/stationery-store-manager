from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from routers import products, inventory, sales, reports

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Stationery Store Manager")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(products.router)
app.include_router(inventory.router)
app.include_router(sales.router)
app.include_router(reports.router)
@app.get("/")
def root():
    return {"message": "Server is Runing...!"}