from typing import Optional

from pydantic import BaseModel, ConfigDict, EmailStr, Field, field_validator


class UserBase(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=3, max_length=100)
    role: Optional[str] = Field(default="customer", min_length=3, max_length=20)

    @field_validator("full_name", "role", mode="before")
    @classmethod
    def trim_text(cls, value):
        if value is None:
            return value
        if isinstance(value, str):
            return value.strip()
        return value


class UserCreate(UserBase):
    password: str = Field(..., min_length=6)


class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    email: EmailStr
    full_name: str
    role: str
