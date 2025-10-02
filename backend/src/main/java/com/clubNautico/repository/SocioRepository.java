package com.clubNautico.repository;

import com.clubNautico.model.Socio;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface SocioRepository extends JpaRepository<Socio, UUID> {
    Optional<Socio> findByDni(String dni);
    Optional<Socio> findByEmail(String email);
}