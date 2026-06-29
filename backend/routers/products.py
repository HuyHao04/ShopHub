import json
from typing import Optional

from fastapi import APIRouter, Depends, File, Form, HTTPException, Query, Request, UploadFile, status
from fastapi.responses import Response
from pydantic import ValidationError
from sqlalchemy import func, or_
from sqlalchemy.orm import Session

from database import get_db
from image_utils import delete_local_image, image_path_to_url, save_upload
from models.product import ProductDB
from schemas.product import ProductCreate, ProductListResponse, ProductRead, ProductUpdate


router = APIRouter(prefix="/products", tags=["products"])


def validation_detail(error: ValidationError):
    return json.loads(error.json())


def to_product_read(product: ProductDB) -> ProductRead:
    return ProductRead(
        id=product.id,
        name=product.name,
        price=product.price,
        category=product.category,
        description=product.description,
        imageUrl=image_path_to_url(product.image_path),
    )


def get_product_or_404(db: Session, product_id: int) -> ProductDB:
    product = db.query(ProductDB).filter(ProductDB.id == product_id).first()
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Product not found")
    return product


def has_uploaded_file(image_file: Optional[UploadFile]) -> bool:
    return image_file is not None and bool(image_file.filename)


async def parse_product_create(
    request: Request,
    name: Optional[str],
    price: Optional[float],
    category: Optional[str],
    description: Optional[str],
    imageUrl: Optional[str],
) -> ProductCreate:
    content_type = request.headers.get("content-type", "")
    if "application/json" in content_type:
        try:
            return ProductCreate.model_validate(await request.json())
        except ValidationError as exc:
            raise HTTPException(status_code=422, detail=validation_detail(exc)) from exc

    missing_fields = [
        field_name
        for field_name, value in {
            "name": name,
            "price": price,
            "category": category,
            "description": description,
        }.items()
        if value is None
    ]
    if missing_fields:
        raise HTTPException(
            status_code=422,
            detail=f"Missing required form fields: {', '.join(missing_fields)}",
        )

    try:
        return ProductCreate(
            name=name,
            price=price,
            category=category,
            description=description,
            imageUrl=imageUrl,
        )
    except ValidationError as exc:
        raise HTTPException(status_code=422, detail=validation_detail(exc)) from exc


async def parse_product_update(
    request: Request,
    name: Optional[str],
    price: Optional[float],
    category: Optional[str],
    description: Optional[str],
    imageUrl: Optional[str],
) -> ProductUpdate:
    content_type = request.headers.get("content-type", "")
    if "application/json" in content_type:
        try:
            return ProductUpdate.model_validate(await request.json())
        except ValidationError as exc:
            raise HTTPException(status_code=422, detail=validation_detail(exc)) from exc

    try:
        return ProductUpdate(
            name=name,
            price=price,
            category=category,
            description=description,
            imageUrl=imageUrl,
        )
    except ValidationError as exc:
        raise HTTPException(status_code=422, detail=validation_detail(exc)) from exc


@router.get("", response_model=ProductListResponse)
def list_products(
    category: Optional[str] = None,
    min_price: Optional[float] = Query(None, ge=0),
    max_price: Optional[float] = Query(None, ge=0),
    search: Optional[str] = None,
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    if min_price is not None and max_price is not None and min_price > max_price:
        raise HTTPException(status_code=400, detail="min_price cannot be greater than max_price")

    query = db.query(ProductDB)

    if category:
        query = query.filter(func.lower(ProductDB.category) == category.strip().lower())

    if min_price is not None:
        query = query.filter(ProductDB.price >= min_price)

    if max_price is not None:
        query = query.filter(ProductDB.price <= max_price)

    if search:
        search_term = f"%{search.strip()}%"
        query = query.filter(
            or_(
                ProductDB.name.ilike(search_term),
                ProductDB.description.ilike(search_term),
            )
        )

    total = query.count()
    products = (
        query.order_by(ProductDB.id)
        .offset((page - 1) * size)
        .limit(size)
        .all()
    )

    return ProductListResponse(
        total=total,
        page=page,
        size=size,
        items=[to_product_read(product) for product in products],
    )


@router.get("/{product_id}", response_model=ProductRead)
def get_product(product_id: int, db: Session = Depends(get_db)):
    return to_product_read(get_product_or_404(db, product_id))


@router.post("", response_model=ProductRead, status_code=status.HTTP_201_CREATED)
async def create_product(
    request: Request,
    name: Optional[str] = Form(None),
    price: Optional[float] = Form(None),
    category: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    imageUrl: Optional[str] = Form(None),
    image_file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    product_input = await parse_product_create(
        request=request,
        name=name,
        price=price,
        category=category,
        description=description,
        imageUrl=imageUrl,
    )

    if has_uploaded_file(image_file):
        image_path = await save_upload(image_file)
    elif product_input.imageUrl:
        image_path = product_input.imageUrl
    else:
        raise HTTPException(
            status_code=422,
            detail="Product image is required. Provide imageUrl or image_file.",
        )

    product = ProductDB(
        name=product_input.name,
        price=product_input.price,
        category=product_input.category,
        description=product_input.description,
        image_path=image_path,
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return to_product_read(product)


@router.put("/{product_id}", response_model=ProductRead)
async def update_product(
    product_id: int,
    request: Request,
    name: Optional[str] = Form(None),
    price: Optional[float] = Form(None),
    category: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    imageUrl: Optional[str] = Form(None),
    image_file: Optional[UploadFile] = File(None),
    db: Session = Depends(get_db),
):
    product = get_product_or_404(db, product_id)
    product_input = await parse_product_update(
        request=request,
        name=name,
        price=price,
        category=category,
        description=description,
        imageUrl=imageUrl,
    )
    old_image_path = product.image_path

    if product_input.name is not None:
        product.name = product_input.name
    if product_input.price is not None:
        product.price = product_input.price
    if product_input.category is not None:
        product.category = product_input.category
    if product_input.description is not None:
        product.description = product_input.description

    if has_uploaded_file(image_file):
        product.image_path = await save_upload(image_file)
    elif product_input.imageUrl:
        product.image_path = product_input.imageUrl

    db.commit()
    db.refresh(product)

    if product.image_path != old_image_path:
        delete_local_image(old_image_path)

    return to_product_read(product)


@router.delete("/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int, db: Session = Depends(get_db)):
    product = get_product_or_404(db, product_id)
    old_image_path = product.image_path
    db.delete(product)
    db.commit()
    delete_local_image(old_image_path)
    return Response(status_code=status.HTTP_204_NO_CONTENT)
