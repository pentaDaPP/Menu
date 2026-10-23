

        /*
        =====================================================
        CONFIGURACIÓN
        =====================================================

        Durante las pruebas:

        http://localhost:8000

        Cuando subas FastAPI a Internet,
        cambia esta URL por la de tu API.

        IMPORTANTE:

        NO pongas aquí la API Key.

        =====================================================
        */
        const 
        API_URL =
            window.location.origin;
        /*
        =====================================================
        API KEY
        =====================================================
        Comienza vacía.
        La clave será introducida por el administrador
        y solamente permanecerá en memoria mientras
        esta página esté abierta.
        =====================================================
        */
        let apiKey = null;
        /*
        =====================================================
        AUTORIZAR ADMINISTRADOR
        =====================================================
        */
        async function autorizarAdministrador(){
            const input =
                document.getElementById("apiKey");
            const clave =
                input.value.trim();
            if(!clave){
                mostrarMensaje(
                    "Introduce la API Key.",
                    "error"
                );
                return;
            }
            const boton =
                document.getElementById("btnAutorizar");
            boton.disabled = true;
            boton.innerText =
                "Comprobando...";
            try{
                /*
                =============================================
                Petición a FastAPI
                GET /auth/verificar
                =============================================
                */
                const respuesta = await fetch(
                    API_URL +
                    "/auth/verificar",
                    {
                        method:"GET",
                        headers:{
                            "X-API-Key":clave
                        }
                    }
                );
                const resultado =
                    await respuesta.json();
                /*
                =============================================
                API KEY CORRECTA
                =============================================
                */
                if(respuesta.ok){
                    apiKey = clave;
                    document
                        .getElementById("estado")
                        .innerText =
                        "🟢 Administrador autorizado";
                    document
                        .getElementById("estado")
                        .style.color =
                        "green";
                    /*
                    Habilitar botones
                    */
                    document
                        .getElementById("btnAgregar")
                        .disabled = false;
                    document
                        .getElementById("btnActualizar")
                        .disabled = false;
                    document
                        .getElementById("btnEliminar")
                        .disabled = false;
                    document
                        .getElementById("btnGuardar")
                        .disabled = false;
                    /*
                    Limpiar campo.
                    La clave sigue en la variable apiKey,
                    no en el input.
                    */
                    input.value = "";
                    mostrarMensaje(
                        "Administrador autorizado correctamente.",
                        "success"
                    );
                }
                /*
                =============================================
                API KEY INCORRECTA
                =============================================
                */
                else{
                    apiKey = null;
                    document
                        .getElementById("estado")
                        .innerText =
                        "🔴 No autorizado";
                    document
                        .getElementById("estado")
                        .style.color =
                        "red";
                    bloquearAcciones();
                    mostrarMensaje(
                        resultado.detail ||
                        "API Key incorrecta.",
                        "error"
                    );
                }
            }
            catch(error){
                console.error(error);
                apiKey = null;
                bloquearAcciones();
                mostrarMensaje(
                    "No se pudo conectar con FastAPI.",
                    "error"
                );
            }
            finally{
                boton.disabled = false;
                boton.innerText =
                    "Autorizar";
            }
        }
        /*
        =====================================================
        BLOQUEAR ACCIONES
        =====================================================
        */
        function bloquearAcciones(){
            document
                .getElementById("btnAgregar")
                .disabled = true;
            document
                .getElementById("btnActualizar")
                .disabled = true;
            document
                .getElementById("btnEliminar")
                .disabled = true;
            document
                .getElementById("btnGuardar")
                .disabled = true;

        }
        function mostrarPlatos(platos){

    const lista =
    document.getElementById("listaPlatos");


    lista.innerHTML = "";


    platos.forEach(plato => {


        lista.innerHTML += `

        <div>


            <img 
            src="${plato.imagen}"
            width="100"
            >


            <h3>
            ${plato.name}
            </h3>


            <p>
            ${plato.categoria}
            </p>


            <button
            onclick="eliminarPlato('${plato.id}')"
            >

            🗑 Eliminar

            </button>


        </div>

        <hr>


        `;


    });

}

        async function cargarPlatos() {
           try{
                const respuesta = await fetch(API_URL + "/mostrar_platos/")
                const platos = await respuesta.json()
                
                mostrarPlatos(platos);
            }catch(error){
                console.error("error cargando platos",error);
            }
    }

    async function eliminarPlato(id){

    console.log("Eliminando:", id);


    const confirmar = confirm(
        "¿Seguro que quieres eliminar este plato?"
    );


    if(!confirmar){
        return;
    }


    try{

        const respuesta = await fetch(
            API_URL + "/delete_plato/" + id,
            {
                method:"DELETE",
                headers:{
                    "X-API-Key": apiKey
                }
            }
        );


        const resultado = await respuesta.json();


        console.log(resultado);


        if(respuesta.ok){

            alert("Plato eliminado correctamente");

            cargarPlatos();

        }else{

            alert(
                resultado.detail || 
                "Error eliminando plato"
            );

        }


    }catch(error){

        console.error(
            "Error eliminando:",
            error
        );

    }

}

        function mostrarEliminar(){
            document.getElementById("zonaEliminar").style.display = "block";
            cargarPlatos();
        }

        /*
        =====================================================
        MOSTRAR FORMULARIO
        =====================================================
        */
        function mostrarFormularioAgregar(){
            if(!apiKey){
                alert(
                    "Primero debes autorizarte."
                );
                return;
            }
            document
                .getElementById("formularioAgregar")
                .scrollIntoView({
                    behavior:"smooth"
                });

        }



        /*
        =====================================================
        AGREGAR PLATO
        =====================================================
        */
        async function agregarPlato(){
            /*
            =============================================
            Comprobar autorización
            =============================================
            */
            const formData = new FormData();
            formData.append("nombre",document.getElementById("nombre").value);
            formData.append("precio",document.getElementById("precio").value);
            formData.append("descripcion",document.getElementById("descripcion").value);
            formData.append("categoria",document.getElementById("categoria").value);
            formData.append("imagen",inputImagen.files[0]);

            if(!apiKey){
                mostrarMensaje(
                    "Debes autorizarte primero.",
                    "error"
                );
                return;
            }
            /*
            =============================================
            Obtener datos
            =============================================
            */
            const nombre =
                document
                    .getElementById("nombre")
                    .value
                    .trim();
            const precio =
                Number(
                    document
                        .getElementById("precio")
                        .value
                );
            const descripcion =
                document
                    .getElementById("descripcion")
                    .value
                    .trim();
            const categoria = 
                document.getElementById("categoria").value;

            const imagen = inputImagen.files[0];
            /*
            =============================================
            Validaciones
            =============================================
            */
            if(!nombre){

                mostrarMensaje(
                    "Introduce el nombre del plato.",
                    "error"
                );
                return;
            }
            if(!precio || precio <= 0){
                mostrarMensaje(
                    "Introduce un precio válido.",
                    "error"
                );
                return;
            }
            if(!descripcion){
                mostrarMensaje(
                    "Introduce una descripción.",
                    "error"
                );
                return;

            }


            if(!imagen){

                mostrarMensaje(
                    "Introduce la URL de la imagen.",
                    "error"
                );

                return;

           }



            /*
            =============================================
            Crear objeto para FastAPI
            =============================================
            */


           


            const boton =
                document
                    .getElementById("btnGuardar");


            boton.disabled = true;

            boton.innerText =
                "Guardando...";



            try{


                /*
                =============================================
                POST /agg_platos/

                =============================================
                */


                const respuesta = await fetch(

                    API_URL +
                    "/agg_platos/",

                    {

                        method:"POST",

                        headers:{
                            "X-API-Key": apiKey

                        },

                        body: formData

                    }

                );



                const resultado =
                    await respuesta.json();



                /*
                =============================================
                ÉXITO
                =============================================
                */


                if(respuesta.ok){


                    mostrarMensaje(

                        "✅ Plato agregado correctamente.",

                        "success"

                    );


                    /*
                    Limpiar formulario
                    */


                    document
                        .getElementById("nombre")
                        .value = "";


                    document
                        .getElementById("precio")
                        .value = "";


                    document
                        .getElementById("descripcion")
                        .value = "";


                    document
                        .getElementById("imagen")
                        .value = "";


                    console.log(
                        "Plato creado:",
                        resultado
                    );

                }



                /*
                =============================================
                ERROR
                =============================================
                */


                else{


                    /*
                    Si FastAPI responde 401,
                    significa que la clave ya no es válida.
                    */


                    if(respuesta.status === 401){

                        apiKey = null;

                        bloquearAcciones();


                        document
                            .getElementById("estado")
                            .innerText =
                            "🔴 Sesión no autorizada";


                        document
                            .getElementById("estado")
                            .style.color =
                            "red";

                    }


                    mostrarMensaje(

                        "❌ " +
                        JSON.stringify(
                            resultado.detail,null,2,
                            "Error al agregar el plato."
                        ),

                        "error"

                    );

                }


            }


            catch(error){


                console.error(error);


                mostrarMensaje(

                    "❌ No se pudo conectar con FastAPI.",

                    "error"

                );

            }


            finally{


                /*
                Solo volvemos a habilitar el botón
                si seguimos autorizados.
                */


                if(apiKey){

                    boton.disabled = false;

                    boton.innerText =
                        "💾 Guardar plato";

                }

            }

        }



        /*
        =====================================================
        MOSTRAR MENSAJES
        =====================================================
        */


        function mostrarMensaje(
            texto,
            tipo
        ){


            const mensaje =
                document
                    .getElementById("mensaje");


            mensaje.innerText =
                texto;


            mensaje.className =
                tipo === "success"
                ? "mensaje-exito"
                : "mensaje-error";


        }
        const inputImagen = document.getElementById("imagen");

        inputImagen.addEventListener("change", function () {
            const archivo = inputImagen.files[0];

            console.log(archivo);
});

