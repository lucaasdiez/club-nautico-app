package com.clubNautico.service.disciplina;

import com.clubNautico.repository.DisciplinaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class DisciplinaServiceImpl {
    private final DisciplinaRepository disciplinaRepository;
}
