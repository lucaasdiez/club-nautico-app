package com.clubNautico.model;

import com.clubNautico.enums.EstadoCodigo;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Getter
@Setter
@AllArgsConstructor
@Builder
@NoArgsConstructor
public class CodigoAcceso {
    @Id
    @GeneratedValue
    private UUID id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    private Socio socio;

    @Column(nullable = false, unique = true, length = 64)
    private String token;

    @Column(nullable = false, length = 16)
    private EstadoCodigo estadoCodigo;

    @Column(nullable = false)
    private LocalDateTime expiraEn;

    private LocalDateTime usadoEn;
}
