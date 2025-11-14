package com.clubNautico.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ParteMedicoDTO {
    private String nroSocio;
    private String nombreDisciplina;
    private LocalDate fechaVencimiento;
    private ArchivoDTO archivo;
}
