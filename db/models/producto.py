from pydantic import BaseModel
from typing import Optional

class Product(BaseModel):
    id : str | None = None
    name : str
    precio : float
    categoria : str
    imagen : str 
    imagen_id : str | None = None
    descripcion : str
