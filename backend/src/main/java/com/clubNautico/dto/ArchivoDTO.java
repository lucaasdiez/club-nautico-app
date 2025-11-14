package com.clubNautico.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ArchivoDTO {
    private Integer id;
    private String nombre;
    private String rutaDescarga;
}
