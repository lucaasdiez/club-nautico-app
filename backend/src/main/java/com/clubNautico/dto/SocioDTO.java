package com.clubNautico.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.UUID;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SocioDTO {

    private String username;
    private String password;
    private UUID id;
    private Long nroSocio;
    private String dni;
    private String nombre;
    private String apellido;
    private String email;
    private String telefono;
    private LocalDate fechaAlta;
    private Boolean activo;

    // Datos de estado de cuota
    private String estadoCuota;  // AL_DIA, POR_VENCER, VENCIDA
    private Integer mesesAdeudados;
    private LocalDate ultimoPagado;

}