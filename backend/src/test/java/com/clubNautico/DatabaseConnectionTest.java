package com.clubNautico;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.junit.jupiter.api.Assertions.fail;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import io.github.cdimascio.dotenv.Dotenv;

/**
 * Test para verificar la conexión con la base de datos de Supabase
 * 
 * INSTRUCCIONES PARA TUS COMPAÑEROS:
 * 1. Crear un archivo .env en la raíz del proyecto backend/ con las siguientes variables:
 *    DB_HOST=db.urwefjumjrtummdlhdir.supabase.co
 *    DB_PORT=5432
 *    DB_NAME=postgres
 *    DB_USER=postgres
 *    DB_PASS=tu_password_aqui
 *    DB_SSLMODE=require
 * 
 * 2. Ejecutar el test con: mvnw test -Dtest=DatabaseConnectionTest
 * 
 * NOTA: Este test NO requiere levantar el contexto de Spring Boot,
 * solo prueba la conexión directa a la base de datos usando JDBC.
 */
class DatabaseConnectionTest {

    private static String dbUrl;
    private static String dbUser;
    private static String dbPassword;

    @BeforeAll
    static void setup() {
        System.out.println("\n" + "=".repeat(70));
        System.out.println("🚀 TEST DE CONEXIÓN A BASE DE DATOS - CLUB NÁUTICO");
        System.out.println("=".repeat(70));
        
        try {
            // Cargar variables del archivo .env
            Dotenv dotenv = Dotenv.configure()
                    .directory("./")
                    .ignoreIfMissing()
                    .load();

            String dbHost = dotenv.get("DB_HOST");
            String dbPort = dotenv.get("DB_PORT");
            String dbName = dotenv.get("DB_NAME");
            dbUser = dotenv.get("DB_USER");
            dbPassword = dotenv.get("DB_PASS");
            String sslMode = dotenv.get("DB_SSLMODE");

            // Validar que todas las variables existen
            assertNotNull(dbHost, "❌ DB_HOST no encontrado en .env");
            assertNotNull(dbPort, "❌ DB_PORT no encontrado en .env");
            assertNotNull(dbName, "❌ DB_NAME no encontrado en .env");
            assertNotNull(dbUser, "❌ DB_USER no encontrado en .env");
            assertNotNull(dbPassword, "❌ DB_PASS no encontrado en .env");
            assertNotNull(sslMode, "❌ DB_SSLMODE no encontrado en .env");

            // Construir URL de conexión JDBC
            dbUrl = String.format("jdbc:postgresql://%s:%s/%s?sslmode=%s",
                    dbHost, dbPort, dbName, sslMode);

            System.out.println("\n📋 Configuración cargada desde .env:");
            System.out.println("   ✓ Host: " + dbHost);
            System.out.println("   ✓ Port: " + dbPort);
            System.out.println("   ✓ Database: " + dbName);
            System.out.println("   ✓ User: " + dbUser);
            System.out.println("   ✓ SSL Mode: " + sslMode);
            System.out.println("\n📡 URL de conexión: " + dbUrl);
            System.out.println();
            
        } catch (Exception e) {
            System.err.println("\n❌ ERROR al cargar el archivo .env");
            System.err.println("💡 Asegúrate de que el archivo .env existe en: backend/.env");
            System.err.println("💡 El archivo debe contener:");
            System.err.println("   DB_HOST=db.urwefjumjrtummdlhdir.supabase.co");
            System.err.println("   DB_PORT=5432");
            System.err.println("   DB_NAME=postgres");
            System.err.println("   DB_USER=postgres");
            System.err.println("   DB_PASS=tu_password");
            System.err.println("   DB_SSLMODE=require");
            throw new RuntimeException("No se pudo cargar la configuración desde .env", e);
        }
    }

    @Test
    void test1_ConexionBasica() {
        System.out.println("─".repeat(70));
        System.out.println("🔍 TEST 1: Verificando conexión básica a la base de datos");
        System.out.println("─".repeat(70));

        try (Connection connection = DriverManager.getConnection(dbUrl, dbUser, dbPassword)) {
            
            assertNotNull(connection, "❌ La conexión no debería ser null");
            assertFalse(connection.isClosed(), "❌ La conexión no debería estar cerrada");

            System.out.println("\n✅ ¡CONEXIÓN EXITOSA!");
            System.out.println("\n📊 Información de la conexión:");
            System.out.println("   • Catálogo (Database): " + connection.getCatalog());
            System.out.println("   • Schema actual: " + connection.getSchema());
            System.out.println("   • Solo lectura: " + connection.isReadOnly());
            System.out.println("   • Auto-commit: " + connection.getAutoCommit());
            System.out.println("   • Driver: " + connection.getMetaData().getDriverName());
            System.out.println("   • Versión driver: " + connection.getMetaData().getDriverVersion());

        } catch (Exception e) {
            System.err.println("\n❌ ERROR AL CONECTAR:");
            System.err.println("   " + e.getMessage());
            System.err.println("\n💡 Verifica:");
            System.err.println("   • Que las credenciales en .env sean correctas");
            System.err.println("   • Que tengas conexión a internet");
            System.err.println("   • Que Supabase esté operativo");
            e.printStackTrace();
            fail("Error al conectar con la base de datos: " + e.getMessage());
        }
        
        System.out.println("\n" + "─".repeat(70) + "\n");
    }

