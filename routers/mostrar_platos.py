from fastapi import APIRouter
from db.cliente import db
from db.schemas.plato import plato_schema
from db.models.producto import Product
from bson import ObjectId

router = APIRouter(prefix="/mostrar_platos",
                   tags=["mostrar_platos"],
                   responses={404:{"message": "no encontrado"}}
                   )

@router.get("/")
async def mostrar_todo():
    return await all_platos()

@router.get("/{categoria}",status_code=200)
async def mostrar_platos(categoria : str ):
    if categoria == "todos":
        return await all_platos()
    else:
        resultados = search_categoria(categoria)
    
        return resultados

@router.get("/all/categoria",status_code=200)
async def all_categorias():
    res = await all_platos()
    lista = []
    for item in res:
        if not item["categoria"] in lista:
            lista.append(item["categoria"])
        
    return lista


def search_categoria(categoria:str) -> list[dict]:
    platos_bd = db["platos"].find({"categoria" : categoria})
    resultados = [plato_schema(plato) for plato in platos_bd]
    return resultados
    
async def all_platos():
    """
    Docstring for all_platos
    """
    platos_bd = db["platos"].find()
   
    resultado = [plato_schema(plato) for plato in platos_bd]
    return resultado

def obtener_plato_por_id(plato_id : str):
    plato = db["platos"].find_one({"_id" : ObjectId(plato_id)})
    if plato:
        plato["id"] = str(plato["_id"])
    return plato
