package com.clubNautico.repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.clubNautico.model.ConsultaChatbot;

public interface ConsultaChatbotRepository extends JpaRepository<ConsultaChatbot, UUID> {
    
    // Contar consultas totales
    long count();
    
    // Consultas por rango de fechas
    @Query("SELECT c FROM ConsultaChatbot c WHERE c.fecha BETWEEN :inicio AND :fin ORDER BY c.fecha DESC")
    List<ConsultaChatbot> findByFechaBetween(
        @Param("inicio") LocalDateTime inicio, 
        @Param("fin") LocalDateTime fin
    );
    
    // Consultas de hoy
    @Query("SELECT COUNT(c) FROM ConsultaChatbot c WHERE CAST(c.fecha AS date) = CURRENT_DATE")
    long countConsultasHoy();
    
    // Consultas desde una fecha
    @Query("SELECT COUNT(c) FROM ConsultaChatbot c WHERE c.fecha >= :fecha")
    long countConsultasDesdeFecha(@Param("fecha") LocalDateTime fecha);
    
    // Tiempo promedio de respuesta
    @Query("SELECT AVG(c.tiempoRespuestaMs) FROM ConsultaChatbot c WHERE c.tiempoRespuestaMs IS NOT NULL")
    Double promedioTiempoRespuesta();
    
    // Usuarios únicos (por sessionId)
    @Query("SELECT COUNT(DISTINCT c.sessionId) FROM ConsultaChatbot c")
    Long countUsuariosUnicos();
    
    // ⭐ NUEVO: Top preguntas agrupadas por cluster (similitud semántica)
    @Query("""
        SELECT c.preguntaRepresentativa, COUNT(c) as cantidad 
        FROM ConsultaChatbot c 
        WHERE c.preguntaRepresentativa IS NOT NULL
        GROUP BY c.preguntaRepresentativa 
        ORDER BY cantidad DESC 
        LIMIT 10
    """)
    List<Object[]> findTopPreguntasPorCluster();
    
    // ⭐ NUEVO: Preguntas agrupadas por categoría
    @Query("""
        SELECT c.categoria, c.preguntaRepresentativa, COUNT(c) as cantidad 
        FROM ConsultaChatbot c 
        WHERE c.categoria IS NOT NULL 
        GROUP BY c.categoria, c.preguntaRepresentativa 
        ORDER BY c.categoria, cantidad DESC
    """)
    List<Object[]> findPreguntasPorCategoria();
    
    // ⭐ NUEVO: Todas las consultas que tienen embedding (para comparar similitud)
    @Query("SELECT c FROM ConsultaChatbot c WHERE c.embedding IS NOT NULL ORDER BY c.fecha DESC")
    List<ConsultaChatbot> findAllWithEmbedding();
    
    // Tendencias diarias (últimos 30 días)
    @Query("""
        SELECT CAST(c.fecha AS date) as fecha, COUNT(c) as cantidad 
        FROM ConsultaChatbot c 
        WHERE c.fecha >= :fecha 
        GROUP BY CAST(c.fecha AS date) 
        ORDER BY CAST(c.fecha AS date) DESC
    """)
    List<Object[]> findTendenciasDiarias(@Param("fecha") LocalDateTime fecha);
    
    // Consultas por tipo de usuario
    @Query("""
        SELECT c.tipoUsuario, COUNT(c) 
        FROM ConsultaChatbot c 
        GROUP BY c.tipoUsuario
    """)
    List<Object[]> countPorTipoUsuario();
    
    // Últimas N consultas
    List<ConsultaChatbot> findTop20ByOrderByFechaDesc();
    
    // ⭐ NUEVO: Distribución por categoría
    @Query("""
        SELECT c.categoria, COUNT(c) 
        FROM ConsultaChatbot c 
        WHERE c.categoria IS NOT NULL 
        GROUP BY c.categoria 
        ORDER BY COUNT(c) DESC
    """)
    List<Object[]> countPorCategoria();
}