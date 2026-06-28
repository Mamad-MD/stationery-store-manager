from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Product, Transaction
from pydantic import BaseModel
from starlette import status

router = APIRouter(prefix="/products", tags=["Products"])

class ProductCreate(BaseModel):
    barcode: str
    name: str
    buy_price: float
    sell_price: float
    quantity: int = 0

@router.post("/")
def create_product(data: ProductCreate, db: Session = Depends(get_db)):
    existing = db.query(Product).filter(Product.barcode == data.barcode).first()
    if existing:
        raise HTTPException(status_code=400, detail="Product with barcode {} already exists".format(data.barcode))
    product = Product(**data.model_dump())
    db.add(product)
    db.commit()
    db.refresh(product)
    return product

@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product with id {} does not exist".format(product_id))
    db.delete(product)
    db.commit()
    return {"message": "Product with id {} deleted".format(product_id)}