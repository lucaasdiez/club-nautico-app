package com.clubNautico.service.parteMedico;

import com.clubNautico.dto.ParteMedicoDTO;
import com.clubNautico.model.Archivo;
import com.clubNautico.model.Disciplina;
import com.clubNautico.model.ParteMedico;
import com.clubNautico.model.Socio;
import com.clubNautico.repository.DisciplinaRepository;
import com.clubNautico.repository.ParteMedicoRepository;
import com.clubNautico.repository.SocioRepository;
import com.clubNautico.service.archivo.ArchivoService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ParteMedicoServiceImpl implements ParteMedicoService {
    private final SocioRepository socioRepository;
    private final ParteMedicoRepository parteMedicoRepository;
    private final ArchivoService archivoService;
    private final DisciplinaRepository disciplinaRepository;
    private final ModelMapper modelMapper;

    @Override
    public ParteMedico subirParteMedico(ParteMedicoDTO parteMedicoDTO) {

        if (parteMedicoDTO.getFechaVencimiento() == null || !parteMedicoDTO.getFechaVencimiento().isAfter(LocalDate.now())) {
            throw new RuntimeException("El parte medico se encuentra vencido");
        }
        if (parteMedicoDTO.getArchivo() == null || parteMedicoDTO.getArchivo().isEmpty()) {
            throw new RuntimeException("Debe adjuntar un archivo");
        }

        Socio socio = socioRepository.findByNroSocio(parteMedicoDTO.getNroSocio())
                .orElseThrow(() -> new RuntimeException("Socio no encontrado"));
        Disciplina disciplina = disciplinaRepository.findByNombre(parteMedicoDTO.getNombreDisciplina())
                .orElseThrow(() -> new RuntimeException("Disciplina no encontrada"));
        Archivo archivoNuevo = archivoService.archivoUpload(parteMedicoDTO.getArchivo(), socio.getId());

        ParteMedico parteMedico = ParteMedico.builder()
                .archivo(archivoNuevo)
                .socio(socio)
                .disciplina(disciplina)
                .fechaVencimiento(parteMedicoDTO.getFechaVencimiento())
                .build();
        return parteMedicoRepository.save(parteMedico);
    }

    @Override
    public List<ParteMedico> listarParteMedicos(String nroSocio) {
        Socio socio = socioRepository.findByNroSocio(nroSocio)
                .orElseThrow(() -> new RuntimeException("Socio no encontrado"));
        return parteMedicoRepository.findAllBySocioId(socio.getId());
    }

    @Override
    public ParteMedicoDTO convertirADTO(ParteMedico parteMedico) {
        return modelMapper.map(parteMedico, ParteMedicoDTO.class);
    }

    @Override
    public List<ParteMedicoDTO> convertirDTO(List<ParteMedico> parteMedicos) {
        return parteMedicos.stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }
}
