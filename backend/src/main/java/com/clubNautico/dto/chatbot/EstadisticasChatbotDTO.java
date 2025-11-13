package com.clubNautico.dto.chatbot;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class EstadisticasChatbotDTO {
    private Long totalConsultas;
    private Long consultasHoy;
    private Long consultasSemana;
    private Long consultasMes;
    private Double tiempoPromedioRespuesta;
    private Integer usuariosUnicos;
}
