# 🎮 ViBa — VideoGame Backend

REST API backend para videojuegos construida con Node.js, Express y MongoDB. Arquitectura Screaming por módulos.

---

## 🚀 Stack

- **Runtime:** Node.js 18+
- **Framework:** Express
- **Base de datos:** MongoDB (Mongoose)
- **Auth:** JWT (Access Token)
- **Deploy:** Railway

---

## 📁 Estructura de carpetas (Screaming Architecture)

```
ViBa/
├── server.js               # Entry point
├── railway.json            # Config de despliegue
├── src/
│   ├── app.js              # Setup de Express
│   ├── config/
│   │   └── database.js     # Conexión MongoDB
│   ├── shared/
│   │   ├── middlewares/
│   │   │   └── errorHandler.js
│   │   └── utils/
│   │       └── response.js
│   ├── auth/               # Módulo de autenticación
│   │   ├── auth.model.js
│   │   ├── auth.service.js
│   │   ├── auth.controller.js
│   │   ├── auth.middleware.js
│   │   └── auth.routes.js
│   ├── inventory/          # Módulo de inventario
│   │   ├── inventory.model.js
│   │   ├── inventory.service.js
│   │   ├── inventory.controller.js
│   │   └── inventory.routes.js
│   └── progress/           # Módulo de progreso
│       ├── progress.model.js
│       ├── progress.service.js
│       ├── progress.controller.js
│       └── progress.routes.js
```

---

## ⚙️ Variables de entorno

Copia `.env.example` a `.env` y completa los valores:

```env
MONGO_URL=mongodb+srv://<user>:<password>@cluster.mongodb.net/viba
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=7d
PORT=3000
```

---

## 🛠️ Instalación y ejecución local

```bash
npm install
cp .env.example .env
# Edita .env con tus valores
npm run dev
```

---

## ☁️ Despliegue en Railway

1. Sube el proyecto a un repositorio de GitHub.
2. En Railway, crea un nuevo proyecto → **Deploy from GitHub repo**.
3. Agrega las variables de entorno (`MONGO_URL`, `JWT_SECRET`, `JWT_EXPIRES_IN`) en la pestaña **Variables**.
4. Railway detecta `railway.json` y ejecuta `npm start` automáticamente.
5. Railway inyecta `PORT` solo — no la agregues manualmente.

---

## 📡 API Reference

Todas las respuestas siguen el formato:

```json
{
  "success": true,
  "message": "...",
  "data": { ... }
}
```

Las rutas protegidas requieren el header:
```
Authorization: Bearer <token>
```

---

### 🔐 Auth — `/api/auth`

#### `POST /api/auth/register`
Registra un nuevo usuario.

**Body:**
```json
{
  "nickname": "Player1",
  "email": "player@example.com",
  "password": "secret123",
  "birthdate": "2000-01-15"   // opcional
}
```

