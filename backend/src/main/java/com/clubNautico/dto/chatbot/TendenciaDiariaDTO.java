package com.clubNautico.dto.chatbot;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class TendenciaDiariaDTO {
    private String fecha;
    private Long cantidad;
}
