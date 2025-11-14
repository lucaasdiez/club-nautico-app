package com.clubNautico.service.parteMedico;

import com.clubNautico.dto.ArchivoDTO;
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
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.time.LocalDateTime;
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
    public ParteMedico subirParteMedico(ParteMedicoDTO parteMedicoDTO, MultipartFile archivo) {

        if (parteMedicoDTO.getFechaVencimiento() == null || !parteMedicoDTO.getFechaVencimiento().isAfter(LocalDate.now())) {
            throw new RuntimeException("El parte medico se encuentra vencido");
        }
        if (archivo == null || archivo.isEmpty()) {
            throw new RuntimeException("Debe adjuntar un archivo");
        }

        Socio socio = socioRepository.findByNroSocio(parteMedicoDTO.getNroSocio())
                .orElseThrow(() -> new RuntimeException("Socio no encontrado"));
        Disciplina disciplina = disciplinaRepository.findByNombre(parteMedicoDTO.getNombreDisciplina())
                .orElseThrow(() -> new RuntimeException("Disciplina no encontrada"));
        Archivo archivoNuevo = archivoService.archivoUpload(archivo, socio.getId());

        ParteMedico parteMedico = ParteMedico.builder()
                .archivo(archivoNuevo)
                .socio(socio)
                .disciplina(disciplina)
                .fechaVencimiento(parteMedicoDTO.getFechaVencimiento())
                .subidoEn(LocalDateTime.now())
                .build();
        return parteMedicoRepository.save(parteMedico);
    }

    @Override
    public List<ParteMedico> listarParteMedicos(String nroSocio) {
        Socio socio = socioRepository.findByNroSocio(nroSocio)
                .orElseThrow(() -> new RuntimeException("Socio no encontrado"));
        List<ParteMedico> parteMedicos= parteMedicoRepository.findAllBySocioId(socio.getId());
        if(parteMedicos.isEmpty()){
            throw new RuntimeException("No tiene parte medicos");
        }
        return parteMedicos;
    }

    @Override
    public ParteMedicoDTO convertirADTO(ParteMedico parteMedico) {
        ParteMedicoDTO parteMedicoDTO = modelMapper.map(parteMedico, ParteMedicoDTO.class);
        if(parteMedico.getArchivo() != null){
            ArchivoDTO archivoDTO = ArchivoDTO.builder()
                    .id(parteMedico.getArchivo().getId())
                    .nombre(parteMedico.getArchivo().getNombre())
                    .rutaDescarga("/archivos/archivo/descargar/" + parteMedico.getArchivo().getId())
                    .build();
            parteMedicoDTO.setArchivo(archivoDTO);
        }
        return parteMedicoDTO;
    }

    @Override
    public List<ParteMedicoDTO> convertirDTO(List<ParteMedico> parteMedicos) {
        return parteMedicos.stream()
                .map(parteMedico -> {
                    ParteMedicoDTO parteMedicoDTO = modelMapper.map(parteMedico, ParteMedicoDTO.class);
                    if(parteMedico.getArchivo() != null){
                        ArchivoDTO archivoDTO = ArchivoDTO.builder()
                                .id(parteMedico.getArchivo().getId())
                                .nombre(parteMedico.getArchivo().getNombre())
                                .rutaDescarga("/archivos/archivo/descargar/" + parteMedico.getArchivo().getId())
                                .build();
                        parteMedicoDTO.setArchivo(archivoDTO);
                    }
                    return parteMedicoDTO;
                })
                .collect(Collectors.toList());
    }
}
