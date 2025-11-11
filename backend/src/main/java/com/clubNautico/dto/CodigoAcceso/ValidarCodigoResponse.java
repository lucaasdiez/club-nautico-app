package com.clubNautico.dto.CodigoAcceso;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ValidarCodigoResponse {
    private boolean valido;
    private String mensaje;
    private String socioNumero;
    private String socioNombre;
    private LocalDateTime expiraEn;

}
