package com.clubNautico.dto.chatbot;

import lombok.*;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ConsultaChatbotDTO {
    private String id;
    private String pregunta;
    private String respuesta;
    private LocalDateTime fecha;
    private Long tiempoRespuestaMs;
    private String nombreSocio;
    private String tipoUsuario;
}