**Response `201`:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "token": "<jwt>",
    "user": { "id": "...", "nickname": "Player1", "email": "...", "score": 0 }
  }
}
```

---

#### `POST /api/auth/login`
Inicia sesión y devuelve un token.

**Body:**
```json
{ "email": "player@example.com", "password": "secret123" }
```

---

#### `GET /api/auth/me` 🔒
Devuelve el perfil del usuario autenticado.

---

### 🎒 Inventory — `/api/inventory`

Todos los endpoints requieren autenticación.

#### `GET /api/inventory`
Devuelve todos los ítems del inventario.

Query params opcionales:
- `?type=unique` — solo ítems únicos
- `?type=stackable` — solo ítems apilables

---

#### `POST /api/inventory/add`
Agrega un ítem al inventario.

**Tipos:**
- `unique` → siempre crea un documento nuevo (pueden existir varios con el mismo nombre)
- `stackable` → incrementa `quantity` si ya existe uno con ese nombre, o crea uno nuevo

**Body:**
```json
{ "name": "Espada legendaria", "type": "unique" }
```
```json
{ "name": "Poción de vida", "type": "stackable" }
```

---

#### `DELETE /api/inventory/:itemId`
Elimina o reduce la cantidad de un ítem.

- `stackable` con `quantity > 1` → reduce en 1
- `unique` o `stackable` con `quantity === 1` → elimina el documento

---

### 📈 Progress — `/api/progress`

Todos los endpoints requieren autenticación.

#### `GET /api/progress`
Devuelve el progreso del jugador.

**Response:**
```json
{
  "currentLevel": 3,
  "levelHistory": [
    { "level": 1, "score": 4, "completedAt": "..." },
    { "level": 2, "score": 5, "completedAt": "..." }
  ],
  "bestScoresByLevel": { "1": 4, "2": 5 }
}
```

---

#### `POST /api/progress/submit`
Envía la puntuación obtenida en un nivel.

- `score` entre `0` y `5` (el cliente lo decide según sus criterios)
- Si `score > 0` y `level === currentLevel`, avanza automáticamente al siguiente nivel
- Actualiza el `score` total del usuario (suma de mejores puntuaciones por nivel)

**Body:**
```json
{ "level": 2, "score": 4 }
```

**Response:**
```json
{
  "currentLevel": 3,
  "submittedRecord": { "level": 2, "score": 4 },
  "bestScoresByLevel": { "1": 5, "2": 4 },
  "totalScore": 9
}
```

---

## 📋 Lógica de negocio resumida

| Situación | Comportamiento |
|---|---|
| Ítem `unique` recogido (ya existe uno igual) | Se crea un nuevo documento separado |
| Ítem `stackable` recogido (ya existe) | Se incrementa `quantity` en 1 |
| Ítem `stackable` eliminado con `quantity > 1` | Se decrementa `quantity` en 1 |
| Score `0` en nivel actual | Se registra en historial, **no** avanza de nivel |
| Score `1–5` en nivel actual | Se registra, avanza al siguiente nivel |
| Score enviado en nivel anterior | Solo se registra en historial (sin afectar `currentLevel`) |


# 🚂 Cómo desplegar ViBa en Railway

Tutorial paso a paso para subir el backend de ViBa a producción usando Railway.

---

## Requisitos previos

Antes de empezar asegúrate de tener:

- [ ] Cuenta en [Railway](https://railway.app) (puedes registrarte con GitHub)
- [ ] Cuenta en [GitHub](https://github.com)
- [ ] [Git](https://git-scm.com/downloads) instalado en tu máquina
- [ ] El proyecto ViBa funcionando localmente
- [ ] Una base de datos MongoDB lista (ver sección MongoDB Atlas más abajo)

---

## Parte 1 — Preparar MongoDB Atlas (base de datos gratuita)

Railway no incluye MongoDB, necesitas una instancia externa. La opción más fácil es MongoDB Atlas (tiene tier gratuito).

### Paso 1 — Crear cuenta en Atlas

1. Ve a [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Clic en **Try Free** y crea tu cuenta
3. Elige el plan **Free (M0)**

### Paso 2 — Crear un cluster

1. En el dashboard, clic en **Build a Database**
2. Selecciona **M0 Free**
3. Escoge el proveedor y región más cercana (AWS / São Paulo para Colombia)
4. Dale un nombre al cluster, ejemplo: `viba-cluster`
5. Clic en **Create**

### Paso 3 — Crear usuario de base de datos

1. En el menú lateral ve a **Database Access**
2. Clic en **Add New Database User**
3. Autenticación: **Password**
4. Escribe un username, ejemplo: `viba-user`
5. Clic en **Autogenerate Secure Password** y **copia la contraseña**, la necesitarás después
6. En **Database User Privileges** selecciona **Read and write to any database**
7. Clic en **Add User**

### Paso 4 — Permitir acceso desde cualquier IP

Railway usa IPs dinámicas, por eso debes permitir acceso desde todas las IPs:

1. En el menú lateral ve a **Network Access**
2. Clic en **Add IP Address**
3. Clic en **Allow Access from Anywhere** — esto agrega `0.0.0.0/0`
4. Clic en **Confirm**

### Paso 5 — Obtener la connection string

1. En el menú lateral ve a **Database** → clic en **Connect** en tu cluster
2. Selecciona **Drivers**
3. Selecciona Driver: **Node.js**
4. Copia la connection string, se ve así:

```
mongodb+srv://viba-user:<password>@viba-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

5. Reemplaza `<password>` con la contraseña que copiaste en el Paso 3
6. Agrega el nombre de la base de datos antes del `?`, quedando así:

```
mongodb+srv://viba-user:TuPassword@viba-cluster.xxxxx.mongodb.net/viba?retryWrites=true&w=majority
```

> Guarda esta URL, la usarás como `MONGO_URL` en Railway.

---

## Parte 2 — Subir el proyecto a GitHub

### Paso 1 — Inicializar el repositorio

Abre una terminal dentro de la carpeta del proyecto ViBa y ejecuta:

```bash
git init
git add .
git commit -m "feat: ViBa initial commit"
```

### Paso 2 — Crear repositorio en GitHub

