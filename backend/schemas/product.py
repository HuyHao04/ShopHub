from typing import Optional

from pydantic import BaseModel, ConfigDict, Field, field_validator


class ProductBase(BaseModel):
    name: str = Field(..., min_length=3, max_length=100)
    price: float = Field(..., gt=0)
    category: str = Field(..., min_length=3, max_length=50)
    description: str = Field(..., min_length=5)

    @field_validator("name", "category", "description", mode="before")
    @classmethod
    def trim_required_text(cls, value):
        if isinstance(value, str):
            return value.strip()
        return value


class ProductCreate(ProductBase):
    imageUrl: Optional[str] = None

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


class ProductRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

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
    items: list[ProductRead]
