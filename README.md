# Club Náutico - Backend

Sistema de gestión para club náutico desarrollado con Spring Boot y PostgreSQL (Supabase).

## Requisitos previos

- Java 21 o superior
- Maven (incluido Maven Wrapper en el proyecto)
- Git

## Configuración inicial

### 1. Clonar el repositorio

```bash
git clone [URL_DEL_REPOSITORIO]
cd club-nautico-app/backend
```

### 2. Configurar las credenciales de base de datos

Crea un archivo `.env` en la carpeta `backend/` con las credenciales que te compartieron por privado:

```properties
DB_HOST=aws-1-sa-east-1.pooler.supabase.com
DB_PORT=6543
DB_NAME=postgres
DB_USER=postgres.urwefjumjrtummdlhdir
DB_PASS=[CONTRASEÑA_COMPARTIDA]
DB_SSLMODE=require
```

**IMPORTANTE:** 
- El archivo `.env` NO debe subirse a Git (ya está en `.gitignore`)
- Reemplaza `[CONTRASEÑA_COMPARTIDA]` con la contraseña real que recibiste

### 3. Verificar la estructura del proyecto

Asegúrate de que tu proyecto tenga esta estructura:

```
club-nautico-app/
└── backend/
    ├── .env                    ← Crear este archivo con las credenciales
    ├── .gitignore
    ├── pom.xml
    ├── mvnw
    ├── mvnw.cmd
    └── src/
        ├── main/
        │   ├── java/
        │   └── resources/
        │       └── application.properties
        └── test/
            └── java/
```

## Verificar la conexión a la base de datos

Antes de ejecutar la aplicación, verifica que la conexión funcione correctamente:

```bash
.\mvnw test -Dtest=DatabaseConnectionTest
```

Si todo está bien configurado, deberías ver:

```
✅ ¡CONEXIÓN EXITOSA!
✅ CONSULTA EJECUTADA EXITOSAMENTE!
[INFO] Tests run: 4, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

Si obtienes errores:
- Verifica que el archivo `.env` exista y tenga el formato correcto
- Confirma que la contraseña sea la correcta
- Asegúrate de tener conexión a internet

## Ejecutar la aplicación

### Opción 1: Con Maven Wrapper (recomendado)

```bash
# Windows
.\mvnw spring-boot:run

# Linux/Mac
./mvnw spring-boot:run
```

### Opción 2: Con Maven instalado globalmente

```bash
mvn spring-boot:run
```

La aplicación se iniciará en `http://localhost:8080`

## Ejecutar los tests

```bash
# Todos los tests
.\mvnw test

# Un test específico
.\mvnw test -Dtest=DatabaseConnectionTest
```

## Compilar el proyecto

```bash
# Limpiar y compilar
.\mvnw clean install

# Solo compilar
.\mvnw compile
```

## Problemas comunes

### Error: "No se pudo cargar la configuración desde .env"

**Solución:** Verifica que el archivo `.env` existe en `backend/.env` y tiene el formato correcto (sin espacios extra, sin extensión `.txt` oculta).

### Error: "UnknownHostException" o "Connection refused"

**Posibles causas:**
- Tu red corporativa/universitaria puede estar bloqueando la conexión
- Las credenciales en `.env` son incorrectas

**Solución:** 
- Intenta conectarte desde otra red (datos móviles, WiFi de casa)
- Verifica que las credenciales sean exactamente las compartidas
- Ejecuta el test de conexión para más detalles: `.\mvnw test -Dtest=DatabaseConnectionTest`

### Error: "Failed to load ApplicationContext"

**Solución:** Ejecuta `.\mvnw clean install` y luego intenta de nuevo.

## Comandos útiles

```bash
# Ver logs detallados
.\mvnw spring-boot:run -X

# Limpiar archivos compilados
.\mvnw clean

# Actualizar dependencias
.\mvnw dependency:resolve

# Ver árbol de dependencias
.\mvnw dependency:tree
```

## Tecnologías utilizadas

- Java 21
- Spring Boot 3.5.5
- Spring Data JPA
- PostgreSQL (Supabase)
- Hibernate
- Lombok
- Maven

## Estructura de la base de datos

La aplicación usa Hibernate con `ddl-auto=validate`, lo que significa que:
- NO crea tablas automáticamente
- Valida que el esquema de BD coincida con las entidades
- Las migraciones se manejan manualmente

## Variables de entorno

El proyecto utiliza las siguientes variables de entorno definidas en `.env`:

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `DB_HOST` | Host de la base de datos | `aws-1-sa-east-1.pooler.supabase.com` |
| `DB_PORT` | Puerto de conexión | `6543` |
| `DB_NAME` | Nombre de la base de datos | `postgres` |
| `DB_USER` | Usuario de la base de datos | `postgres.urwefjumjrtummdlhdir` |
| `DB_PASS` | Contraseña (no compartir públicamente) | `[PRIVADO]` |
| `DB_SSLMODE` | Modo SSL | `require` |

## Contacto y soporte

Si tienes problemas con la configuración:
1. Revisa esta guía completa
2. Ejecuta el test de conexión para obtener más detalles
3. Consulta con el equipo en el grupo

## Notas de seguridad

- NUNCA subas el archivo `.env` a Git
- NUNCA compartas las credenciales públicamente
- Si expones accidentalmente las credenciales, notifica al equipo inmediatamente