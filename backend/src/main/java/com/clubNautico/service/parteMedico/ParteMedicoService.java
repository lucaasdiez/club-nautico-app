package com.clubNautico.service.parteMedico;

import com.clubNautico.dto.ParteMedicoDTO;
import com.clubNautico.model.ParteMedico;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.time.LocalDate;
import java.util.List;

public interface ParteMedicoService {
    ParteMedico subirParteMedico(ParteMedicoDTO parteMedicoDTO);
    List<ParteMedico> listarParteMedicos(String nroSocio);
    ParteMedicoDTO convertirADTO(ParteMedico parteMedico);
    List<ParteMedicoDTO> convertirDTO(List<ParteMedico> parteMedicos);
}
