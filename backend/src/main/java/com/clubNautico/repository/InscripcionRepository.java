package com.clubNautico.repository;

import com.clubNautico.enums.InscripcionEstado;
import com.clubNautico.model.Inscripcion;
import com.clubNautico.model.Socio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface InscripcionRepository extends JpaRepository<Inscripcion, String>{
    boolean existsBySocio_IdAndDisciplina_IdAndEstado(UUID socioId, UUID disciplinaId, InscripcionEstado estado);

    @Query("SELECT COUNT(i) FROM Inscripcion i WHERE i.disciplina.id = :disciplinaId")
    long cantidadInscriptos(@Param("disciplinaId")UUID id);


    Optional<Inscripcion> findBySocio_IdAndDisciplina_IdAndEstado(UUID socioId, UUID disciplinaId, InscripcionEstado estado);

    Optional<List<Inscripcion>> findAllBySocio_Id(UUID id);

    Optional<List<Inscripcion>> findAllByDisciplina_Id(UUID id);
}
