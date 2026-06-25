import json
import re
from json import JSONDecodeError
from pathlib import Path
from typing import Optional
from uuid import uuid4

from fastapi import FastAPI, File, Form, HTTPException, Query, UploadFile, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, Response
from pydantic import BaseModel, Field, ValidationError, field_validator


BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
IMAGES_DIR = BASE_DIR / "data_images"
PRODUCTS_FILE = DATA_DIR / "products.json"
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"}


app = FastAPI(title="ShopHub Product API", version="1.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)


class Product(BaseModel):
    id: int
    name: str = Field(..., min_length=3, max_length=100)
    price: float = Field(..., gt=0)
    category: str = Field(..., min_length=3, max_length=50)
    description: str = Field(..., min_length=5)
    imagePath: str = Field(..., min_length=1)
    costPrice: Optional[float] = None

    @field_validator("name", "category", "description", "imagePath", mode="before")
    @classmethod
    def trim_required_text(cls, value):
        if isinstance(value, str):
            return value.strip()
        return value


class ProductCreate(BaseModel):
    name: str = Field(..., min_length=3, max_length=100)
    price: float = Field(..., gt=0)
    category: str = Field(..., min_length=3, max_length=50)
    description: str = Field(..., min_length=5)
    imageUrl: Optional[str] = None

    @field_validator("name", "category", "description", mode="before")
    @classmethod
    def trim_required_text(cls, value):
        if isinstance(value, str):
            return value.strip()
        return value

    @field_validator("imageUrl", mode="before")
    @classmethod
    def trim_optional_url(cls, value):
        if value is None:
            return None
        if isinstance(value, str):
            value = value.strip()
            return value or None
        return value


class ProductUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=3, max_length=100)
    price: Optional[float] = Field(None, gt=0)
    category: Optional[str] = Field(None, min_length=3, max_length=50)
    description: Optional[str] = Field(None, min_length=5)
    imageUrl: Optional[str] = None

    @field_validator("name", "category", "description", mode="before")
    @classmethod
    def trim_optional_text(cls, value):
        if value is None:
            return None
        if isinstance(value, str):
            return value.strip()
        return value

    @field_validator("imageUrl", mode="before")
    @classmethod
    def trim_optional_url(cls, value):
        if value is None:
            return None
        if isinstance(value, str):
            value = value.strip()
            return value or None
        return value


class ProductPublic(BaseModel):
    id: int
    name: str
    price: float
    category: str
    description: str
    imageUrl: str


class ProductListResponse(BaseModel):
    total: int
    page: int
    size: int
    items: list[ProductPublic]


SEED_PRODUCTS = [
    {
        "id": 1,
        "name": "Fjallraven Everyday Backpack",
        "price": 109.95,
        "category": "Bags",
        "description": "Durable everyday backpack with a padded laptop sleeve and roomy storage for school, work, or travel.",
        "imagePath": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
        "costPrice": 65.0,
    },
    {
        "id": 2,
        "name": "Mens Casual Premium Slim Fit T-Shirt",
        "price": 22.30,
        "category": "Men's Clothing",
        "description": "Soft slim-fit cotton blend shirt with contrast raglan sleeves and a comfortable lightweight feel.",
        "imagePath": "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
        "costPrice": 12.0,
    },
    {
        "id": 3,
        "name": "Mens Cotton Jacket",
        "price": 55.99,
        "category": "Men's Clothing",
        "description": "Lightweight outerwear jacket suitable for spring, autumn, hiking, camping, and casual daily wear.",
        "imagePath": "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
        "costPrice": 31.5,
    },
    {
        "id": 4,
        "name": "Solid Gold Petite Micropave",
        "price": 168.00,
        "category": "Jewelry",
        "description": "Elegant petite micropave ring designed for special occasions and polished everyday styling.",
        "imagePath": "https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg",
        "costPrice": 96.0,
    },
    {
        "id": 5,
        "name": "SanDisk SSD PLUS 1TB",
        "price": 109.00,
        "category": "Electronics",
        "description": "Reliable solid state drive with fast read speeds for upgrading laptops, desktops, and coursework machines.",
        "imagePath": "https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg",
        "costPrice": 72.0,
    },
]


