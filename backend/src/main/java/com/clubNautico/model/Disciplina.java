package com.clubNautico.model;


import com.clubNautico.enums.DisciplinaEstado;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Disciplina {
    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable=false)
    private String nombre;
    @Column(nullable=false)
    private String descripcion;

    @Column(nullable=false)
    private BigDecimal precioMensual;

    @Column(nullable=false)
    private Integer cupoMaximo;

    @Enumerated(EnumType.STRING) @Column(nullable=false)
    private DisciplinaEstado estado = DisciplinaEstado.ACTIVA;


    @OneToMany(mappedBy="disciplina", cascade=CascadeType.ALL, orphanRemoval=true, fetch=FetchType.LAZY)
    private List<DisciplinaHorario> horarios = new ArrayList<>();
}

