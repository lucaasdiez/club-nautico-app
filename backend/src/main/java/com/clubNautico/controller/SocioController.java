package com.clubNautico.controller;

import java.util.List;
import java.util.UUID;

import com.clubNautico.dto.SocioDTO;
import com.clubNautico.enums.EstadoCuota;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
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
@RequiredArgsConstructor
@RequestMapping("/api/socios")
@CrossOrigin(origins = "*")
public class SocioController {

    private final SocioService socioService;


    @PostMapping
    public ResponseEntity<?> crearSocio(@RequestBody SocioDTO socio) {
        try {
            Socio nuevo = socioService.createSocio(socio);
            SocioDTO socioDTO = socioService.convertirADTO(nuevo);
            return ResponseEntity.ok(socioDTO);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping
    public List<SocioDTO> listarSocios() {
        return socioService.convertirADTOS(socioService.getAllSocios());
    }

    @PutMapping("/{nroSocio}")
    public ResponseEntity<?> actualizarSocio(@PathVariable Long nroSocio, @RequestBody SocioDTO socio) {
        try {
            Socio actualizado = socioService.actualizarSocio(nroSocio, socio);
            SocioDTO socioDTO = socioService.convertirADTO(actualizado);
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

    @GetMapping("/socio/{nroSocio}")
    public ResponseEntity<?> getSocioByNumeroSocio(@PathVariable Long nroSocio) {
        try {
            SocioDTO socioDTO = socioService.convertirADTO(socioService.buscarSocioPorNumero(nroSocio));
            return ResponseEntity.ok(socioDTO);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }

    }

    @GetMapping("/socio/{estadoCuota}")
    public ResponseEntity<?> getSocioByNumeroSocio(@PathVariable EstadoCuota estadoCuota) {
        try {
            List<SocioDTO> socioDTO = socioService.convertirADTOS(socioService.getSociosPorCuota(estadoCuota));
            return ResponseEntity.ok(socioDTO);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }


    }
}