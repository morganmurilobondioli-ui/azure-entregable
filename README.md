# InnovVentas: e-commerce con chatbot

Proyecto Node.js del caso practico **Uso de chatbots en E-commerce**. La app incluye una tienda demo de productos tecnologicos y un chatbot funcional que responde consultas frecuentes sobre disponibilidad, especificaciones, pagos, envios, garantia, seguimiento de pedidos, soporte tecnico y recomendaciones de compra.

## App web

- Backend: Node.js + Express.
- Frontend: HTML, CSS y JavaScript en `public/`.
- Chatbot: endpoint `/api/chat` con reglas simples y respuestas FAQ.
- Metricas demo: endpoint `/api/metrics` para conversaciones, mensajes, recomendaciones y escalamientos.
- Hosting recomendado: Render como Web Service.

## Estructura

- `server.js`: servidor Express y API del chatbot.
- `public/`: interfaz web, estilos, JavaScript e imagenes usadas por la tienda.
- `package.json`: dependencias y scripts de ejecucion.
- `render.yaml`: configuracion opcional para desplegar como Blueprint en Render.

## Ejecutar Localmente

Requisitos:

- Node.js instalado.
- npm instalado.

Pasos:

```powershell
npm install
npm start
```

Abrir en el navegador:

```text
http://localhost:3000
```

Para probar el chatbot:

1. Escribe: `recomiendame una laptop para estudiar`.
2. Prueba: `metodos de pago`, `envios`, `garantia`, `stock` o `soporte tecnico`.
3. Revisa la seccion **Metricas del chatbot** para ver los contadores.

## Desplegar en Render

Pasos recomendados:

1. Entra a Render y selecciona **New +**.
2. Elige **Web Service**.
3. Conecta este repositorio de GitHub.
4. Configura el servicio:
   - **Runtime**: Node.
   - **Build Command**: `npm install`.
   - **Start Command**: `npm start`.
   - **Instance Type**: Free o el plan que tengas disponible.
5. Crea el servicio y espera el deploy.
6. Cuando Render entregue la URL publica, abre la app y prueba el chatbot.

Notas:

- No necesitas configurar variables de entorno para esta version.
- Render recomienda que el servidor use la variable `PORT`; si no se configura, Render espera el puerto `10000`. Este proyecto ya usa `process.env.PORT || 3000` y escucha en `0.0.0.0`.
- Si haces cambios, subelos a GitHub y Render puede desplegarlos nuevamente desde el repositorio conectado.

## Contenido

La app desarrolla una solucion de chatbot para InnovVentas que cubre:

- necesidades del cliente y problemas del flujo e-commerce;
- preguntas frecuentes del cliente;
- asistencia de compra y recomendaciones;
- metricas basicas para evaluar interaccion, mensajes, recomendaciones y escalamientos;
- despliegue sencillo en Render.

## Fuentes tecnicas

- Render Docs - Deploy a Node Express App: https://render.com/docs/deploy-node-express-app
- Render Docs - Web Services: https://render.com/docs/web-services
