package com.clubNautico.controller;

import com.clubNautico.dto.InscripcionDTO;
import com.clubNautico.model.Inscripcion;
import com.clubNautico.response.ApiResponse;
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
    public ResponseEntity<ApiResponse> obtenerInscripcionesPorSocio(@PathVariable String nroSocio) {
        List<Inscripcion> inscripciones = inscripcionService.getInscripcionesSocio(nroSocio);
        List<InscripcionDTO> inscripcionDTOS = inscripcionService.convertirADTOS(inscripciones);
        return ResponseEntity.ok(new ApiResponse("Inscripciones encontradas", inscripcionDTOS));
    }

    @GetMapping("/disciplina/{nombreDisciplina}")
    public ResponseEntity<ApiResponse> obtenerInscripcionesPorDisciplina(@PathVariable String nombreDisciplina) {
        List<Inscripcion> inscripciones = inscripcionService.getInscripcionesDisciplina(nombreDisciplina);
        List<InscripcionDTO> inscripcionDTOS = inscripcionService.convertirADTOS(inscripciones);
        return ResponseEntity.ok(new ApiResponse("OK", inscripcionDTOS));
    }

    @PostMapping("/inscribirse")
    public ResponseEntity<ApiResponse> inscribirSocio(@RequestParam String nroSocio, @RequestParam String nombreDisciplina) {
        Inscripcion inscripcion = inscripcionService.inscribirDisciplina(nroSocio, nombreDisciplina);
        InscripcionDTO inscripcionDTO = inscripcionService.convertirADTO(inscripcion);
        return ResponseEntity.ok(new ApiResponse("Socio inscripto con exito", inscripcionDTO));
    }

    @DeleteMapping("/cancelar")
    public ResponseEntity<ApiResponse> cancelarInscripcion(@RequestParam String nroSocio, @RequestParam String nombreDisciplina) {
        inscripcionService.cancelarInscripcion(nroSocio, nombreDisciplina);
        return ResponseEntity.ok(new ApiResponse("Inscripción cancelada correctamente", null));
    }
}