    @Test
    void test2_ConsultaSQL() {
        System.out.println("─".repeat(70));
        System.out.println("🔍 TEST 2: Ejecutando consulta SQL de prueba");
        System.out.println("─".repeat(70));

        try (Connection connection = DriverManager.getConnection(dbUrl, dbUser, dbPassword);
             Statement statement = connection.createStatement()) {

            String query = "SELECT version(), current_database(), current_user, now()";
            System.out.println("\n📝 Query: " + query);
            
            ResultSet resultSet = statement.executeQuery(query);

            assertTrue(resultSet.next(), "❌ La consulta debería retornar resultados");

            String version = resultSet.getString(1);
            String database = resultSet.getString(2);
            String user = resultSet.getString(3);
            String timestamp = resultSet.getString(4);

            System.out.println("\n✅ ¡CONSULTA EJECUTADA EXITOSAMENTE!");
            System.out.println("\n📊 Resultados:");
            System.out.println("   🐘 PostgreSQL: " + version);
            System.out.println("   💾 Base de datos: " + database);
            System.out.println("   👤 Usuario: " + user);
            System.out.println("   🕐 Timestamp servidor: " + timestamp);

            assertNotNull(version, "❌ La versión no debería ser null");
            assertTrue(version.toLowerCase().contains("postgresql"),
                    "❌ Debería ser PostgreSQL");

        } catch (Exception e) {
            System.err.println("\n❌ ERROR AL EJECUTAR CONSULTA:");
            System.err.println("   " + e.getMessage());
            e.printStackTrace();
            fail("Error al ejecutar consulta: " + e.getMessage());
        }
        
        System.out.println("\n" + "─".repeat(70) + "\n");
    }

    @Test
    void test3_ListarTablas() {
        System.out.println("─".repeat(70));
        System.out.println("🔍 TEST 3: Listando tablas del schema público");
        System.out.println("─".repeat(70));

        try (Connection connection = DriverManager.getConnection(dbUrl, dbUser, dbPassword);
             Statement statement = connection.createStatement()) {

            String query = """
                    SELECT table_name, table_type
                    FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    ORDER BY table_name
                    """;

            ResultSet resultSet = statement.executeQuery(query);

            System.out.println("\n📋 Tablas encontradas en el schema 'public':");
            System.out.println();
            
            int count = 0;
            while (resultSet.next()) {
                String tableName = resultSet.getString("table_name");
                String tableType = resultSet.getString("table_type");
                System.out.println(String.format("   %2d. %-35s [%s]", 
                    ++count, tableName, tableType));
            }

            if (count == 0) {
                System.out.println("   ⚠️  No hay tablas creadas todavía");
                System.out.println("   💡 Esto es normal si es una base de datos nueva");
                System.out.println("   💡 Las tablas se crearán cuando ejecutes la aplicación");
            } else {
                System.out.println("\n✅ Total de tablas: " + count);
            }

        } catch (Exception e) {
            System.err.println("\n❌ ERROR AL LISTAR TABLAS:");
            System.err.println("   " + e.getMessage());
            e.printStackTrace();
            fail("Error al listar tablas: " + e.getMessage());
        }
        
        System.out.println("\n" + "─".repeat(70) + "\n");
    }

    @Test
    void test4_ListarSchemas() {
        System.out.println("─".repeat(70));
        System.out.println("🔍 TEST 4: Listando schemas disponibles");
        System.out.println("─".repeat(70));

        try (Connection connection = DriverManager.getConnection(dbUrl, dbUser, dbPassword);
             Statement statement = connection.createStatement()) {

            String query = """
                    SELECT schema_name 
                    FROM information_schema.schemata 
                    WHERE schema_name NOT IN ('information_schema', 'pg_catalog', 'pg_toast')
                    ORDER BY schema_name
                    """;

            ResultSet resultSet = statement.executeQuery(query);

            System.out.println("\n📁 Schemas disponibles:");
            System.out.println();
            
            int count = 0;
            while (resultSet.next()) {
                String schemaName = resultSet.getString("schema_name");
                System.out.println("   " + (++count) + ". " + schemaName);
            }

            System.out.println("\n✅ Total de schemas: " + count);
            assertTrue(count > 0, "❌ Debería haber al menos un schema");

        } catch (Exception e) {
            System.err.println("\n❌ ERROR AL LISTAR SCHEMAS:");
            System.err.println("   " + e.getMessage());
            e.printStackTrace();
            fail("Error al listar schemas: " + e.getMessage());
        }
        
        System.out.println("\n" + "─".repeat(70) + "\n");
    }
}