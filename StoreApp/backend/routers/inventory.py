from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Product, Transaction
from pydantic import BaseModel
from starlette import status

router = APIRouter(prefix="/inventory", tags=["Inventory"])

class InventoryUpdate(BaseModel):
    barcode: str
    quantity: int
    note: str = ""

@router.post("/add")
def add_to_inventory(data: InventoryUpdate, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.barcode == data.barcode).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    product.quantity += data.quantity

    log = Transaction(
        type="Buy",
        product_id=product.id,
        product_name=product.name,
        quantity=data.quantity,
        price=product.buy_price * data.quantity,
        note=data.note
    )

    db.add(log)
    db.commit()
    db.refresh(product)
    return {"message": "Product added successfully", "new_quantity": product.quantity}

@router.post("/remove")
def remove_frome_inventory(data: InventoryUpdate, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.barcode == data.barcode).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    if product.quantity < data.quantity:
        raise HTTPException(status_code=400, detail="Not enough stock")
    product.quantity -= data.quantity

    log = Transaction(
        type="remove",
        product_id=product.id,
        product_name=product.name,
        quantity=data.quantity,
        price=product.buy_price * data.quantity,
        note=data.note
    )

    db.add(log)
    db.commit()
    db.refresh(product)
    return {"message": "mojodi kahesh yaft", "new_quantity": data.quantity}