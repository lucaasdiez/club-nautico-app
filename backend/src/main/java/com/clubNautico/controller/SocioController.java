package com.clubNautico.controller;

import com.clubNautico.model.Socio;
import com.clubNautico.service.socio.SocioService;
import jakarta.validation.ValidationException;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/socios")
@CrossOrigin(origins = "*")
public class SocioController {

    @Autowired
    private SocioService socioService;

    @GetMapping
    public List<Socio> getAll() {
        return socioService.getAllSocios();
    }

    @PostMapping
    public ResponseEntity<Socio> create(@RequestBody Socio socio) {
        try {
            Socio nuevo = socioService.createSocio(socio);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
        } catch (ValidationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Socio> update(@PathVariable Long id, @RequestBody Socio socio) {
        try {
            return ResponseEntity.ok(socioService.updateSocio(id, socio));
        } catch (ValidationException | EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        socioService.deleteSocio(id);
        return ResponseEntity.noContent().build();
    }
}
