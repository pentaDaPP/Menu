/* =========================================================
   VARIABLES
========================================================= */

let platos = [];
let categoriaActual = "Todos";


/* =========================================================
   ELEMENTOS DEL HTML
========================================================= */

const listaPlatos = document.getElementById("lista-platos");
const sinProductos = document.getElementById("sin-productos");
const filtros = document.getElementById("filtros");
const menuToggle = document.getElementById("menu-toggle");
const nav = document.querySelector("nav");


/* =========================================================
   CARGAR PLATOS DESDE FASTAPI
========================================================= */

async function cargarPlatos() {

    try {

        const respuesta = await fetch("/mostrar_platos/");

        if (!respuesta.ok) {
            throw new Error("No se pudieron cargar los platos");
        }

        const datos = await respuesta.json();

        /*
         * La API puede devolver directamente:
         *
         * [
         *     {...},
         *     {...}
         * ]
         *
         * o:
         *
         * {
         *     "platos": [...]
         * }
         */

        if (Array.isArray(datos)) {

            platos = datos;

        } else if (Array.isArray(datos.platos)) {

            platos = datos.platos;

        } else {

            platos = [];

        }
        renderFiltros();
        mostrarPlatos();

    } catch (error) {

        console.error("Error:", error);

        listaPlatos.innerHTML = "";

        sinProductos.style.display = "block";

        sinProductos.querySelector("h3").textContent =
            "No se pudieron cargar los platos";

        sinProductos.querySelector("p").textContent =
            "Comprueba que FastAPI esté funcionando correctamente.";
    }
}


/* =========================================================
   MOSTRAR PLATOS
========================================================= */

function mostrarPlatos() {

    // Limpiar productos anteriores
    listaPlatos.innerHTML = "";


    // Filtrar por categoría
    const platosFiltrados = platos.filter(plato => {

        if (categoriaActual === "Todos") {
            return true;
        }

        return normalizarTexto(plato.categoria) ===
               normalizarTexto(categoriaActual);
    });


    // Si no existen productos
    if (platosFiltrados.length === 0) {

        sinProductos.style.display = "block";

        return;
    }


    // Ocultar mensaje
    sinProductos.style.display = "none";


    // Crear una tarjeta por cada plato
    platosFiltrados.forEach(plato => {

        const tarjeta = crearTarjetaPlato(plato);

        listaPlatos.appendChild(tarjeta);

    });
}


/* =========================================================
   CREAR TARJETA DE PRODUCTO
========================================================= */

function crearTarjetaPlato(plato) {

    // Crear tarjeta
    const tarjeta = document.createElement("article");

    tarjeta.classList.add("product-card");


    // Crear imagen
    const imagen = document.createElement("img");

    imagen.src = obtenerRutaImagen(plato.imagen);

    imagen.alt = plato.nombre || plato.name || "Plato de nuestra carta";
    imagen.loading = "lazy";
    imagen.decoding = "async";
    imagen.width = 600;
    imagen.height = 400;


    // Imagen alternativa si falla
    imagen.onerror = function () {

        this.src = "/static/img/plato-placeholder.jpg";

    };


    // Contenedor del contenido
    const contenido = document.createElement("div");

    contenido.classList.add("product-card-content");


    // Nombre
    const nombre = document.createElement("h3");

    nombre.textContent =
        plato.nombre || plato.name || "Sin nombre";


    // Descripción
    const descripcion = document.createElement("p");

    descripcion.textContent =
        plato.descripcion ||
        "Delicioso plato de nuestra carta.";


    // Precio
    const precio = document.createElement("div");

    precio.classList.add("precio");

    precio.textContent =
        formatearPrecio(plato.precio);


    // Construir contenido
    contenido.appendChild(nombre);

    contenido.appendChild(descripcion);

    contenido.appendChild(precio);


    // Construir tarjeta
    tarjeta.appendChild(imagen);

    tarjeta.appendChild(contenido);


    return tarjeta;
}


