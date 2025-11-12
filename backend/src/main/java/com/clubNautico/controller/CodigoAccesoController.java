package com.clubNautico.controller;


import com.clubNautico.dto.CodigoAcceso.CodigoAccesoResponseDTO;
import com.clubNautico.dto.CodigoAcceso.ValidarCodigoResponse;
import com.clubNautico.model.CodigoAcceso;
import com.clubNautico.response.ApiResponse;
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
    public ResponseEntity<?> generarCodigo(@PathVariable String nroSocio) {
        CodigoAcceso codigoAcceso = codigoAccesoService.generarCodigoParaSocio(nroSocio);
        CodigoAccesoResponseDTO codigoAccesoResponseDTO = codigoAccesoService.convertirADto(codigoAcceso);
        return ResponseEntity.ok(new ApiResponse("Codigo Acceso Generado",codigoAccesoResponseDTO));
    }

    @PostMapping("/validar/{token}")
    public ResponseEntity<?> validarCodigo(@PathVariable String token) {
        ValidarCodigoResponse response = codigoAccesoService.validarCodigo(token);
        return ResponseEntity.ok(new ApiResponse("Codigo de acceso Validado",response));
    }

}
