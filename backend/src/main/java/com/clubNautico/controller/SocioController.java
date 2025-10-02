package com.clubNautico.controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.clubNautico.dto.SocioConEstadoDTO;
import com.clubNautico.model.Socio;
import com.clubNautico.service.socio.SocioService;

@RestController
@RequestMapping("/api/socios")
@CrossOrigin(origins = "*")
public class SocioController {

    private final SocioService socioService;

    public SocioController(SocioService socioService) {
        this.socioService = socioService;
    }

    // ===== CRUD BÁSICO =====
    
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

    // ===== BÚSQUEDA =====
    
    /**
     * Buscar socios por nombre, apellido o DNI
     * GET /api/socios/buscar?q=juan
     */
    @GetMapping("/buscar")
    public List<Socio> buscarSocios(@RequestParam(value = "q", required = false) String query) {
        return socioService.buscarSocios(query);
    }

    // ===== SOCIOS CON ESTADO DE CUOTA =====
    
    /**
     * Listar todos los socios con su estado de cuota
     * GET /api/socios/con-estado
     * 
     * También permite filtrar por estado:
     * GET /api/socios/con-estado?estado=VENCIDA
     * GET /api/socios/con-estado?estado=AL_DIA
     * GET /api/socios/con-estado?estado=POR_VENCER
     * 
     * Y buscar con estado:
     * GET /api/socios/con-estado?q=juan
     */
    @GetMapping("/con-estado")
    public List<SocioConEstadoDTO> listarSociosConEstado(
            @RequestParam(value = "estado", required = false) String estado,
            @RequestParam(value = "q", required = false) String query) {
        
        // Si hay búsqueda por texto
        if (query != null && !query.trim().isEmpty()) {
            return socioService.buscarSociosConEstado(query);
        }
        
        // Si hay filtro por estado
        if (estado != null && !estado.trim().isEmpty()) {
            return socioService.getSociosPorEstadoCuota(estado);
        }
        
        // Si no hay filtros, devolver todos
        return socioService.getSociosConEstadoCuota();
    }
}