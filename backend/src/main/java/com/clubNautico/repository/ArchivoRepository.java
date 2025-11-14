package com.clubNautico.repository;

import com.clubNautico.model.Archivo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.CrudRepository;

import java.util.UUID;

public interface ArchivoRepository extends JpaRepository<Archivo, Integer> {
}
