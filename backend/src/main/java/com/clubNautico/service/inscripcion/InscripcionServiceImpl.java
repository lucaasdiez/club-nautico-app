package com.clubNautico.service.inscripcion;

import com.clubNautico.enums.DisciplinaEstado;
import com.clubNautico.enums.InscripcionEstado;
import com.clubNautico.model.Disciplina;
import com.clubNautico.model.Inscripcion;
import com.clubNautico.model.Socio;
import com.clubNautico.repository.DisciplinaRepository;
import com.clubNautico.repository.InscripcionRepository;
import com.clubNautico.repository.SocioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InscripcionServiceImpl implements InscripcionService {
    private final InscripcionRepository inscripcionRepository;
    private final DisciplinaRepository disciplinaRepository;
    private final SocioRepository socioRepository;

    @Override
    public Inscripcion inscribirDisciplina(String nroSocio, String nombreDisciplina) {
        long count = inscripcionRepository.count() + 1;
        String codigo = String.format("INS-%05d", count);

        Socio socio = socioRepository.findByNroSocio(nroSocio)
                .orElseThrow(() -> new RuntimeException("Socio no encontrado"));
        Disciplina disciplina = disciplinaRepository.findByNombre(nombreDisciplina)
                .orElseThrow(() -> new RuntimeException("Disciplina no encontrada"));

        if(disciplina.getEstado() != DisciplinaEstado.ACTIVA) throw new RuntimeException("Disciplina inactiva");
        boolean yaInscripto = inscripcionRepository.existsBySocio_IdAndDisciplina_IdAndEstado(socio.getId(), disciplina.getId(), InscripcionEstado.ACTIVA);
        if(yaInscripto) throw new RuntimeException("El socio ya está inscripto en esta disciplina");

        long cantInscriptos = inscripcionRepository.cantidadInscriptos(disciplina.getId());
        if(cantInscriptos >= disciplina.getCupoMaximo()) throw new RuntimeException("No hay cupos disponibles");

        Inscripcion inscripcion = Inscripcion.builder()
                .socio(socio)
                .disciplina(disciplina)
                .estado(InscripcionEstado.ACTIVA)
                .codigo(codigo)
                .build();

        return inscripcionRepository.save(inscripcion);
    }

    @Override
    public void cancelarInscripcion(String nroSocio, String nombreDisciplina) {
        Socio socio = socioRepository.findByNroSocio(nroSocio)
                .orElseThrow(() -> new RuntimeException("Socio no encontrado"));
        Disciplina disciplina = disciplinaRepository.findByNombre(nombreDisciplina)
                .orElseThrow(() -> new RuntimeException("Disciplina no encontrada"));
        Inscripcion inscripcion =  inscripcionRepository
                .findBySocio_IdAndDisciplina_IdAndEstado(socio.getId(), disciplina.getId(), InscripcionEstado.ACTIVA)
                .orElseThrow(() -> new RuntimeException("No se encontró una inscripción activa para cancelar"));


        inscripcion.setEstado(InscripcionEstado.CANCELADA);
        inscripcion.setFechaBaja(LocalDate.now());
        inscripcionRepository.save(inscripcion);
    }

    @Override
    public List<Inscripcion> getInscripcionesSocio(String nroSocio) {
        Socio socio = socioRepository.findByNroSocio(nroSocio)
                .orElseThrow(() -> new RuntimeException("Socio no encontrado"));

        return inscripcionRepository.findAllBySocio_Id(socio.getId())
                .orElseThrow(() -> new RuntimeException("El socio no tiene inscripciones registradas"));

    }

    @Override
    public List<Inscripcion> getInscripcionesDisciplina(String nombreDisciplina) {
        Disciplina disciplina = disciplinaRepository.findByNombre(nombreDisciplina)
                .orElseThrow(() -> new RuntimeException("Disciplina no encontrada"));

        return inscripcionRepository.findAllByDisciplina_Id(disciplina.getId())
                .orElseThrow(() -> new RuntimeException("No hay inscripciones registradas para esta disciplina"));
    }
}
