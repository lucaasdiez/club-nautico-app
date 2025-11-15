package com.clubNautico.dto.chatbot;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EstadisticasChatbotDTO {
    private Long totalConsultas;        // TODAS las consultas
    private Long totalPreguntas;
    private Long consultasHoy;
    private Long consultasSemana;
    private Long consultasMes;
    private Double tiempoPromedioRespuesta;
    private Integer usuariosUnicos;
}
