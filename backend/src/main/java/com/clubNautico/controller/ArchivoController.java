package com.clubNautico.controller;

import com.clubNautico.service.archivo.ArchivoService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;




@RequiredArgsConstructor
@RestController
@CrossOrigin("*")
@RequestMapping("/archivos")
public class ArchivoController {
    private final ArchivoService archivoService;

    @GetMapping("archivo/descargar/{id}")
    public ResponseEntity<UrlResource> descargarArchivo(@PathVariable Integer id) {
        return archivoService.descargarArchivo(id);
    }
}
