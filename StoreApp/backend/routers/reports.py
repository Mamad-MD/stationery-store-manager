from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from models import Product, Transaction

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("/summary")
def get_summary(db: Session = Depends(get_db)):
    products = db.query(Product).all()

    total_inventory_value = sum(p.buy_price * p.quantity for p in products)
    total_sell_value = sum(p.sell_price * p.quantity for p in products)

    total_sales = db.query(func.sum(Transaction.price)).filter(
        Transaction.type == "sell"
    ).scalar() or 0

    return {
        "total_products": len(products),
        "total_buy_value": total_inventory_value,
        "total_sell_value": total_sell_value,
        "total_sales": total_sales
    }

@router.get("/logs")
def get_logs(db: Session = Depends(get_db)):
    logs = db.query(Transaction).order_by(Transaction.timestamp.desc()).all()
    return logs