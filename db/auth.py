import os
from fastapi import Header, HTTPException
#from dotenv import load_dotenv

def verificar_api_key(
    x_api_key: str = Header(...)
):
    #load_dotenv()
    api_key_correcta = os.getenv("ADMIN_API_KEY")

    if not api_key_correcta:
        raise HTTPException(
            status_code=500,
            detail="API Key del servidor no configurada"
        )

    if x_api_key != api_key_correcta:
        raise HTTPException(
            status_code=401,
            detail="API Key incorrecta"
        )

    return x_api_key