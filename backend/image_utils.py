import re
from pathlib import Path
from uuid import uuid4

from fastapi import HTTPException, UploadFile


BASE_DIR = Path(__file__).resolve().parent
IMAGES_DIR = BASE_DIR / "data_images"
IMAGE_EXTENSIONS = {".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"}


def ensure_image_dir() -> None:
    IMAGES_DIR.mkdir(exist_ok=True)


def is_external_image(image_path: str) -> bool:
    return image_path.startswith("http://") or image_path.startswith("https://")


def image_path_to_url(image_path: str) -> str:
    if is_external_image(image_path):
        return image_path
    if image_path.startswith("/images/"):
        return image_path
    return f"/images/{Path(image_path).name}"


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

    ensure_image_dir()
    image_path = IMAGES_DIR / filename
    image_path.write_bytes(image_bytes)
    return filename


def delete_local_image(image_path: str) -> None:
    if not image_path or is_external_image(image_path):
        return

    candidate = safe_image_path(Path(image_path).name)
    if candidate.exists():
        candidate.unlink()
