package com.clubNautico.model;

import java.time.LocalDate;
import java.util.UUID;

import com.clubNautico.enums.EstadoCuota;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.security.core.GrantedAuthority;
import java.util.Collection;
import java.util.List;

@Entity
@DiscriminatorValue("SOCIO")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Socio extends Usuario {

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(() -> "ROLE_SOCIO");
    }
    @Column(name = "nro_socio", nullable = false, unique = true)
    private String nroSocio;

    @Column(nullable = false, length = 15)
    private String dni;

    @Column(nullable = false, length = 100)
    private String nombre;

    @Column(nullable = false, length = 100)
    private String apellido;

    @Column(nullable = false, length = 150)
    private String email;

    @Column(length = 30)
    private String telefono;

    @Column(name = "fecha_alta", nullable = false)
    private LocalDate fechaAlta;

    @Column(nullable = false)
    private Boolean activo = true;

    @Column(name = "categoria_id")
    private UUID categoriaId;

    @Column(name = "fecha_vencimiento", nullable = false)
    private LocalDate fechaVencimiento;

    @Column(name = "ultimo_pagado", nullable = false)
    private LocalDate ultimoPagado;

    @Column(name = "meses_adeudados", nullable = false)
    private Integer mesesAdeudados;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EstadoCuota estadoCuota;
}
