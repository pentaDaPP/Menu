# Cambios SEO y rendimiento incluidos

## Cambios realizados
- Mejorado el título, la descripción, robots meta y metadatos Open Graph de la página principal.
- Añadido canonical condicional y datos estructurados Schema.org `Restaurant`.
- Añadidos `robots.txt` y `sitemap.xml` dinámicos en FastAPI.
- Priorizada la imagen principal; las imágenes inferiores usan carga diferida y dimensiones explícitas.
- Añadido fallback visual a `static/img/space.jpg` mientras se configuran las imágenes finales.
- Corregida la ruta del JavaScript a `/js/index2.js` y la consulta de platos a `/mostrar_platos/`.
- El renderizado ahora recibe `SITE_URL` desde el entorno, con la URL de la solicitud como fallback.
- Retirado `.env` del ZIP porque contenía credenciales. Se incluye `.env.example` sin secretos.

## Antes de desplegar
1. Crea un archivo `.env` local a partir de `.env.example` y rellena las credenciales. No publiques ese archivo.
2. Cambia las credenciales que estaban guardadas en el `.env` antiguo, ya que el archivo original contenía secretos reales y deben considerarse expuestos. En particular, rota la contraseña/usuario de MongoDB, claves de Cloudinary, claves API y `SECRET_KEY`.
3. Configura `SITE_URL` con el dominio público definitivo, sin barra final, también en las variables de entorno de Vercel.
4. Las imágenes finales de portada/categorías/clientes todavía deben sustituirse por sus URL públicas de Cloudinary. No se inventaron URL de Cloudinary porque no se proporcionaron.
5. Verifica que el teléfono, dirección y horario de los datos estructurados sean correctos antes de publicar.
6. Tras desplegar, prueba `/robots.txt`, `/sitemap.xml`, `/` y `/mostrar_platos/`; luego mide en PageSpeed Insights.

## Alcance
Estas mejoras preparan la base técnica, pero no garantizan un puesto concreto en Google ni una puntuación específica de rendimiento. Los resultados deben medirse después del despliegue.
