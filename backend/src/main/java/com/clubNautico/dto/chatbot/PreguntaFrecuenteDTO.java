package com.clubNautico.dto.chatbot;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class PreguntaFrecuenteDTO {
    private String pregunta;
    private Long cantidad;
    private Double porcentaje;
}
