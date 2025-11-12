package com.clubNautico.repository;

import com.clubNautico.model.CodigoAcceso;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;
import java.util.UUID;

public interface CodigoAccesoRepository extends JpaRepository<CodigoAcceso, Integer> {
    @Modifying
    @Query("""
        UPDATE CodigoAcceso c
           SET c.estadoCodigo = com.clubNautico.enums.EstadoCodigo.REVOCADO
         WHERE c.socio.id = :socioId
           AND c.estadoCodigo = com.clubNautico.enums.EstadoCodigo.VALIDO
    """)
    void revocarCodigosActivos(@Param("socioId") UUID id);

    Optional<CodigoAcceso> findByToken(String token);
}
