package com.clubNautico.controller;


import com.clubNautico.dto.DisciplinaDTO;
import com.clubNautico.model.Disciplina;
import com.clubNautico.response.ApiResponse;
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
    public ResponseEntity<ApiResponse> listarDisciplinas() {
        List<Disciplina> disciplinas = disciplinaService.listarDisciplinas();
        List<DisciplinaDTO> disciplinaDTOS= disciplinaService.convertirADTOS(disciplinas);
        return ResponseEntity.ok(new ApiResponse("Listado de disciplinas", disciplinaDTOS));
    }

    @GetMapping("/disciplina/{nombre}")
    public ResponseEntity<ApiResponse> buscarDisciplinaPorNombre(@PathVariable String nombre) {
        Disciplina disciplina = disciplinaService.getDisciplinaPorNombre(nombre);
        DisciplinaDTO disciplinaDTO = disciplinaService.convertirADTO(disciplina);
        return ResponseEntity.ok(new ApiResponse("Disciplina encontrada", disciplinaDTO));
    }

    @PostMapping("/crear")
    public ResponseEntity<ApiResponse> crearDisciplina(@RequestBody DisciplinaDTO disciplinaDTO) {
        Disciplina disciplina = disciplinaService.crearDisciplina(disciplinaDTO);
        DisciplinaDTO dto = disciplinaService.convertirADTO(disciplina);
        return ResponseEntity.ok(new ApiResponse("Disciplina creada correctamente", dto));
    }


}
