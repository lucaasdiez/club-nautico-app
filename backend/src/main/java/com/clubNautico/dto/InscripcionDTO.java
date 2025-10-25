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
public class InscripcionDTO {
    private String codigo;
    private String nroSocio;
    private String nombreSocio;
    private String nombreDisciplina;
    private String estado;
    private LocalDate fechaBaja;
}
