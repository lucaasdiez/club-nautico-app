package com.clubNautico.model;
import com.clubNautico.enums.DiaSemana;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.UUID;

@Entity
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class DisciplinaHorario {
    @Id @GeneratedValue private UUID id;

    @ManyToOne(optional=false)
    private Disciplina disciplina;

    @Enumerated(EnumType.STRING) @Column(nullable=false)
    private DiaSemana dia;

    @Column(nullable=false)
    private LocalTime horaInicio;
    @Column(nullable=false)
    private LocalTime horaFin;
}

