package com.clubNautico.controller;

import com.clubNautico.dto.InscripcionDTO;
import com.clubNautico.model.Inscripcion;
import com.clubNautico.service.inscripcion.InscripcionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/inscripciones")
@CrossOrigin(origins = "*")
public class InscripcionController {

    private final InscripcionService inscripcionService;

    @GetMapping("/socio/{nroSocio}")
    public ResponseEntity<?> obtenerInscripcionesPorSocio(@PathVariable String nroSocio) {
        try {
            List<Inscripcion> inscripciones = inscripcionService.getInscripcionesSocio(nroSocio);
            List<InscripcionDTO> inscripcionDTOS = inscripcionService.convertirADTOS(inscripciones);
            return ResponseEntity.ok().body(inscripcionDTOS);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/disciplina/{nombreDisciplina}")
    public ResponseEntity<?> obtenerInscripcionesPorDisciplina(@PathVariable String nombreDisciplina) {
        try {
            List<Inscripcion> inscripciones = inscripcionService.getInscripcionesDisciplina(nombreDisciplina);
            List<InscripcionDTO> inscripcionDTOS = inscripcionService.convertirADTOS(inscripciones);
            return ResponseEntity.ok().body(inscripcionDTOS);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/inscribirse")
    public ResponseEntity<?> inscribirSocio(
            @RequestParam String nroSocio,
            @RequestParam String nombreDisciplina) {
        try {
            Inscripcion inscripcion = inscripcionService.inscribirDisciplina(nroSocio, nombreDisciplina);
            InscripcionDTO inscripcionDTO = inscripcionService.convertirADTO(inscripcion);
            return ResponseEntity.ok().body(inscripcionDTO);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @DeleteMapping("/cancelar")
    public ResponseEntity<?> cancelarInscripcion(
            @RequestParam String nroSocio,
            @RequestParam String nombreDisciplina) {
        try {
            inscripcionService.cancelarInscripcion(nroSocio, nombreDisciplina);
            return ResponseEntity.ok().body("Inscripción cancelada correctamente");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
