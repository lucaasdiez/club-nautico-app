package com.clubNautico.model;

import java.time.LocalDate;
import java.util.UUID;

import com.clubNautico.enums.EstadoCuota;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@DiscriminatorValue("SOCIO")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Socio extends Usuario {

    @Column(name = "nro_socio", insertable = false, updatable = false)
    private Long nroSocio;
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

    private EstadoCuota estadoCuota;

}