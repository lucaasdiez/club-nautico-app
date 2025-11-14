package com.clubNautico.controller;

import com.clubNautico.dto.ParteMedicoDTO;
import com.clubNautico.model.ParteMedico;
import com.clubNautico.response.ApiResponse;
import com.clubNautico.service.parteMedico.ParteMedicoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/parte-medico")
@RequiredArgsConstructor
public class ParteMedicoController {

    private final ParteMedicoService parteMedicoService;

    @GetMapping("/{nroSocio}")
    public ResponseEntity<ApiResponse> listar(@PathVariable String nroSocio) {
        List<ParteMedico> parteMedicos = parteMedicoService.listarParteMedicos(nroSocio);
        List<ParteMedicoDTO> parteMedicoDTOS = parteMedicoService.convertirDTO(parteMedicos);
        return ResponseEntity.ok(new ApiResponse("OK", parteMedicoDTOS));
    }

    @PostMapping(value = "/subir")
    public ResponseEntity<ApiResponse> subir(@RequestParam ParteMedicoDTO parteMedicoDTO){
        ParteMedico parteMedico=  parteMedicoService.subirParteMedico(parteMedicoDTO);
        ParteMedicoDTO parteMedicoNuevo = parteMedicoService.convertirADTO(parteMedico);
        return ResponseEntity.ok(new ApiResponse("Parte Medico creado correctamente", parteMedicoNuevo));
    }
}

