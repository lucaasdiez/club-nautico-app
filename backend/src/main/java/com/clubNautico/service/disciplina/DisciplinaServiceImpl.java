package com.clubNautico.service.disciplina;

import com.clubNautico.dto.DisciplinaDTO;
import com.clubNautico.dto.DisciplinaHorarioDTO;
import com.clubNautico.enums.DisciplinaEstado;
import com.clubNautico.model.Disciplina;
import com.clubNautico.model.DisciplinaHorario;
import com.clubNautico.model.Socio;
import com.clubNautico.repository.DisciplinaRepository;
import com.clubNautico.repository.SocioRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DisciplinaServiceImpl implements DisciplinaService{
    private final DisciplinaRepository disciplinaRepository;
    private final SocioRepository socioRepository;
    private final ModelMapper modelMapper;

    @Override
    public Disciplina crearDisciplina(DisciplinaDTO disciplina) {
        List<DisciplinaHorarioDTO> disciplinaHorarioDTO = disciplina.getHorarios();
        boolean existeDisciplina = disciplinaRepository.existsByNombre(disciplina.getNombre());
        if(existeDisciplina) throw new RuntimeException("Disciplina ya existente");

        Disciplina disciplinaNueva= Disciplina.builder()
                .nombre(disciplina.getNombre())
                .cupoMaximo(disciplina.getCupoMaximo())
                .descripcion(disciplina.getDescripcion())
                .precioMensual(disciplina.getPrecioMensual())
                .estado(DisciplinaEstado.ACTIVA)
                .build();

        List<DisciplinaHorario> disciplinaHorario = crearDisciplinaHorarios(disciplinaHorarioDTO, disciplinaNueva);
        disciplinaNueva.setHorarios(disciplinaHorario);
        return disciplinaRepository.save(disciplinaNueva);
    }

    private List<DisciplinaHorario> crearDisciplinaHorarios(List<DisciplinaHorarioDTO> disciplinaHorarioDTO, Disciplina disciplinaNueva) {
        if(disciplinaHorarioDTO.isEmpty()) return null;
        return disciplinaHorarioDTO.stream().map(disciplinaHorario ->
                DisciplinaHorario.builder()
                        .dia(disciplinaHorario.getDia())
                        .horaInicio(disciplinaHorario.getHoraInicio())
                        .horaFin(disciplinaHorario.getHoraFin())
                        .disciplina(disciplinaNueva)
                .build())
                .collect(Collectors.toList());
    }

    @Override
    public Disciplina updateDisciplina(DisciplinaDTO disciplinaNueva, String nombreDisciplinaVieja) {
        Disciplina disciplina = disciplinaRepository.findByNombre(nombreDisciplinaVieja)
                .orElseThrow(() -> new RuntimeException("Disciplina no encontrada"));
        disciplina.setNombre(disciplinaNueva.getNombre());
        disciplina.setCupoMaximo(disciplina.getCupoMaximo());
        disciplina.setDescripcion(disciplina.getDescripcion());
        List<DisciplinaHorario> nuevosHorarios = disciplinaNueva.getHorarios()
                .stream()
                .map(h -> DisciplinaHorario.builder()
                        .dia(h.getDia())
                        .horaInicio(h.getHoraInicio())
                        .horaFin(h.getHoraFin())
                        .disciplina(disciplina)
                        .build()
                )
                .collect(Collectors.toCollection(ArrayList::new));
        disciplina.getHorarios().clear();
        disciplina.getHorarios().addAll(nuevosHorarios);
        disciplina.setPrecioMensual(disciplina.getPrecioMensual());

        return disciplinaRepository.save(disciplina);

    }

    @Override
    public void eliminarDisciplina(String nombreDisciplina) {
        Disciplina disciplina = disciplinaRepository.findByNombre(nombreDisciplina)
                .orElseThrow(() -> new RuntimeException("Disciplina no encontrada"));
        disciplina.setEstado(DisciplinaEstado.INACTIVA);
        disciplinaRepository.save(disciplina);
    }

    @Override
    public List<Disciplina> listarDisciplinas() {
        return disciplinaRepository.findAll();
    }

    @Override
    public Disciplina getDisciplinaPorNombre(String nombre) {
        return disciplinaRepository.findByNombre(nombre)
                .orElseThrow(() -> new RuntimeException("Disciplina no encontrada"));
    }

    @Override
    public DisciplinaDTO convertirADTO(Disciplina disciplina) {
        return modelMapper.map(disciplina, DisciplinaDTO.class);
    }

    @Override
    public List<DisciplinaDTO> convertirADTOS(List<Disciplina> disciplinas) {
        return disciplinas.stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

}