def ensure_storage() -> None:
    DATA_DIR.mkdir(exist_ok=True)
    IMAGES_DIR.mkdir(exist_ok=True)

    if not PRODUCTS_FILE.exists() or PRODUCTS_FILE.stat().st_size == 0:
        PRODUCTS_FILE.write_text(json.dumps(SEED_PRODUCTS, indent=2), encoding="utf-8")


def load_products() -> list[Product]:
    ensure_storage()

    try:
        raw_products = json.loads(PRODUCTS_FILE.read_text(encoding="utf-8"))
    except JSONDecodeError as exc:
        raise HTTPException(status_code=500, detail="products.json contains invalid JSON") from exc

    if not isinstance(raw_products, list):
        raise HTTPException(status_code=500, detail="products.json must contain a product list")

    products = []
    for raw_product in raw_products:
        if "imagePath" not in raw_product and "imageUrl" in raw_product:
            raw_product["imagePath"] = raw_product["imageUrl"]
        products.append(Product.model_validate(raw_product))
    return products


def save_products(products: list[Product]) -> None:
    DATA_DIR.mkdir(exist_ok=True)
    product_data = [product.model_dump() for product in products]
    PRODUCTS_FILE.write_text(json.dumps(product_data, indent=2), encoding="utf-8")


def next_product_id(products: list[Product]) -> int:
    return max((product.id for product in products), default=0) + 1


def is_external_image(image_path: str) -> bool:
    return image_path.startswith("http://") or image_path.startswith("https://")


def to_public_product(product: Product) -> ProductPublic:
    if is_external_image(product.imagePath):
        image_url = product.imagePath
    elif product.imagePath.startswith("/images/"):
        image_url = product.imagePath
    else:
        image_url = f"/images/{Path(product.imagePath).name}"

    return ProductPublic(
        id=product.id,
        name=product.name,
        price=product.price,
        category=product.category,
        description=product.description,
        imageUrl=image_url,
    )


def validation_exception(error: ValidationError) -> HTTPException:
    return HTTPException(status_code=422, detail=json.loads(error.json()))


def find_product_index(products: list[Product], product_id: int) -> int:
    for index, product in enumerate(products):
        if product.id == product_id:
            return index
    raise HTTPException(status_code=404, detail="Product not found")


def safe_image_path(filename: str) -> Path:
    if filename != Path(filename).name:
        raise HTTPException(status_code=404, detail="Image not found")

    image_path = (IMAGES_DIR / filename).resolve()
    try:
        image_path.relative_to(IMAGES_DIR.resolve())
    except ValueError as exc:
        raise HTTPException(status_code=404, detail="Image not found") from exc

    return image_path


def safe_upload_filename(original_filename: str) -> str:
    original_path = Path(original_filename or "product-image")
    suffix = original_path.suffix.lower()
    if suffix not in IMAGE_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Upload must be an image file")

    base_name = original_path.stem or "product-image"
    base_name = re.sub(r"[^A-Za-z0-9_.-]+", "-", base_name).strip(".-")
    base_name = base_name[:40] or "product-image"
    return f"{uuid4().hex}_{base_name}{suffix}"


async def save_upload(image_file: UploadFile) -> str:
    filename = safe_upload_filename(image_file.filename or "product-image.jpg")
    image_bytes = await image_file.read()
    if not image_bytes:
        raise HTTPException(status_code=400, detail="Uploaded image cannot be empty")

    IMAGES_DIR.mkdir(exist_ok=True)
    image_path = IMAGES_DIR / filename
    image_path.write_bytes(image_bytes)
    return filename


def delete_local_image(image_path: str) -> None:
    if not image_path or is_external_image(image_path):
        return

    filename = Path(image_path).name
    candidate = safe_image_path(filename)
    if candidate.exists():
        candidate.unlink()


ensure_storage()


@app.get("/")
def root():
    return {"message": "Welcome to ShopHub API"}


@app.get("/about")
def get_about():
    return {
        "project": "ShopHub",
        "version": "1.1.0",
    }


