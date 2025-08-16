from pydantic import BaseModel
from typing import Optional

class BookBase(BaseModel):
    title: str
    author: str
    category: str
    language: str | None = None
    cover_image_url: str | None = None
    file_path: str
    description: str | None = None
    rating: float | None = None
    is_read: bool = False

class BookCreate(BookBase):
    pass

class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    category: Optional[str] = None
    language: Optional[str] = None
    cover_image_url: Optional[str] = None
    description: Optional[str] = None
    rating: Optional[float] = None
    is_read: Optional[bool] = None

class Book(BookBase):
    id: int

    class Config:
        from_attributes = True

class ConversionResponse(BaseModel):
    download_url: str

class RagUploadResponse(BaseModel):
    book_id: str
    message: str

class RagQuery(BaseModel):
    query: str
    book_id: str

class RagQueryResponse(BaseModel):
    response: str