# DB_consult_bot

**DB_consult_bot** es una aplicación de automatización con IA que permite consultar y actualizar expedientes de una base de datos directamente desde Telegram, sin necesidad de abrir el CRM o acceder manualmente al sistema de gestión.

El proyecto conecta un bot de Telegram con un agente desarrollado en **n8n**, que actúa como intermediario entre el usuario y la base de datos. Desde el móvil, el usuario puede buscar expedientes, consultar información, modificar campos y mantener una conversación contextual sobre el último expediente consultado.

Este proyecto ha sido desarrollado como parte del proceso de aprendizaje y especialización en **Inteligencia Artificial Generativa y automatización de procesos** dentro del ecosistema formativo de **Evolve Academy**.

---

## Descripción del Proyecto

El objetivo de **DB_consult_bot** es demostrar cómo un asistente conversacional puede integrarse con herramientas de automatización y bases de datos para facilitar tareas administrativas y operativas desde una interfaz sencilla como Telegram.

El bot permite trabajar con expedientes de forma rápida desde el móvil. Por ejemplo, un usuario puede consultar un expediente concreto y, a continuación, pedir al bot que actualice su estado sin volver a indicar el número de expediente, ya que el sistema conserva el contexto de la conversación.

Ejemplo de uso:

    Usuario: Busca el expediente EXP-0090
    Bot: El expediente EXP-0090 corresponde a...

    Usuario: Cambia el estado a facturado
    Bot: Estado actualizado correctamente a facturado para el expediente EXP-0090.

Además del bot de Telegram, el proyecto incluye una interfaz web local con panel de chat, listado de expedientes y vista de detalle, pensada para pruebas, desarrollo y visualización del flujo completo.

---

## Para Qué Sirve

**DB_consult_bot** está pensado para automatizar tareas habituales de consulta y actualización de datos en entornos administrativos, comerciales o de gestión interna.

Permite:

- Buscar expedientes directamente desde Telegram.
- Consultar datos sin abrir el CRM.
- Actualizar campos de un expediente desde el móvil.
- Mantener contexto por chat sobre el último expediente consultado.
- Verificar cambios mediante una lectura posterior del agente.
- Usar una interfaz web local con chat y vista de expedientes.
- Reducir fricción en procesos repetitivos de consulta y actualización.
- Acercar la interacción con bases de datos a usuarios no técnicos mediante lenguaje natural.

---

## Funcionalidades Principales

- Bot de Telegram conectado mediante **long polling**.
- Comunicación con un agente de **n8n** mediante webhook.
- Consulta de expedientes desde cualquier chat privado de Telegram.
- Actualización de campos de expedientes mediante lenguaje natural.
- Memoria por chat del último expediente mencionado.
- Uso del último expediente consultado como contexto conversacional.
- Indicador `typing...` mientras el agente procesa la consulta.
- Bloqueo local para evitar respuestas duplicadas si se arrancan dos servidores.
- Panel web con chat, listado de expedientes y vista de detalle.
- Validaciones de entrada en backend.
- Tests para validación, parser de expedientes y flujo Telegram-agente.
- Separación modular entre frontend, backend, bot y cliente n8n.

---

## Resultados

El proyecto consigue integrar con éxito una interfaz conversacional móvil con una base de datos gestionada mediante un agente de automatización.

Resultados principales:

- Consulta de expedientes desde Telegram sin acceder manualmente al CRM.
- Actualización de datos desde lenguaje natural.
- Reducción de pasos en tareas administrativas repetitivas.
- Uso de contexto conversacional para continuar acciones sobre el último expediente.
- Arquitectura modular y ampliable.
- Integración funcional entre Telegram, Express, n8n y base de datos.
- Interfaz web complementaria para pruebas y visualización.
- Base preparada para extender el sistema a otros tipos de registros, CRM o flujos internos.

---

## Stack Tecnológico

### Frontend

- **React 19**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **Zustand**

### Backend

- **Node.js**
- **Express.js**
- **TypeScript**

### Bot

- **Telegram Bot API**
- Long polling
- Gestión de sesiones por chat
- Indicador de escritura
- Bloqueo local de instancia

### Automatización y Datos

- **n8n**
- Webhook de agente
- Conexión con base de datos
- Flujo de consulta y actualización de expedientes

### Testing

- Tests de validación
- Tests de parser de expedientes
- Tests de flujo Telegram-agente

---

## Arquitectura General

El sistema se organiza en tres bloques principales:

    Usuario en Telegram
            |
            v
    Bot de Telegram
            |
            v
    Servidor Express
            |
            v
    Webhook de n8n
            |
            v
    Agente conectado a base de datos

