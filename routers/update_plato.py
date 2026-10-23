from fastapi import APIRouter  , Depends
from db.models.producto import Product
from db.cliente import db
from db.schemas.plato import plato_schema
from db.auth import verificar_api_key


router = APIRouter(prefix="/update_plato",
                   tags=["update_plato"],
                   responses={404:{"message":"no encontrado"}})

@router.put("/",status_code=200)
async def update_plato(plato : Product , api_key:str = Depends(verificar_api_key)):
    """
    Docstring for update_plato
    
    :param plato: Description
    :type plato: Product
    """

    user_dict = dict(plato)
    del user_dict["id"]
   
    try:
        res = db["platos"].find_one_and_replace({"name" : plato.name} , user_dict )
    except ImportError:
        return {"error" : "el usuario no se ha actualizado"}

    res = plato_schema(res)
    return Product(**res)
