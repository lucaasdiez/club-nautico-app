package com.clubNautico.repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import com.clubNautico.enums.EstadoCuota;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.clubNautico.model.Socio;

public interface SocioRepository extends JpaRepository<Socio, UUID> {
    
    Optional<Socio> findByDni(String dni);
    Optional<Socio> findByEmail(String email);
    Optional<Socio> findByNroSocio(String nroSocio);
    List<Socio> findAllByEstadoCuota(EstadoCuota estadoCuota);
}