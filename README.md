# DB_consult_bot

DB_consult_bot permite consultar y actualizar expedientes de una base de datos desde Telegram, pensado para trabajar con comodidad desde el movil sin abrir el CRM.

El bot conversa con un agente de n8n conectado a la base de datos. Desde Telegram puedes pedir datos de un expediente, cambiar campos como el estado, y continuar la conversacion usando el ultimo expediente consultado como contexto.

## Para Que Sirve

- Buscar expedientes directamente desde Telegram.
- Actualizar datos de un expediente desde el movil.
- Mantener contexto por chat: despues de consultar `EXP-0090`, puedes decir `cambia el estado a facturado`.
- Verificar cambios despues de una actualizacion mediante una lectura posterior del agente.
- Usar tambien una interfaz web local con panel de chat y vista de expedientes.

## Stack

- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS
- **Backend:** Express.js + TypeScript
- **Bot:** Telegram Bot API mediante long polling
- **Agente / datos:** webhook de n8n conectado a la base de datos
- **Estado web:** Zustand

## Funcionalidades

- Bot de Telegram para consultar la base de datos desde cualquier chat privado.
- Memoria por chat del ultimo expediente mencionado.
- Indicador `typing...` mientras el agente procesa la consulta.
- Bloqueo local para evitar respuestas duplicadas si se arrancan dos servidores.
- Panel web con chat, listado de expedientes y vista de detalle.
- Tests para validacion, parser de expedientes y flujo Telegram-agente.

## Estructura

```text
src/
  modules/
    app/           # Layout principal
    chat/          # Chat web, store, API client y sesion
    expedientes/   # Vista, tipos y parser de expedientes
server/
  modules/
    chat/          # Rutas Express, controlador, validacion y cliente n8n
    telegram/      # Cliente Telegram, poller, lock y orquestacion del bot
```

## Configuracion

Crea un archivo `.env` en la raiz del proyecto:

```env
N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-webhook-id
PORT=3001
TELEGRAM_BOT_TOKEN=replace-with-a-new-token-from-botfather
TELEGRAM_BOT_ENABLED=true
TELEGRAM_BOT_LOCK_PORT=39201
```

`TELEGRAM_BOT_TOKEN` debe guardarse solo en `.env`. No subas tokens reales al repositorio.

Si `TELEGRAM_BOT_TOKEN` esta vacio, la API web arranca igualmente y el bot queda desactivado. Usa `TELEGRAM_BOT_ENABLED=false` para mantener el token configurado sin iniciar Telegram en local.

## Instalacion

```bash
npm install
```

## Desarrollo

Arranca el servidor Express y el cliente Vite:

```bash
npm run dev
```

La app web queda en:

```text
http://localhost:5173
```

La API queda en:

```text
http://localhost:3001
```

Si el bot esta bien configurado, el servidor mostrara:

```text
Bot de Telegram conectado por long polling.
```

## Pruebas

```bash
npm test
```

## Build

```bash
npm run build
```

El cliente se genera en `dist/` y el servidor en `dist-server/`.

## Produccion

```bash
npm start
```

## Notas De Arquitectura

El proyecto mantiene separacion MVC adaptada a React + Express:

- **Vista:** componentes React en `src/modules/`.
- **Control / entrada:** controladores Express y servicio de Telegram.
- **Servicio / adaptadores:** `n8n-agent.client.ts` aisla la comunicacion con n8n y `telegram.client.ts` aisla la API de Telegram.
- **Estado:** Zustand gestiona el estado visible de la app web; el bot mantiene memoria ligera por chat en servidor.

No se usan Server Actions porque este proyecto no es Next.js: el backend es Express y expone endpoints propios. La persistencia real queda delegada al workflow de n8n y su conexion con la base de datos.
