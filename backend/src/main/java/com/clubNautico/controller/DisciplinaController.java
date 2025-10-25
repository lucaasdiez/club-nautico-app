package com.clubNautico.controller;


import com.clubNautico.dto.DisciplinaDTO;
import com.clubNautico.model.Disciplina;
import com.clubNautico.service.disciplina.DisciplinaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/disciplinas")
@CrossOrigin(origins = "*")
public class DisciplinaController {
    private final DisciplinaService disciplinaService;

    @GetMapping
    public ResponseEntity<?> listarDisciplinas() {
        try {
            List<Disciplina> disciplinas = disciplinaService.listarDisciplinas();
            return ResponseEntity.ok().body(disciplinaService.convertirADTOS(disciplinas));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/disciplina/{nombre}")
    public ResponseEntity<?> listarDisciplinaPorNombre(@PathVariable String nombre) {
        try {
            Disciplina disciplina = disciplinaService.getDisciplinaPorNombre(nombre);
            return ResponseEntity.ok().body(disciplinaService.convertirADTO(disciplina));
        }catch (Exception e){
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/crear")
    public ResponseEntity<?> crearDisciplina(@RequestBody DisciplinaDTO disciplinaDTO) {
        try {
            Disciplina disciplina = disciplinaService.crearDisciplina(disciplinaDTO);
            return ResponseEntity.ok().body(disciplinaService.convertirADTO(disciplina));
        }catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


}
