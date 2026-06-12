from fastapi import FastAPI

# Đoạn này có sẵn trong bài của bạn rồi, không cần viết lại nếu đã có
app = FastAPI() 

@app.get("/")
def root():
    return {"message": "Welcome to ShopHub API"}

# --- THÊM ĐOẠN CODE NÀY VÀO PHÍA DƯỚI ---
@app.get("/about")
def get_about():
    return {
        "project": "ShopHub",
        "version": "1.0"
    }
# --- THÊM ĐOẠN CODE NÀY VÀO PHÍA DƯỚI CÙNG CỦA FILE ---

@app.get("/products")
def get_products():
    return [
        {
            "id": 1,
            "name": "Laptop"
        },
        {
            "id": 2,
            "name": "Mouse"
        }
    ]   
