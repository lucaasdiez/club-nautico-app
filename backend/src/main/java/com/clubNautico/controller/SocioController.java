package com.clubNautico.controller;

import java.util.List;

import com.clubNautico.dto.SocioDTO;
import com.clubNautico.enums.EstadoCuota;
import com.clubNautico.model.Socio;
import com.clubNautico.service.socio.SocioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/socios")
@CrossOrigin(origins = "*")
public class SocioController {

    private final SocioService socioService;

    // 🟢 CREAR socio (POST /api/socios)
    @PostMapping
    public ResponseEntity<?> crearSocio(@RequestBody SocioDTO socio) {
        try {
            Socio nuevo = socioService.createSocio(socio);
            SocioDTO socioDTO = socioService.convertirADTO(nuevo);
            return ResponseEntity.status(HttpStatus.CREATED).body(socioDTO);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    // 🔵 LISTAR todos los socios (GET /api/socios)
    @GetMapping
    public ResponseEntity<List<SocioDTO>> listarSocios() {
        List<SocioDTO> socios = socioService.convertirADTOS(socioService.getAllSocios());
        return ResponseEntity.ok(socios);
    }

    // 🟡 ACTUALIZAR socio por número (PUT /api/socios/{nroSocio})
    @PutMapping("/{nroSocio}")
    public ResponseEntity<?> actualizarSocio(@PathVariable String nroSocio, @RequestBody SocioDTO socio) {
        try {
            Socio actualizado = socioService.actualizarSocio(nroSocio, socio);
            SocioDTO socioDTO = socioService.convertirADTO(actualizado);
            return ResponseEntity.ok(socioDTO);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    // 🔴 ELIMINAR socio (DELETE /api/socios/{nroSocio})
    @DeleteMapping("/{nroSocio}")
    public ResponseEntity<?> eliminarSocio(@PathVariable String nroSocio) {
        socioService.deleteSocio(nroSocio);
        return ResponseEntity.ok("Socio eliminado correctamente");
    }

    // 🔍 BUSCAR socio por número (GET /api/socios/numero/{nroSocio})
    @GetMapping("/numero/{nroSocio}")
    public ResponseEntity<?> getSocioByNumeroSocio(@PathVariable String nroSocio) {
        try {
            SocioDTO socioDTO = socioService.convertirADTO(socioService.buscarSocioPorNumero(nroSocio));
            return ResponseEntity.ok(socioDTO);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    // ⚙️ FILTRAR socios por estado de cuota (GET /api/socios/estado/{estadoCuota})
    @GetMapping("/estado/{estadoCuota}")
    public ResponseEntity<?> getSociosPorEstado(@PathVariable EstadoCuota estadoCuota) {
        try {
            List<SocioDTO> socios = socioService.convertirADTOS(socioService.getSociosPorCuota(estadoCuota));
            return ResponseEntity.ok(socios);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}
