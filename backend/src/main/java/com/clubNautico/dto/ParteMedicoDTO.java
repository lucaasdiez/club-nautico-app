package com.clubNautico.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
public class ParteMedicoDTO {
    private String nroSocio;
    private String nombreDisciplina;
    private LocalDate fechaVencimiento;
    private MultipartFile archivo;
}
