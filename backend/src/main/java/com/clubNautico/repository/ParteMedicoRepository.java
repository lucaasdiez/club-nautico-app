package com.clubNautico.repository;

import com.clubNautico.model.ParteMedico;
import com.clubNautico.model.Socio;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface ParteMedicoRepository extends JpaRepository<ParteMedico, String> {
    List<ParteMedico> findAllBySocioId(UUID socioId);
}
