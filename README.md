# 🚤 Club Náutico — Sistema Integral

Aplicación full stack para la gestión de socios, pagos, disciplinas y acceso digital de un club náutico.
Desarrollada con **React + Vite (Frontend)** y **Spring Boot + PostgreSQL (Backend)**.

---

## 🌐 Frontend — Portal del Socio

El frontend implementa un **portal web responsive**, con diseño unificado entre todas las secciones y navegación dinámica mediante `react-router-dom`.

### 🧭 Rutas disponibles

| Ruta           | Descripción                                                  |
| -------------- | ------------------------------------------------------------ |
| `/` → `/login` | Página de inicio de sesión                                   |
| `/register`    | Registro de nuevo socio                                      |
| `/home`        | Portal principal del socio (dashboard)                       |
| `/pagos`       | Sección de pagos y estado de cuotas                          |
| `/disciplinas` | Sección con las disciplinas disponibles (cards interactivas) |
| `/info`        | Ficha personal del socio (datos e información editable)      |
| `/acceso`      | Nuevo módulo con QR dinámico para acceso al club             |
| `/socios`      | Panel de administración con tabla de socios                  |
| `/admin`       | Home del administrador                                       |

> 🔄 `/socio` redirige automáticamente a `/home`.

---

### ⚙️ Estructura del proyecto

```
frontend/
│
├── src/
│   ├── pages/
│   │   ├── Home.jsx / .scss
│   │   ├── Pagos.jsx / .scss
│   │   ├── Disciplinas.jsx / .scss
│   │   ├── InfoPersonal.jsx / .scss
│   │   ├── Acceso.jsx / .scss      ← NUEVO módulo QR
│   │   ├── Socios.jsx / .scss
│   │   ├── Login.jsx / Register.jsx
│   │   └── AdminHome.jsx
│   │
│   ├── components/
│   │   ├── Navbar.jsx / .scss      ← navegación común entre pantallas
│   │   └── ...
│   │
│   ├── router.jsx                  ← define las rutas (react-router-dom)
│   └── main.jsx                    ← punto de entrada de Vite
│
├── package.json
└── vite.config.js
```

---

### 🧩 Componentes clave

#### 🧭 `Navbar`

Componente de navegación principal, presente en todas las vistas del portal.
Incluye los accesos:

- Home
- Pagos
- Disciplinas
- Acceso (QR)
- Info personal

El botón **“Salir”** muestra un modal de confirmación antes de cerrar sesión.

---

#### 🆕 `Acceso.jsx`

Nuevo módulo con **código QR dinámico** generado mediante **QRious**.
Permite a cada socio visualizar, copiar o regenerar su código de ingreso al club.

**Características:**

- Código QR generado al ingresar a la pantalla
- Botón para regenerar el código
- Botón para copiar el texto del código
- Información del socio y estado del QR
- Bloque informativo de seguridad
- Instrucciones detalladas de uso y validación
- Diseño unificado con las demás secciones (`.container-principal`, sombras, tipografía, responsive)

---

#### 🎾 `Disciplinas.jsx`

Lista de disciplinas deportivas (Tenis, Natación, Fitness, Fútbol, etc.) en formato **card** con descripción, horarios, precio y botón de inscripción.
Diseño modular y responsive.

---

#### 💳 `Pagos.jsx`

Sección de gestión de pagos del socio, con tabla de cuotas y estados.
Incluye visualización de pagos realizados y pendientes.

---

#### 👤 `InfoPersonal.jsx`

Ficha personal del socio con datos de contacto, documento, edad, teléfono, dirección y botón de edición.

---

#### 🏠 `Home.jsx`

Pantalla principal del socio, muestra métricas generales y acceso rápido a las demás secciones.

---

### 🛠️ Instalación y ejecución del frontend

#### 1️⃣ Requisitos previos

- Node.js 20.19+ o 22.12+
- npm
- Git

#### 2️⃣ Instalar dependencias

```bash
cd frontend
npm install
```

#### 3️⃣ Ejecutar en modo desarrollo

```bash
npm run dev
```

> ⚠️ Si usas `nvm`, asegurate de tener una versión de Node compatible:

```bash
nvm install 22.12.0
nvm use 22.12.0
```

#### 4️⃣ Construir para producción

```bash
npm run build
```

#### 5️⃣ Previsualizar build

```bash
npm run preview
```

---

## 🖥️ Backend — Spring Boot + PostgreSQL (Supabase)

Sistema de gestión de socios, pagos y disciplinas, conectado al frontend mediante API REST.

### 🧾 Requisitos

- Java 21 o superior
- Maven (o Maven Wrapper incluido)
- PostgreSQL (Supabase)
- Git

---

### ⚙️ Configuración inicial

1. Clonar el repositorio:

   ```bash
   git clone [URL_DEL_REPOSITORIO]
   cd club-nautico-app/backend
   ```

2. Crear archivo `.env` con tus credenciales Supabase:

   ```properties
   DB_HOST=aws-1-sa-east-1.pooler.supabase.com
   DB_PORT=6543
   DB_NAME=postgres
   DB_USER=postgres.urwefjumjrtummdlhdir
   DB_PASS=[CONTRASEÑA_COMPARTIDA]
   DB_SSLMODE=require
   ```

3. Verificar conexión:

   ```bash
   ./mvnw test -Dtest=DatabaseConnectionTest
   ```

---

### 🚀 Ejecutar el backend

```bash
./mvnw spring-boot:run
```

Servidor disponible en:

> [http://localhost:8080](http://localhost:8080)

---

### 🧪 Tests

```bash
./mvnw test
```

---

### 🧰 Tecnologías principales

| Capa          | Tecnología                               |
| ------------- | ---------------------------------------- |
| Frontend      | React, Vite, SCSS, QRious                |
| Navegación    | React Router DOM                         |
| Backend       | Spring Boot 3.5.5                        |
| ORM           | Hibernate + JPA                          |
| Base de datos | PostgreSQL (Supabase)                    |
| Lenguaje      | Java 21                                  |
| Dependencias  | Maven                                    |
| Seguridad     | Variables `.env`, SSL, validación manual |

---

### ⚙️ Variables de entorno del backend

| Variable     | Descripción              |
| ------------ | ------------------------ |
| `DB_HOST`    | Host de la base de datos |
| `DB_PORT`    | Puerto de conexión       |
| `DB_NAME`    | Nombre de la base        |
| `DB_USER`    | Usuario de BD            |
| `DB_PASS`    | Contraseña (privada)     |
| `DB_SSLMODE` | Modo SSL requerido       |

---

## 🧭 Estructura general del proyecto

```
club-nautico-app/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── router.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── backend/
    ├── .env
    ├── pom.xml
    ├── src/
    │   ├── main/java/
    │   └── main/resources/
    └── mvnw
```

---

## 🛡️ Buenas prácticas

- No subir el archivo `.env` a GitHub
- No compartir credenciales ni URLs privadas
- Mantener dependencias actualizadas (`npm update`, `mvnw dependency:resolve`)
- Probar conexión con Supabase antes de iniciar el backend
- Usar ramas separadas para nuevas features (`git checkout -b feature/nueva-seccion`)

---

## 👥 Equipo

Proyecto académico desarrollado como práctica de **metodologías ágiles**
para la materia **Aplicaciones Ágiles**.
