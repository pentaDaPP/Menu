from fastapi import FastAPI, Request, HTTPException , Depends, Header, status
from fastapi.responses import HTMLResponse, PlainTextResponse, Response
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from routers import agg_platosdb, mostrar_platos, update_plato, carrito,auth, cloudinary_config, delete_plato
from starlette.middleware.sessions import SessionMiddleware
import os
from db.auth import verificar_api_key

app = FastAPI()

# Incluir routers
app.include_router(agg_platosdb.router)
app.include_router(mostrar_platos.router)
app.include_router(update_plato.router)
app.include_router(carrito.router)
app.include_router(auth.router)
app.include_router(delete_plato.router)


app.mount("/static/css" , StaticFiles(directory="static/css"),name="css")
app.mount("/static/img" , StaticFiles(directory="static/img") , name= "img")
app.mount("/js" , StaticFiles(directory="js"),name="js")

# Plantillas
templates = Jinja2Templates(directory="templates")

# Clave secreta para sesiones
SECRET_KEY = os.environ.get("SECRET_KEY", "mi_clave_secreta_cambiar")
app.add_middleware(SessionMiddleware, secret_key=SECRET_KEY)



@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    site_url = os.environ.get("SITE_URL", str(request.base_url).rstrip("/"))
    try:
        categorias = await mostrar_platos.all_categorias()
    except Exception:
        categorias = []
    return templates.TemplateResponse("index2.html", {
        "request": request,
        "categorias": categorias,
        "categoria_actual": "todos",
        "cart_count": 0,
        "site_url": site_url.rstrip("/")
    })


@app.get("/robots.txt", response_class=PlainTextResponse)
async def robots(request: Request):
    site_url = os.environ.get("SITE_URL", str(request.base_url)).rstrip("/")
    return f"User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: {site_url}/sitemap.xml\n"


@app.get("/sitemap.xml")
async def sitemap(request: Request):
    site_url = os.environ.get("SITE_URL", str(request.base_url)).rstrip("/")
    xml = (
        '<?xml version="1.0" encoding="UTF-8"?>'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
        f'<url><loc>{site_url}/</loc><changefreq>weekly</changefreq><priority>1.0</priority></url>'
        '</urlset>'
    )
    return Response(content=xml, media_type="application/xml")


@app.get("/admin",response_class=HTMLResponse)
async def admin(request : Request ):
    return templates.TemplateResponse("admin.html",{
        "request" : request
    })

