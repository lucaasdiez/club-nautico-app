package com.clubNautico.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.clubNautico.model.Socio;

public interface SocioRepository extends JpaRepository<Socio, UUID> {
    
    Optional<Socio> findByDni(String dni);
    Optional<Socio> findByEmail(String email);
    
    // Búsqueda por nombre, apellido o DNI (case insensitive)
    @Query("SELECT s FROM Socio s WHERE " +
           "LOWER(s.nombre) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.apellido) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "s.dni LIKE CONCAT('%', :query, '%')")
    List<Socio> buscarPorNombreApellidoODni(@Param("query") String query);
    
    // Obtener socios con estado de cuota usando la vista v_estado_cuota
    @Query(value = 
        "SELECT s.id, s.nro_socio, s.dni, s.nombre, s.apellido, s.email, s.telefono, " +
        "s.fecha_alta, s.activo, s.categoria_id, " +
        "v.estado, v.meses_adeudados, v.ultimo_pagado " +
        "FROM socios s " +
        "LEFT JOIN v_estado_cuota v ON s.id = v.socio_id " +
        "ORDER BY s.apellido, s.nombre", 
        nativeQuery = true)
    List<Object[]> findAllConEstadoCuota();
    
    // Filtrar socios por estado de cuota
    @Query(value = 
        "SELECT s.id, s.nro_socio, s.dni, s.nombre, s.apellido, s.email, s.telefono, " +
        "s.fecha_alta, s.activo, s.categoria_id, " +
        "v.estado, v.meses_adeudados, v.ultimo_pagado " +
        "FROM socios s " +
        "LEFT JOIN v_estado_cuota v ON s.id = v.socio_id " +
        "WHERE v.estado = :estado " +
        "ORDER BY s.apellido, s.nombre", 
        nativeQuery = true)
    List<Object[]> findByEstadoCuota(@Param("estado") String estado);
    
    // Buscar socios con estado de cuota
    @Query(value = 
        "SELECT s.id, s.nro_socio, s.dni, s.nombre, s.apellido, s.email, s.telefono, " +
        "s.fecha_alta, s.activo, s.categoria_id, " +
        "v.estado, v.meses_adeudados, v.ultimo_pagado " +
        "FROM socios s " +
        "LEFT JOIN v_estado_cuota v ON s.id = v.socio_id " +
        "WHERE LOWER(s.nombre) LIKE LOWER(CONCAT('%', :query, '%')) " +
        "OR LOWER(s.apellido) LIKE LOWER(CONCAT('%', :query, '%')) " +
        "OR s.dni LIKE CONCAT('%', :query, '%') " +
        "ORDER BY s.apellido, s.nombre", 
        nativeQuery = true)
    List<Object[]> buscarConEstadoCuota(@Param("query") String query);
}