@app.get("/products", response_model=ProductListResponse)
def get_products(
    category: Optional[str] = None,
    min_price: Optional[float] = Query(None, ge=0),
    max_price: Optional[float] = Query(None, ge=0),
    search: Optional[str] = None,
    page: int = Query(1, ge=1),
    size: int = Query(10, ge=1, le=100),
):
    if min_price is not None and max_price is not None and min_price > max_price:
        raise HTTPException(status_code=400, detail="min_price cannot be greater than max_price")

    products = load_products()
    filtered_products = products

    if category:
        category_term = category.strip().lower()
        filtered_products = [
            product for product in filtered_products if product.category.lower() == category_term
        ]

    if min_price is not None:
        filtered_products = [product for product in filtered_products if product.price >= min_price]

    if max_price is not None:
        filtered_products = [product for product in filtered_products if product.price <= max_price]

    if search:
        search_term = search.strip().lower()
        filtered_products = [
            product
            for product in filtered_products
            if search_term in product.name.lower() or search_term in product.description.lower()
        ]

    total = len(filtered_products)
    start = (page - 1) * size
    end = start + size
    items = [to_public_product(product) for product in filtered_products[start:end]]

    return ProductListResponse(total=total, page=page, size=size, items=items)


@app.get("/products/{product_id}", response_model=ProductPublic)
def get_product(product_id: int):
    products = load_products()
    product = products[find_product_index(products, product_id)]
    return to_public_product(product)


@app.post("/products", response_model=ProductPublic, status_code=status.HTTP_201_CREATED)
async def create_product(
    name: str = Form(...),
    price: float = Form(...),
    category: str = Form(...),
    description: str = Form(...),
    imageUrl: Optional[str] = Form(None),
    image_file: Optional[UploadFile] = File(None),
):
    try:
        product_input = ProductCreate(
            name=name,
            price=price,
            category=category,
            description=description,
            imageUrl=imageUrl,
        )
    except ValidationError as exc:
        raise validation_exception(exc) from exc

    has_upload = image_file is not None and bool(image_file.filename)
    if has_upload:
        image_path = await save_upload(image_file)
    elif product_input.imageUrl:
        image_path = product_input.imageUrl
    else:
        raise HTTPException(
            status_code=422,
            detail="Product image is required. Provide imageUrl or image_file.",
        )

    products = load_products()
    product = Product(
        id=next_product_id(products),
        name=product_input.name,
        price=product_input.price,
        category=product_input.category,
        description=product_input.description,
        imagePath=image_path,
        costPrice=None,
    )
    products.append(product)
    save_products(products)

    return to_public_product(product)


@app.put("/products/{product_id}", response_model=ProductPublic)
async def update_product(
    product_id: int,
    name: Optional[str] = Form(None),
    price: Optional[float] = Form(None),
    category: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    imageUrl: Optional[str] = Form(None),
    image_file: Optional[UploadFile] = File(None),
):
    try:
        product_input = ProductUpdate(
            name=name,
            price=price,
            category=category,
            description=description,
            imageUrl=imageUrl,
        )
    except ValidationError as exc:
        raise validation_exception(exc) from exc

    products = load_products()
    product_index = find_product_index(products, product_id)
    current_product = products[product_index]
    product_data = current_product.model_dump()
    old_image_path = current_product.imagePath

    for field in ("name", "price", "category", "description"):
        value = getattr(product_input, field)
        if value is not None:
            product_data[field] = value

    has_upload = image_file is not None and bool(image_file.filename)
    if has_upload:
        product_data["imagePath"] = await save_upload(image_file)
    elif product_input.imageUrl:
        product_data["imagePath"] = product_input.imageUrl

    updated_product = Product.model_validate(product_data)
    products[product_index] = updated_product
    save_products(products)

    if updated_product.imagePath != old_image_path:
        delete_local_image(old_image_path)

    return to_public_product(updated_product)


@app.delete("/products/{product_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_product(product_id: int):
    products = load_products()
    product_index = find_product_index(products, product_id)
    product = products.pop(product_index)
    save_products(products)
    delete_local_image(product.imagePath)
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@app.get("/images/{filename}")
def get_image(filename: str):
    image_path = safe_image_path(filename)
    if not image_path.exists() or not image_path.is_file():
        raise HTTPException(status_code=404, detail="Image not found")
    return FileResponse(image_path)
