package com.clubNautico.controller;

import com.clubNautico.model.Socio;
import com.clubNautico.service.socio.SocioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/socios")
@CrossOrigin(origins = "*")
public class SocioController {

    private final SocioService socioService;

    public SocioController(SocioService socioService) {
        this.socioService = socioService;
    }

    @PostMapping
    public ResponseEntity<?> crearSocio(@RequestBody Socio socio) {
        try {
            Socio nuevo = socioService.createSocio(socio);
            return ResponseEntity.ok(nuevo);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping
    public List<Socio> listarSocios() {
        return socioService.getAllSocios();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarSocio(@PathVariable UUID id, @RequestBody Socio socio) {
        try {
            Socio actualizado = socioService.updateSocio(id, socio);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarSocio(@PathVariable UUID id) {
        socioService.deleteSocio(id);
        return ResponseEntity.ok("Socio eliminado correctamente");
    }
}