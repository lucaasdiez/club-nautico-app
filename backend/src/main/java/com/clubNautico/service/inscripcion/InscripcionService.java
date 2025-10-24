package com.clubNautico.service.inscripcion;

import com.clubNautico.model.Inscripcion;

import java.util.List;

public interface InscripcionService {
    Inscripcion inscribirDisciplina(String nroSocio, String nombreDisciplina);
    void cancelarInscripcion(String nroSocio, String nombreDisciplina);
    List<Inscripcion> getInscripcionesSocio(String nroSocio);
    List<Inscripcion> getInscripcionesDisciplina(String nombreDisciplina);
}
