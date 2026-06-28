from __future__ import annotations
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Product, Transaction
from pydantic import BaseModel

from starlette import status

router = APIRouter(prefix="/sales", tags=["Sales"])

class SaleItem(BaseModel):
    model_config = {"arbitrary_types_allowed": True}
    barcode: str
    quantity: int

class SaleRequest(BaseModel):
    model_config = {"arbitrary_types_allowed": True}
    items: list[SaleItem]

@router.post("/")
def register_sale(data: SaleRequest, db: Session = Depends(get_db)):
    total = 0
    logs = []

    for item in data.items:
        product = db.query(Product).filter(Product.barcode == item.barcode).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {item.barcode} not found")
        if product.quantity < item.quantity:
            raise HTTPException(status_code=400, detail=f"Quantity {product.name} is less than total")

        product.quantity -= item.quantity
        amount = product.sell_price * item.quantity
        total += amount

        log = Transaction(
            type="sell",
            product_id = product.id,
            product_name = product.name,
            quantity = item.quantity,
            price = amount,
            note="فروش"
        )
        logs.append(log)

    for log in logs:
        db.add(log)
    db.commit()
    return {"message": "Successfully Sell", "total": total}