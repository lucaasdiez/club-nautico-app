package com.clubNautico.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "consulta_chatbot")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ConsultaChatbot {
    
    @Id
    @GeneratedValue
    private UUID id;
    
    // Session ID del usuario (del localStorage)
    @Column(nullable = false, length = 100)
    private String sessionId;
    
    // La pregunta original del usuario
    @Column(nullable = false, columnDefinition = "TEXT")
    private String pregunta;
    
    // Embedding de la pregunta (vector de 1536 dimensiones para text-embedding-3-small)
    // Se guarda como JSON string: "[0.123, -0.456, ...]"
    @Column(columnDefinition = "TEXT")
    private String embedding;
    
    // ID del cluster/grupo al que pertenece (preguntas similares)
    @Column(length = 100)
    private String clusterId;
    
    // Pregunta representativa del cluster
    @Column(columnDefinition = "TEXT")
    private String preguntaRepresentativa;
    
    // La respuesta del bot
    @Column(columnDefinition = "TEXT")
    private String respuesta;
    
    // Timestamp
    @Column(nullable = false)
    private LocalDateTime fecha;
    
    // Tiempo que tardó en responder (ms)
    private Long tiempoRespuestaMs;
    
    // Si el usuario estaba logueado
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "socio_id")
    private Socio socio;
    
    // Metadata adicional
    @Column(length = 50)
    private String tipoUsuario; // "socio", "admin", "anonimo"
    
    // Categoría detectada por IA
    @Column(length = 50)
    private String categoria;
    
    @PrePersist
    protected void onCreate() {
        if (fecha == null) {
            fecha = LocalDateTime.now();
        }
    }
}
