package com.clubNautico.dto.CodigoAcceso;

import lombok.*;

import java.time.Instant;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CodigoAccesoResponseDTO {
    private String token;
    private String qrContenido;
    private LocalDateTime expiraEn;
}