/* =========================================================
   OBTENER RUTA DE IMAGEN
========================================================= */

function obtenerRutaImagen(imagen) {

    // No existe imagen
    if (!imagen) {

        return "/static/img/plato-placeholder.jpg";

    }


    // Imagen externa
    if (
        imagen.startsWith("http://") ||
        imagen.startsWith("https://")
    ) {

        return imagen;

    }


    // Ya tiene una ruta
    if (imagen.startsWith("/")) {

        return imagen;

    }


    // Solo tenemos el nombre del archivo
    return `/static/img/${imagen}`;
}


/* =========================================================
   FORMATEAR PRECIO
========================================================= */

function formatearPrecio(precio) {

    if (
        precio === undefined ||
        precio === null
    ) {

        return "Precio no disponible";

    }


    const numero = Number(precio);


    if (Number.isNaN(numero)) {

        return precio;

    }


    return `$${numero.toFixed(2)}`;
}


/* =========================================================
   NORMALIZAR TEXTO
========================================================= */

function normalizarTexto(texto) {

    return String(texto || "")
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}


/* =========================================================
   FILTROS DE CATEGORÍAS
========================================================= */

/* =========================================================
   GENERAR FILTROS DE CATEGORÍAS
========================================================= */

function renderFiltros() {
    if (!filtros) return;

    // Obtener categorías únicas de los productos
    const categoriasDisponibles = [
        ...new Set(
            platos
                .map(plato => plato.categoria)
                .filter(Boolean)
                .map(categoria => String(categoria).trim())
                .filter(Boolean)
        )
    ];

    // Crear el botón Todos y los botones de categorías
    filtros.innerHTML = `
        <button type="button" class="active" data-cat="Todos">
            Todos
        </button>
        ${categoriasDisponibles.map(categoria => `
            <button type="button" data-cat="${categoria}">
                ${categoria}
            </button>
        `).join("")}
    `;

    // Activar los filtros
    filtros.querySelectorAll("button").forEach(boton => {
        boton.addEventListener("click", () => {
            categoriaActual = boton.dataset.cat;

            filtros.querySelectorAll("button").forEach(b => {
                b.classList.toggle("active", b === boton);
            });

            mostrarPlatos();
        });
    });
}


/* =========================================================
   CATEGORÍAS DEL MENÚ
========================================================= */

const categorias =
    document.querySelectorAll("#categorias article");


categorias.forEach(categoria => {

    const enlace =
        categoria.querySelector("a");

    const titulo =
        categoria.querySelector("h3");


    if (!enlace || !titulo) {

        return;

    }


    enlace.addEventListener("click", event => {

        event.preventDefault();


        // Obtener categoría
        categoriaActual =
            titulo.textContent.trim();


        // Actualizar botones
        const botones =
            filtros.querySelectorAll("button");


        botones.forEach(boton => {

            const coincide =
                normalizarTexto(boton.textContent) ===
                normalizarTexto(categoriaActual);


            boton.classList.toggle(
                "active",
                coincide
            );

        });


        // Mostrar productos
        mostrarPlatos();
       


        // Ir a productos
        document
            .getElementById("productos")
            .scrollIntoView({
                behavior: "smooth"
            });

    });

});


/* =========================================================
   MENÚ MÓVIL
========================================================= */

if (menuToggle && nav) {

    menuToggle.addEventListener("click", () => {

        nav.classList.toggle("nav-open");


        const abierto =
            nav.classList.contains("nav-open");


        menuToggle.setAttribute(
            "aria-expanded",
            abierto
        );

    });


    // Cerrar menú al seleccionar una opción
    nav.querySelectorAll("a").forEach(enlace => {

        enlace.addEventListener("click", () => {

            nav.classList.remove("nav-open");


            menuToggle.setAttribute(
                "aria-expanded",
                "false"
            );

        });

    });

}


/* =========================================================
   INICIAR PÁGINA
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {
        renderFiltros();
        cargarPlatos();

    }
);
