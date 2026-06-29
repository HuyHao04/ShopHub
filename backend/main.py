import json
from contextlib import asynccontextmanager
from json import JSONDecodeError
from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import ValidationError

from database import Base, SessionLocal, engine
from image_utils import ensure_image_dir, safe_image_path
from models.product import ProductDB
from models.user import UserDB
from routers import products, users
from schemas.product import ProductCreate


BASE_DIR = Path(__file__).resolve().parent
LEGACY_PRODUCTS_FILE = BASE_DIR / "data" / "products.json"


def seed_products_from_legacy_json() -> None:
    if not LEGACY_PRODUCTS_FILE.exists():
        return

    db = SessionLocal()
    try:
        if db.query(ProductDB).first():
            return

        try:
            legacy_products = json.loads(LEGACY_PRODUCTS_FILE.read_text(encoding="utf-8"))
        except JSONDecodeError:
            print("Legacy products.json is invalid, skipping database seed.")
            return

        if not isinstance(legacy_products, list):
            print("Legacy products.json is not a list, skipping database seed.")
            return

        seeded_count = 0
        for legacy_product in legacy_products:
            image_path = (
                legacy_product.get("imagePath")
                or legacy_product.get("imageUrl")
                or legacy_product.get("image_path")
            )
            if not image_path:
                continue

            try:
                product_input = ProductCreate(
                    name=legacy_product.get("name") or legacy_product.get("title"),
                    price=legacy_product.get("price"),
                    category=legacy_product.get("category"),
                    description=legacy_product.get("description"),
                    imageUrl=image_path,
                )
            except ValidationError:
                continue

            db.add(
                ProductDB(
                    name=product_input.name,
                    price=product_input.price,
                    category=product_input.category,
                    description=product_input.description,
                    image_path=product_input.imageUrl,
                )
            )
            seeded_count += 1

        if seeded_count:
            db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    ensure_image_dir()
    Base.metadata.create_all(bind=engine)
    seed_products_from_legacy_json()
    yield


app = FastAPI(title="ShopHub Product API", version="1.2.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)

app.include_router(products.router)
app.include_router(users.router)


@app.get("/")
def root():
    return {"message": "Welcome to ShopHub API"}


@app.get("/about")
def get_about():
    return {
        "project": "ShopHub",
        "version": "1.2.0",
        "storage": "PostgreSQL",
    }


@app.get("/images/{filename}")
def get_image(filename: str):
    image_path = safe_image_path(filename)
    if not image_path.exists() or not image_path.is_file():
        raise HTTPException(status_code=404, detail="Image not found")
    return FileResponse(image_path)
