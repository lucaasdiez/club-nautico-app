package com.clubNautico.controller;


import com.clubNautico.dto.CodigoAcceso.CodigoAccesoResponseDTO;
import com.clubNautico.dto.CodigoAcceso.ValidarCodigoResponse;
import com.clubNautico.model.CodigoAcceso;
import com.clubNautico.service.codigoAcceso.CodigoAccesoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/codigo-acceso")
@RequiredArgsConstructor
public class CodigoAccesoController {

    private final CodigoAccesoService codigoAccesoService;

    @PostMapping("/generar/{nroSocio}")
    public ResponseEntity<CodigoAccesoResponseDTO> generarCodigo(@PathVariable String nroSocio) {
        CodigoAcceso codigoAcceso = codigoAccesoService.generarCodigoParaSocio(nroSocio);
        return ResponseEntity.ok(codigoAccesoService.convertirADto(codigoAcceso));
    }

    @PostMapping("/validar")
    public ResponseEntity<ValidarCodigoResponse> validarCodigo(@RequestBody String token) {
        ValidarCodigoResponse response = codigoAccesoService.validarCodigo(token);
        return ResponseEntity.ok(response);
    }

}
