from sqlalchemy import Column, Integer, String, Float, Boolean
from database import Base

class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    author = Column(String, index=True)
    category = Column(String, index=True)
    language = Column(String, index=True, nullable=True)
    cover_image_url = Column(String, nullable=True)
    file_path = Column(String, unique=True) # Ruta al archivo original
    description = Column(String, nullable=True)
    rating = Column(Float, nullable=True)
    is_read = Column(Boolean, default=False, nullable=False)
