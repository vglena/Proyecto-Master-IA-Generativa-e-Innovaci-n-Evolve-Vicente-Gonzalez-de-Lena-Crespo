# DB consult bot

**DB consult bot** es una aplicación de automatización con IA que permite consultar, añadir y actualizar datos de una base de datos directamente desde Telegram, sin necesidad de abrir el CRM o acceder manualmente al sistema de gestión.

El proyecto conecta un bot de Telegram con un agente desarrollado en **n8n**, que actúa como intermediario entre el usuario y la base de datos. La base de datos está alojada en **Airtable** y la conexión se realiza mediante su **API**, evitando que la IA tenga acceso directo a la base de datos.

Desde el móvil, el usuario puede buscar expedientes, consultar información, añadir nuevos datos, modificar campos y mantener una conversación contextual sobre el último expediente consultado.

Este proyecto ha sido desarrollado como parte del proceso de aprendizaje y especialización en **Inteligencia Artificial Generativa y automatización de procesos** dentro del ecosistema formativo de **Evolve Academy**.

---

## Descripción del Proyecto

El objetivo de **DB consult bot** es demostrar cómo un asistente conversacional puede integrarse con herramientas de automatización y bases de datos para facilitar tareas administrativas y operativas desde una interfaz sencilla como Telegram.

El bot permite trabajar con datos y expedientes de forma rápida desde el móvil. Por ejemplo, un usuario puede consultar un expediente concreto y, a continuación, pedir al bot que actualice su estado sin volver a indicar el número de expediente, ya que el sistema conserva el contexto de la conversación.

También permite añadir nuevos datos a la base de datos mediante lenguaje natural, delegando la ejecución real en un flujo controlado de n8n conectado a Airtable mediante API.

Ejemplo de uso:

    Usuario: Busca el expediente EXP-0090
    Bot: El expediente EXP-0090 corresponde a...

    Usuario: Cambia el estado a facturado
    Bot: Estado actualizado correctamente a facturado para el expediente EXP-0090.

    Usuario: Añade los datos del cliente Juan Pérez
    Bot: Datos añadidos correctamente.

Además del bot de Telegram, el proyecto incluye una interfaz web local con panel de chat, listado de expedientes y vista de detalle, pensada para pruebas, desarrollo y visualización del flujo completo.

---

## Para Qué Sirve

**DB consult bot** está pensado para automatizar tareas habituales de consulta, incorporación y actualización de datos en entornos administrativos, comerciales o de gestión interna.

Permite:

- Buscar expedientes directamente desde Telegram.
- Consultar datos sin abrir el CRM.
- Añadir nuevos datos desde Telegram mediante lenguaje natural.
- Actualizar campos de un expediente desde el móvil.
- Mantener contexto por chat sobre el último expediente consultado.
- Verificar cambios mediante una lectura posterior del agente.
- Usar una interfaz web local con chat y vista de expedientes.
- Reducir fricción en procesos repetitivos de consulta, incorporación y actualización.
- Acercar la interacción con bases de datos a usuarios no técnicos mediante lenguaje natural.
- Trabajar con una base de datos alojada en Airtable sin exponer acceso directo al modelo de IA.

---

## Funcionalidades Principales

- Bot de Telegram conectado mediante **long polling**.
- Comunicación con un agente de **n8n** mediante webhook.
- Base de datos alojada en **Airtable**.
- Conexión con Airtable mediante API.
- Consulta de expedientes desde cualquier chat privado de Telegram.
- Incorporación de nuevos datos mediante lenguaje natural.
- Actualización de campos de expedientes mediante lenguaje natural.
- Memoria por chat del último expediente mencionado.
- Uso del último expediente consultado como contexto conversacional.
- Indicador `typing...` mientras el agente procesa la consulta.
- Bloqueo local para evitar respuestas duplicadas si se arrancan dos servidores.
- Panel web con chat, listado de expedientes y vista de detalle.
- Validaciones de entrada en backend.
- Tests para validación, parser de expedientes y flujo Telegram-agente.
- Separación modular entre frontend, backend, bot, cliente n8n y conexión con Airtable.

---

## Resultados

El proyecto consigue integrar con éxito una interfaz conversacional móvil con una base de datos alojada en Airtable, gestionada de forma segura mediante un agente de automatización y conexión vía API.

Resultados principales:

- Consulta de expedientes desde Telegram sin acceder manualmente al CRM.
- Incorporación de nuevos datos desde lenguaje natural.
- Actualización de datos desde lenguaje natural.
- Reducción de pasos en tareas administrativas repetitivas.
- Uso de contexto conversacional para continuar acciones sobre el último expediente.
- Arquitectura modular y ampliable.
- Integración funcional entre Telegram, Express, n8n, Airtable y API.
- Interfaz web complementaria para pruebas y visualización.
- Base preparada para extender el sistema a otros tipos de datos, CRM o flujos internos.
- Diseño más seguro al evitar que la IA gestione directamente la base de datos.

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
- **Airtable** como base de datos alojada
- Conexión con Airtable mediante API
- Flujo de consulta, incorporación y actualización de datos

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
    Agente de automatización
            |
            v
    API de Airtable
            |
            v
    Base de datos en Airtable

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
    Agente de automatización
            |
            v
    API de Airtable
            |
            v
    Base de datos en Airtable

