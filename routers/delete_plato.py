from fastapi import APIRouter,Depends,HTTPException
from db.auth import verificar_api_key
from db.cliente import db
from bson import ObjectId
import cloudinary.uploader



router = APIRouter(
                prefix="/delete_plato",
                tags=["delete_plato"],
                responses={404:{"message":"no encontrado"}}
)

@router.delete("/{id}",status_code=200)
def eliminar_plato(id : str , api_key : str = Depends(verificar_api_key)):
    plato_id = db["platos"].find_one({"_id" : ObjectId(id)})
    
    if not plato_id:
        raise HTTPException(status_code=404,detail="el plato no se encuentra")

    #eliminar de cloudinary
    
    if plato_id.get("imagen_id"):
        cloudinary.uploader.destroy(plato_id["imagen_id"])
    
            
    
    #eliminar plato de mongodb
    resultado = db["platos"].delete_one({"_id" : ObjectId(id)})
    
    if resultado.deleted_count ==0:
        raise HTTPException(status_code=500,detail="No se pudo eliminar el plato")
        
    return {"message":"Plato eliminado correctamente"}
    