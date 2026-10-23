from fastapi import APIRouter, HTTPException, Depends ,Form,File,UploadFile
from db.models.producto import Product
from db.cliente import db
from db.schemas.plato import plato_schema
from routers.mostrar_platos import all_platos
from db.auth import verificar_api_key
import os
import cloudinary.uploader

router = APIRouter(prefix="/agg_platos",
                   tags=["agg_platos"],
                   responses={404:{"message":"no encontrado"}})


@router.post("/", status_code=201)
async def agg_plato(
    nombre: str = Form(...),
    precio: float = Form(...),
    descripcion: str = Form(...),
    categoria: str = Form(...),
    imagen: UploadFile = File(...),
    api_key: str = Depends(verificar_api_key)
):
    
    
    if(type(search_plato(nombre))) == Product:
        raise HTTPException(status_code=404,detail="el plato ya se encuentra")
    else:
        try:
            resultado = cloudinary.uploader.upload(imagen.file) 
            url_imagen = resultado["secure_url"]
            imagen_id = resultado["public_id"]
        except:
                url_imagen = "/static/img/space.jpg"
                imagen_id = "1"
                
                
        product_dict = {
                    "name" : nombre,
                    "precio" : precio,
                    "descripcion" : descripcion,
                    "categoria": categoria,
                    "imagen" : url_imagen,
                    "imagen_id" : imagen_id
                }

        id = db["platos"].insert_one(product_dict).inserted_id

        new_plato = plato_schema(db["platos"].find_one({"_id" : id }))
        
        return Product(**new_plato)

def search_plato(name : str):
    
    try:
        plato = plato_schema(db["platos"].find_one({"name" : name}))
        return Product(**plato)
    except:
        return "no se ha encontrado al plato"
