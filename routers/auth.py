from fastapi import APIRouter, Depends
from db.auth import verificar_api_key

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

@router.get("/verificar")
async def verificar_administrador(
    api_key: str = Depends(verificar_api_key)
):
    return {
        "autorizado": True,
        "mensaje": "Administrador autorizado"
    }