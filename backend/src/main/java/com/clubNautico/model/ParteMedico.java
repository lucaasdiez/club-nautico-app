package com.clubNautico.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ParteMedico {

    @Id @GeneratedValue
    private UUID id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private Socio socio;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private Disciplina disciplina;

    @Column(nullable = false)
    private LocalDate fechaVencimiento;

    @OneToOne(optional = false, fetch = FetchType.LAZY)
    private Archivo archivo;

    @Column(nullable = false)
    private LocalDateTime subidoEn;
}
