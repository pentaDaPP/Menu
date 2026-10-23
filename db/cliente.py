from pymongo import MongoClient
import os
from dotenv import load_dotenv
import asyncio

'''
client_sync = MongoClient()
db = client_sync["platos"]
'''
load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
if not MONGODB_URI:
    raise ValueError("❌ MONGODB_URI no está definida en las variables de entorno. Revisa tu archivo .env.")

# Cliente síncrono de PyMongo
client_sync  = MongoClient(MONGODB_URI)
db = client_sync["restaurante"]  # Ajusta el nombre de tu base de datos

# Helper para ejecutar funciones síncronas en un hilo
async def ejecutar_sincrono(func, *args, **kwargs):
    return await asyncio.to_thread(func, *args, **kwargs)
