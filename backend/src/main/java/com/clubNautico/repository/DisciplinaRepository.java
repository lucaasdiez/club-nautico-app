package com.clubNautico.repository;

import com.clubNautico.model.Disciplina;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;


public interface DisciplinaRepository extends JpaRepository<Disciplina, String> {
    Optional<Disciplina> findByNombre(String nombre);
}
