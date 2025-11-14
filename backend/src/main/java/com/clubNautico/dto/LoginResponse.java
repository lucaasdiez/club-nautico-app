package com.clubNautico.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class LoginResponse {
    private String rol;       // "admin" o "socio"
    private String mensaje;
    private String token;
}
