package com.clubNautico.dto;


import com.clubNautico.enums.DiaSemana;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class DisciplinaHorarioDTO {
    private DiaSemana dia;
    private LocalTime horaInicio;
    private LocalTime horaFin;

}
