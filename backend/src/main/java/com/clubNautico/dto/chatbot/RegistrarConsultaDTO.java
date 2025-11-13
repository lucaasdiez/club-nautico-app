package com.clubNautico.dto.chatbot;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class RegistrarConsultaDTO {
    private String sessionId;
    private String pregunta;
    private String respuesta;
    private Long tiempoRespuestaMs;
    private String nroSocio;
    private String tipoUsuario;
}
