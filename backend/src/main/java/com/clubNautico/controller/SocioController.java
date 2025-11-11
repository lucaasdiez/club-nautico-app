package com.clubNautico.controller;

import java.util.List;
import java.util.UUID;

import com.clubNautico.dto.SocioDTO;
import com.clubNautico.enums.EstadoCuota;
import com.clubNautico.response.ApiResponse;
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
import org.springframework.web.bind.annotation.RestController;

import com.clubNautico.model.Socio;
import com.clubNautico.service.socio.SocioService;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/socios")
@CrossOrigin(origins = "*")
public class SocioController {

    private final SocioService socioService;


    @PostMapping("/crear")
    public ResponseEntity<ApiResponse> crearSocio(@RequestBody SocioDTO socio) {
        Socio nuevo = socioService.createSocio(socio);
        SocioDTO socioDTO = socioService.convertirADTO(nuevo);
        return ResponseEntity.ok(new ApiResponse("Socio creado correctamente",socioDTO));

    }

    @GetMapping
    public ResponseEntity<ApiResponse> listarSocios() {
        List<SocioDTO> socioDTOS= socioService.convertirADTOS(socioService.getAllSocios());
        return ResponseEntity.ok(new ApiResponse("Listado de Socios", socioDTOS));
    }

    @PutMapping("/{nroSocio}")
    public ResponseEntity<ApiResponse> actualizarSocio(@PathVariable String nroSocio, @RequestBody SocioDTO socio) {
        Socio actualizado = socioService.actualizarSocio(nroSocio, socio);
        SocioDTO socioDTO = socioService.convertirADTO(actualizado);
        return ResponseEntity.ok(new ApiResponse("Socio actualizado correctamente",socioDTO));
    }

    @DeleteMapping("/{numeroSocio}")
    public ResponseEntity<ApiResponse> eliminarSocio(@PathVariable String numeroSocio) {
        socioService.deleteSocio(numeroSocio);
        return ResponseEntity.ok(new ApiResponse("Socio eliminado correctamente", null));
    }

    @GetMapping("/socio/numero/{nroSocio}")
    public ResponseEntity<ApiResponse> getSocioByNumeroSocio(@PathVariable String nroSocio) {
        SocioDTO socioDTO = socioService.convertirADTO(socioService.buscarSocioPorNumero(nroSocio));
        return ResponseEntity.ok(new ApiResponse("Socio buscado correctamente",socioDTO));

    }

    @GetMapping("/socio/estado/{estadoCuota}")
    public ResponseEntity<ApiResponse> getSocioByEstadoCuota(@PathVariable EstadoCuota estadoCuota) {
        List<SocioDTO> socioDTO = socioService.convertirADTOS(socioService.getSociosPorCuota(estadoCuota));
        return ResponseEntity.ok(new ApiResponse("Listado de Socios", socioDTO));
    }
}