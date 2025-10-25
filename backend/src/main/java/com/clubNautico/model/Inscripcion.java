package com.clubNautico.model;

import com.clubNautico.enums.InscripcionEstado;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inscripcion {
    @Id
    @GeneratedValue
    private UUID id;

    private String codigo;

    @ManyToOne(optional = false)
    private Socio socio;
    @ManyToOne(optional = false)
    private Disciplina disciplina;
    @Enumerated(EnumType.STRING) @Column(nullable=false)
    private InscripcionEstado estado = InscripcionEstado.ACTIVA;

    private LocalDate fechaBaja;
}