La IA no se conecta directamente a la base de datos. El agente interpreta la intención del usuario y envía solicitudes estructuradas al flujo de automatización, mientras que la ejecución real de consultas, incorporación y actualizaciones se realiza mediante la API de Airtable.

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
    AIRTABLE_API_KEY=your-airtable-api-key
    AIRTABLE_BASE_ID=your-airtable-base-id

### Seguridad

El valor de `TELEGRAM_BOT_TOKEN` debe guardarse únicamente en el archivo `.env`.

No subas tokens reales al repositorio.

Si `TELEGRAM_BOT_TOKEN` está vacío, la API web arranca igualmente y el bot queda desactivado.

También puedes usar:

    TELEGRAM_BOT_ENABLED=false

para mantener el token configurado sin iniciar Telegram en local.

La base de datos no se conecta directamente al modelo de IA.

La persistencia de datos está alojada en **Airtable** y todas las operaciones de consulta, incorporación o actualización se realizan mediante la **API de Airtable**, gestionada desde el backend y/o el workflow de n8n.

Este diseño evita que la IA tenga control directo sobre la base de datos. El agente solo interpreta la intención del usuario y genera solicitudes estructuradas, mientras que la ejecución real queda controlada por capas intermedias donde pueden aplicarse validaciones, permisos, reglas de negocio y comprobaciones de seguridad.

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

Ejemplo de incorporación de datos:

    Usuario:
    Añade los datos de Marta López con estado pendiente

    Bot:
    Datos añadidos correctamente.

En este caso, el bot interpreta la intención del usuario, el agente estructura la operación y el flujo de n8n añade los datos en Airtable mediante API.

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
- **Persistencia:** Airtable actúa como base de datos alojada y se accede a ella mediante API.

No se usan Server Actions porque este proyecto no está desarrollado con Next.js. El backend está construido con Express y expone endpoints propios.

La persistencia real queda delegada al workflow de n8n y a su conexión con **Airtable mediante API**.

La IA no gestiona directamente la base de datos. Esta decisión reduce riesgos, ya que las operaciones sobre los datos pasan por una capa intermedia donde se pueden validar entradas, limitar acciones permitidas, controlar permisos y registrar cambios antes de ejecutar cualquier consulta, incorporación o actualización.

---

## Posibles Mejoras Futuras

- Autenticación de usuarios autorizados en Telegram.
- Control de permisos por rol.
- Historial de cambios por expediente.
- Confirmación previa antes de modificar campos sensibles.
- Confirmación previa antes de añadir nuevos datos.
- Validación avanzada de datos antes de enviar operaciones a Airtable.
- Integración con un CRM real manteniendo una capa API segura entre la IA y la base de datos.
- Despliegue en servidor cloud.
- Panel de administración para configurar campos editables.
- Logging avanzado de conversaciones y operaciones.
- Soporte para múltiples bases de datos o colecciones.
- Respuestas más estructuradas usando plantillas por tipo de expediente.

---

## Aprendizaje y Contexto Formativo

La aplicación combina conceptos clave de automatización moderna:

- Agentes conectados a datos.
- Interfaces conversacionales.
- Integración de APIs.
- Automatización de procesos administrativos.
- Uso de Telegram como interfaz móvil.
- Uso de Airtable como base de datos accesible mediante API.
- Separación entre frontend, backend, agentes externos y capa de datos.
- Diseño seguro para evitar que la IA tenga acceso directo a la base de datos.

Este proyecto forma parte de mi portfolio de soluciones de **IA Generativa, automatización y aplicaciones LLM**, desarrollado durante el Master en IA Generativa en **Evolve Academy**.

Más información sobre Evolve Academy: https://evolve.es/

---

## Versión agente conversacional exlcusivo para PC

Si quieres usar un flujo similar, pero exclusivamente desde el ordenador, puedes ver **Database Manager**.

Este proyecto ofrece una interfaz web para consultar, añadir, gestionar y actualizar datos de una base de datos mediante un asistente de chat con IA conectado a un agente de n8n.

También utiliza una arquitectura donde la base de datos se mantiene detrás de una capa API, evitando que la IA gestione directamente los datos.

[Ver Database Manager en GitHub](https://github.com/vglena/Database-manager)

---

## Autor

**Vicente González de Lena**

- [Portfolio](https://vicente-ai-portfolio.netlify.app/)

- [GitHub](https://github.com/vglena)

- [LinkedIn](https://linkedin.com/in/vgonzalezdelena)

- Artículo en Dev.to: [Cómo conecté Telegram con una base de datos usando n8n, Express y un agente de IA](https://dev.to/vglena/como-converti-telegram-en-una-interfaz-para-consultar-anadir-y-actualizar-datos-con-ia-5e6b)

- Artículo en Medium: [De Telegram a base de datos: consultas, creación y actualización de datos con IA](https://medium.com/@bisont55/c%C3%B3mo-convert%C3%AD-telegram-en-una-interfaz-para-consultar-y-actualizar-una-base-de-datos-con-ia-1356fc51ef9e)

- Artículo en Hashnode: [Cómo convertí Telegram en una interfaz para consultar, añadir y actualizar una base de datos con IA](https://vglenahashnodedev.hashnode.dev/c-mo-convert-telegram-en-una-interfaz-para-consultar-y-actualizar-una-base-de-datos-con-ia?utm_source=hashnode&utm_medium=feed)

- Artículo en LinkedIn Articles: [Telegram como interfaz inteligente para consultar, añadir y actualizar datos con IA](https://www.linkedin.com/pulse/c%C3%B3mo-convert%C3%AD-telegram-en-una-interfaz-para-consultar-vicente-muore/)
