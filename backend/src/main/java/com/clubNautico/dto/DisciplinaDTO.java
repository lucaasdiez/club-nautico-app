package com.clubNautico.dto;

import com.clubNautico.enums.DisciplinaEstado;
import com.clubNautico.model.DisciplinaHorario;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DisciplinaDTO {
    private String nombre;
    private String descripcion;
    private BigDecimal precioMensual;
    private Integer cupoMaximo;
    private DisciplinaEstado estado;
    private List<DisciplinaHorarioDTO> horarios;
}