1. Ve a [github.com](https://github.com) e inicia sesión
2. Clic en el botón **+** (esquina superior derecha) → **New repository**
3. Nombre del repositorio: `viba-backend`
4. Visibilidad: **Private** (recomendado para proyectos con claves)
5. **No** marques ninguna casilla de inicialización (README, .gitignore, etc.)
6. Clic en **Create repository**

### Paso 3 — Conectar y subir el código

GitHub te mostrará los comandos. Ejecuta los de la sección **"push an existing repository"**:

```bash
git remote add origin https://github.com/tu-usuario/viba-backend.git
git branch -M main
git push -u origin main
```

Verifica en GitHub que todos los archivos estén presentes. Confirma que el `.env` **no aparece** (está en `.gitignore`).

---

# ▲ Cómo desplegar ViBa en Vercel

Tutorial paso a paso para subir el backend de ViBa a producción usando Vercel (gratis).

---

## Requisitos previos

- [ ] Cuenta en [Vercel](https://vercel.com) (puedes registrarte con GitHub)
- [ ] Cuenta en [GitHub](https://github.com)
- [ ] [Git](https://git-scm.com/downloads) instalado en tu máquina
- [ ] [Vercel CLI](https://vercel.com/docs/cli) instalado (opcional, para deploy desde terminal)
- [ ] El proyecto ViBa con los 4 archivos actualizados para Vercel
- [ ] Una base de datos MongoDB (ver sección MongoDB Atlas más abajo)

---

## ¿Por qué Vercel necesita ajustes en el código?

Vercel es **serverless**: no mantiene tu servidor corriendo entre requests. Cada request puede ejecutarse en una instancia nueva, por eso:

- `server.js` exporta el `app` en vez de solo llamar `listen()` — Vercel lo convierte en una función serverless
- `database.js` cachea la conexión a MongoDB para no reconectar en cada request
- `vercel.json` le dice a Vercel que enrute todo a tu `server.js`

---

## Parte 1 — Preparar MongoDB Atlas

Vercel no incluye base de datos, necesitas MongoDB Atlas (tiene tier gratuito).

### Paso 1 — Crear cuenta y cluster

1. Ve a [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Clic en **Try Free** y crea tu cuenta
3. Selecciona el plan **M0 Free**
4. Elige proveedor y región cercana (AWS / São Paulo para Colombia)
5. Nombre del cluster: `viba-cluster` → clic en **Create**

### Paso 2 — Crear usuario de base de datos

1. Menú lateral → **Database Access** → **Add New Database User**
2. Autenticación: **Password**
3. Username: `viba-user`
4. Clic en **Autogenerate Secure Password** → **copia la contraseña**
5. Privilegios: **Read and write to any database**
6. Clic en **Add User**

### Paso 3 — Permitir acceso desde cualquier IP

Vercel usa IPs dinámicas, debes abrir el acceso:

1. Menú lateral → **Network Access** → **Add IP Address**
2. Clic en **Allow Access from Anywhere** (agrega `0.0.0.0/0`)
3. Clic en **Confirm**

### Paso 4 — Obtener la connection string

1. Menú lateral → **Database** → **Connect** en tu cluster
2. Selecciona **Drivers** → Driver: **Node.js**
3. Copia la connection string y arma la URL final así:

```
mongodb+srv://viba-user:TuPassword@viba-cluster.xxxxx.mongodb.net/viba?retryWrites=true&w=majority
```

> Reemplaza `TuPassword` con la contraseña del Paso 2 y asegúrate de que `/viba` esté antes del `?`.
> Guarda esta URL, la usarás como `MONGO_URL` en Vercel.

---

## Parte 2 — Subir el proyecto a GitHub

### Paso 1 — Asegúrate de tener los 4 archivos actualizados

Antes de hacer commit confirma que en tu proyecto estén:

- `vercel.json` → archivo nuevo en la raíz
- `server.js` → exporta `module.exports = app`
- `src/config/database.js` → cachea la conexión con `isConnected`
- `package.json` → tiene el script `"build": "echo 'No build step required'"`

### Paso 2 — Inicializar el repositorio

```bash
git init
git add .
git commit -m "feat: ViBa initial commit"
```

### Paso 3 — Crear repositorio en GitHub

1. Ve a [github.com](https://github.com) → botón **+** → **New repository**
2. Nombre: `viba-backend`
3. Visibilidad: **Private**
4. **No** marques ninguna casilla de inicialización
5. Clic en **Create repository**

### Paso 4 — Subir el código

```bash
git remote add origin https://github.com/tu-usuario/viba-backend.git
git branch -M main
git push -u origin main
```

Verifica en GitHub que el `.env` **no aparezca** en los archivos.

---

## Parte 3 — Desplegar en Vercel

### Opción A — Desde la web (recomendada)

**Paso 1 — Crear proyecto**

1. Ve a [vercel.com](https://vercel.com) e inicia sesión
2. Clic en **Add New** → **Project**
3. Clic en **Import Git Repository**
4. Si es la primera vez, autoriza a Vercel acceso a GitHub
5. Busca y selecciona `viba-backend`
6. Clic en **Import**

**Paso 2 — Configurar el proyecto**

En la pantalla de configuración:

- **Framework Preset**: selecciona **Other** (no es Next.js ni nada de eso)
- **Root Directory**: déjalo en `.` (raíz del proyecto)
- **Build Command**: déjalo vacío o escribe `npm run build`
- **Output Directory**: déjalo vacío
- **Install Command**: `npm install`

**Paso 3 — Agregar variables de entorno**

Antes de hacer el primer deploy, expande la sección **Environment Variables** y agrega:

| Name | Value |
|---|---|
| `MONGO_URL` | La connection string de Atlas del Paso 4 de la Parte 1 |
| `JWT_SECRET` | Una cadena aleatoria larga (mínimo 32 caracteres) |
| `JWT_EXPIRES_IN` | `7d` |
| `NODE_ENV` | `production` |

> **Tip** para generar un JWT_SECRET seguro, corre esto en tu terminal:
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

**Paso 4 — Desplegar**

Clic en **Deploy**. Vercel mostrará los logs en tiempo real. El deploy exitoso tarda entre 30 segundos y 2 minutos.

---

### Opción B — Desde la terminal con Vercel CLI

```bash
# Instalar Vercel CLI globalmente
npm install -g vercel

# Dentro de la carpeta del proyecto
vercel

# Seguir las instrucciones:
# - Set up and deploy? → Y
# - Which scope? → tu cuenta
# - Link to existing project? → N
# - Project name → viba-backend
# - Directory → ./
# - Override settings? → N
```

Para agregar las variables de entorno desde la terminal:

```bash
vercel env add MONGO_URL
vercel env add JWT_SECRET
vercel env add JWT_EXPIRES_IN
vercel env add NODE_ENV
```

Cada comando te pedirá el valor y en qué entornos aplicarlo (selecciona **Production**, **Preview** y **Development**).

Para el deploy final a producción:

```bash
vercel --prod
```

---

## Parte 4 — Verificar el deploy

### Obtener la URL

Al terminar el deploy, Vercel te muestra la URL. También la encuentras en el dashboard en la sección **Domains**, se ve así:

```
https://viba-backend.vercel.app
```

### Probar que funciona

Abre la URL en el navegador, debes ver:

```json
{
  "message": "🎮 ViBa API is running",
  "version": "1.0.0",
  "docs": "/api/docs"
}
```

### Probar la documentación Swagger

```
https://viba-backend.vercel.app/api/docs
```

Para los endpoints protegidos:

1. Haz `POST /api/auth/register` o `POST /api/auth/login`
2. Copia el `token` de la respuesta
3. Clic en el botón **Authorize** (candado en Swagger UI)
4. Escribe `Bearer <token>` → clic en **Authorize**

---

## Parte 5 — Deploys automáticos (CI/CD)

Vercel detecta cada `push` a `main` y despliega automáticamente:

```bash
# Haces cambios...
git add .
git commit -m "fix: corrección en inventario"
git push origin main
# Vercel despliega automáticamente ✅
```

Los `push` a otras ramas crean **Preview Deployments** con URLs temporales, útil para probar antes de llevar a producción.

---

## Solución de problemas comunes

**Error 404 en todos los endpoints**
Verifica que `vercel.json` esté en la raíz del proyecto y que el campo `"dest"` apunte a `"server.js"`.

**Error "Cannot find module"**
Asegúrate de que todos los paquetes estén en `dependencies` (no en `devDependencies`) del `package.json`.

**Timeout en requests (Error 504)**
Vercel tiene un límite de 10 segundos para el plan gratuito. Si MongoDB tarda en conectar, verifica que la IP `0.0.0.0/0` esté en la lista blanca de Atlas.

**Error de conexión a MongoDB**
- Revisa que `MONGO_URL` esté bien escrita en las variables de Vercel (sin `<password>` sin reemplazar)
- Confirma que el nombre de la BD (`/viba`) esté en la URL antes del `?`
- Verifica en Atlas que la IP `0.0.0.0/0` esté activa en Network Access

**Las variables de entorno no funcionan**
Después de agregar o cambiar variables en Vercel hay que hacer un **redeploy manual**. Ve al dashboard → **Deployments** → clic en los tres puntos del último deploy → **Redeploy**.

**El JWT_SECRET cambia entre deploys**
Si defines el `JWT_SECRET` en las variables de entorno de Vercel y no lo cambias, persiste entre deploys. El problema ocurre si lo dejas vacío — Vercel usaría `undefined` y los tokens fallarían.


## Parte 4 — Desplegar en Railway

### Paso 1 — Crear proyecto en Railway

1. Ve a [railway.app](https://railway.app) e inicia sesión
2. En el dashboard clic en **New Project**
3. Selecciona **Deploy from GitHub repo**
4. Si es la primera vez, Railway te pedirá autorizar acceso a GitHub → clic en **Configure GitHub App** y autoriza el acceso al repositorio `viba-backend`
5. Selecciona el repositorio `viba-backend` de la lista

Railway detectará automáticamente que es un proyecto Node.js y comenzará el primer deploy (que fallará por ahora porque aún no tiene las variables de entorno — eso es normal).

### Paso 2 — Agregar variables de entorno

1. Dentro del proyecto en Railway, haz clic en el servicio que se creó (generalmente tiene el nombre del repo)
2. Ve a la pestaña **Variables**
3. Clic en **Add a Variable** y agrega las siguientes una por una:

| Variable | Valor |
|---|---|
| `MONGO_URL` | La connection string de Atlas que armaste en la Parte 1 |
| `JWT_SECRET` | Una cadena larga y aleatoria, mínimo 32 caracteres |
| `JWT_EXPIRES_IN` | `7d` |

> ⚠️ **No agregues** `PORT`. Railway lo inyecta automáticamente.

**Tip para generar un JWT_SECRET seguro**, corre este comando en tu terminal:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Paso 3 — Verificar el deploy

1. Ve a la pestaña **Deployments**
2. Verás el deploy activo. Haz clic en él para ver los logs en tiempo real
3. Cuando el deploy sea exitoso verás en los logs:

```
🎮 ViBa server running on port XXXX
✅ MongoDB connected
```

Si hay errores, los logs te indicarán exactamente cuál variable falta o qué falló.

### Paso 4 — Obtener la URL pública

1. Ve a la pestaña **Settings** del servicio
2. En la sección **Networking** → **Public Networking**
3. Clic en **Generate Domain**
4. Railway te dará una URL como: `https://viba-backend-production.up.railway.app`

Prueba que funciona abriendo esa URL en el navegador, debes ver:

```json
{
  "message": "🎮 ViBa API is running",
  "version": "1.0.0",
  "docs": "/api/docs"
}
```

---

## Parte 4 — Probar la API en producción

### Verificar la documentación Swagger

Abre en el navegador:

```
https://tu-url.up.railway.app/api/docs
```

Desde ahí puedes probar todos los endpoints directamente. Para los endpoints protegidos:

1. Haz un `POST /api/auth/register` o `POST /api/auth/login`
2. Copia el `token` de la respuesta
3. Clic en el botón **Authorize** (candado arriba a la derecha en Swagger)
4. Escribe `Bearer <token>` y clic en **Authorize**
5. Ahora puedes probar los endpoints protegidos

---

## Parte 5 — Deploys automáticos (CI/CD)

Railway detecta cada `push` a la rama `main` y despliega automáticamente. El flujo de trabajo es:

```bash
# Haces cambios en el código...
git add .
git commit -m "fix: corrección en módulo de inventario"
git push origin main
# Railway detecta el push y despliega automáticamente ✅
```

Para ver el historial de deploys ve a la pestaña **Deployments** en Railway. Puedes hacer rollback a cualquier deploy anterior con un clic.

---

## Solución de problemas comunes

**El deploy falla con "Cannot find module"**
Verifica que `node_modules/` esté en el `.gitignore` y que `package.json` tenga todas las dependencias en `dependencies` (no en `devDependencies`).

**Error de conexión a MongoDB**
- Confirma que la IP `0.0.0.0/0` esté en la lista blanca de Atlas (Parte 1, Paso 4)
- Verifica que la `MONGO_URL` en Railway no tenga `<password>` sin reemplazar
- Confirma que el nombre de la base de datos esté en la URL (`.../viba?retryWrites...`)

**El servidor arranca pero el token JWT falla**
Verifica que `JWT_SECRET` esté definido en las variables de Railway y que no tenga espacios extra.

**La URL de Railway devuelve 404**
Verifica en los logs que el servidor arrancó correctamente. El `PORT` lo asigna Railway automáticamente; si en el código usas un puerto fijo, cámbialo por `process.env.PORT`.