Además, la aplicación incluye una interfaz web local:

    Frontend React
            |
            v
    API Express
            |
            v
    Cliente n8n
            |
            v
    Agente / Base de datos

---

## Estructura del Proyecto

    src/
      modules/
        app/             # Layout principal de la aplicación web
        chat/            # Chat web, store, cliente API y sesión
        expedientes/     # Vista, tipos y parser de expedientes

    server/
      modules/
        chat/            # Rutas Express, controlador, validación y cliente n8n
        telegram/        # Cliente Telegram, poller, lock y orquestación del bot

---

## Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto:

    N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/your-webhook-id
    PORT=3001
    TELEGRAM_BOT_TOKEN=replace-with-a-new-token-from-botfather
    TELEGRAM_BOT_ENABLED=true
    TELEGRAM_BOT_LOCK_PORT=39201

### Seguridad

El valor de `TELEGRAM_BOT_TOKEN` debe guardarse únicamente en el archivo `.env`.

No subas tokens reales al repositorio.

Si `TELEGRAM_BOT_TOKEN` está vacío, la API web arranca igualmente y el bot queda desactivado.

También puedes usar:

    TELEGRAM_BOT_ENABLED=false

para mantener el token configurado sin iniciar Telegram en local.

---

## Instalación

Instala las dependencias del proyecto:

    npm install

---

## Desarrollo

Arranca el servidor Express y el cliente Vite:

    npm run dev

La aplicación web estará disponible en:

    http://localhost:5173

La API estará disponible en:

    http://localhost:3001

Si el bot está correctamente configurado, el servidor mostrará:

    Bot de Telegram conectado por long polling.

---

## Pruebas

Ejecuta los tests con:

    npm test

Los tests cubren:

- Validación de entradas.
- Parser de expedientes.
- Flujo entre Telegram y el agente.
- Comportamientos básicos del sistema.

---

## Build

Genera la versión de producción:

    npm run build

El cliente se genera en:

    dist/

El servidor se genera en:

    dist-server/

---

## Producción

Ejecuta la aplicación en modo producción:

    npm start

---

## Flujo de Uso

Ejemplo básico de conversación:

    Usuario:
    Busca el expediente EXP-0090

    Bot:
    He encontrado el expediente EXP-0090.

    Usuario:
    Cambia el estado a facturado

    Bot:
    Estado actualizado correctamente.

El sistema recuerda que el último expediente consultado fue `EXP-0090`, por lo que el usuario no necesita repetir el identificador en la siguiente instrucción.

---

## Notas de Arquitectura

El proyecto mantiene una separación modular inspirada en una arquitectura MVC adaptada a React + Express:

- **Vista:** componentes React en `src/modules/`.
- **Control / entrada:** controladores Express y servicio de Telegram.
- **Servicios / adaptadores:**
  - `n8n-agent.client.ts` aísla la comunicación con n8n.
  - `telegram.client.ts` aísla la comunicación con la API de Telegram.
- **Estado:** Zustand gestiona el estado visible de la aplicación web.
- **Memoria conversacional:** el bot mantiene memoria ligera por chat en servidor.

No se usan Server Actions porque este proyecto no está desarrollado con Next.js. El backend está construido con Express y expone endpoints propios.

La persistencia real queda delegada al workflow de n8n y a su conexión con la base de datos.

---

## Posibles Mejoras Futuras

- Autenticación de usuarios autorizados en Telegram.
- Control de permisos por rol.
- Historial de cambios por expediente.
- Confirmación previa antes de modificar campos sensibles.
- Integración directa con un CRM real.
- Despliegue en servidor cloud.
- Panel de administración para configurar campos editables.
- Logging avanzado de conversaciones y operaciones.
- Soporte para múltiples bases de datos o colecciones.
- Respuestas más estructuradas usando plantillas por tipo de expediente.

---

## Aprendizaje y Contexto Formativo

Este proyecto forma parte de mi portfolio de soluciones de **IA Generativa, automatización y aplicaciones LLM**, desarrollado durante mi proceso de especialización en **Evolve Academy**.

La aplicación combina conceptos clave de automatización moderna:

- Agentes conectados a datos.
- Interfaces conversacionales.
- Integración de APIs.
- Automatización de procesos administrativos.
- Uso de Telegram como interfaz móvil.
- Separación entre frontend, backend y agentes externos.

Más información sobre Evolve Academy:

https://evolve.es/

---

## Autor

**Vicente González de Lena**

Consultor en IA Generativa, automatización de procesos y aplicaciones LLM.

- Portfolio: https://vicente-ai-portfolio.netlify.app/
- GitHub: https://github.com/vglena
- LinkedIn: https://linkedin.com/in/vgonzalezdelena
