package com.clubNautico.service.disciplina;

import com.clubNautico.dto.DisciplinaDTO;
import com.clubNautico.model.Disciplina;

import java.util.List;

public interface DisciplinaService {
    Disciplina crearDisciplina(DisciplinaDTO disciplina);
    void updateDisciplina(Disciplina disciplinaNueva, String nombreDisciplinaVieja);
    List<Disciplina> listarDisciplinas();
    Disciplina getDisciplinaPorNombre(String nombre);
    DisciplinaDTO convertirADTO(Disciplina disciplina);
    List<DisciplinaDTO> convertirADTOS(List<Disciplina> disciplinas);
}
