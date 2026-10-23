from fastapi import APIRouter, Request, Form, HTTPException
from starlette.status import HTTP_303_SEE_OTHER
from fastapi.templating import Jinja2Templates
from routers.mostrar_platos import obtener_plato_por_id   # función síncrona
from fastapi.responses import JSONResponse, RedirectResponse

router = APIRouter(prefix="/carrito", tags=["carrito"])
templates = Jinja2Templates(directory="templates")   # sin "/"

@router.post("/add/{plato_id}")
async def add_to_cart(request: Request, plato_id: str):
    # Obtener plato (sin await si es síncrona)
    print(plato_id)
    
    plato = obtener_plato_por_id(plato_id)
    if not plato:
        raise HTTPException(status_code=404, detail="Plato no encontrado")
    
    cart = request.session.get("carrito", {})
    cart_key = str(plato_id)
    
    if cart_key in cart:
        cart[cart_key]["cantidad"] += 1
    else:
        cart[cart_key] = {
            "id": plato_id,
            "name": plato["name"],   # Ajusta según el campo real en tu BD
            "precio": plato["precio"],
            "cantidad": 1
        }
    
    request.session["carrito"] = cart
    
    return JSONResponse(status_code=200, content={"message": "Agregado", "cart": cart})

@router.get("")
async def view_cart(request: Request):
    cart = request.session.get("carrito", {})
    total = sum(item["precio"] * item["cantidad"] for item in cart.values())
    return templates.TemplateResponse("cart.html", {"request": request, "cart": cart, "total": total})

@router.post("/remove/{plato_id}")
async def remove_from_cart(request: Request, plato_id: str):
    cart = request.session.get("carrito", {})
    if plato_id in cart:
        del cart[plato_id]
        request.session["carrito"] = cart
    return RedirectResponse(url="/carrito", status_code=HTTP_303_SEE_OTHER)

@router.post("/update/{plato_id}")
async def update_cart_item(request: Request, plato_id: str, cantidad: int = Form(...)):
    cart = request.session.get("carrito", {})
    if plato_id in cart:
        if cantidad > 0:
            cart[plato_id]["cantidad"] = cantidad
        else:
            del cart[plato_id]
        request.session["carrito"] = cart
    return RedirectResponse(url="/carrito", status_code=HTTP_303_SEE_OTHER)