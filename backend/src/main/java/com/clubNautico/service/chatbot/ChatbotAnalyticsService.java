package com.clubNautico.service.chatbot;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.clubNautico.dto.chatbot.ConsultaChatbotDTO;
import com.clubNautico.dto.chatbot.EstadisticasChatbotDTO;
import com.clubNautico.dto.chatbot.PreguntaFrecuenteDTO;
import com.clubNautico.dto.chatbot.RegistrarConsultaDTO;
import com.clubNautico.dto.chatbot.TendenciaDiariaDTO;
import com.clubNautico.model.ConsultaChatbot;
import com.clubNautico.repository.ConsultaChatbotRepository;
import com.clubNautico.repository.SocioRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@RequiredArgsConstructor
@Slf4j
public class ChatbotAnalyticsService {
    
    private final ConsultaChatbotRepository consultaRepository;
    private final SocioRepository socioRepository;
    private final OpenAIService openAIService;
    private final ModelMapper modelMapper;
    
    @Value("${similarity.threshold:0.80}")
    private double similarityThreshold;
    
    /**
     * Registrar una nueva consulta con embedding y clustering
     */
    @Transactional
    public ConsultaChatbot registrarConsulta(RegistrarConsultaDTO dto) {
        log.info("Registrando consulta: {}", dto.getPregunta());
        
        // 1. Generar embedding de la pregunta
        List<Double> embedding = openAIService.generarEmbedding(dto.getPregunta());
        String embeddingJson = embedding != null ? openAIService.serializarEmbedding(embedding) : null;
        
        // 2. Buscar pregunta similar existente
        String clusterId = null;
        String preguntaRepresentativa = dto.getPregunta();
        
        if (embedding != null) {
            ConsultaChatbot consultaSimilar = buscarConsultaSimilar(embedding);
            if (consultaSimilar != null) {
                clusterId = consultaSimilar.getClusterId();
                preguntaRepresentativa = consultaSimilar.getPreguntaRepresentativa();
                log.info("Encontrada pregunta similar. Cluster: {}", clusterId);
            } else {
                // Nueva pregunta, crear nuevo cluster
                clusterId = UUID.randomUUID().toString();
                log.info("Nueva pregunta única. Creando cluster: {}", clusterId);
            }
        }
        
        // 3. Categorizar automáticamente
        String categoria = openAIService.categorizarPregunta(dto.getPregunta());
        
        // 4. Crear y guardar consulta
        ConsultaChatbot consulta = ConsultaChatbot.builder()
                .sessionId(dto.getSessionId())
                .pregunta(dto.getPregunta())
                .embedding(embeddingJson)
                .clusterId(clusterId)
                .preguntaRepresentativa(preguntaRepresentativa)
                .respuesta(dto.getRespuesta())
                .tiempoRespuestaMs(dto.getTiempoRespuestaMs())
                .tipoUsuario(dto.getTipoUsuario() != null ? dto.getTipoUsuario() : "anonimo")
                .categoria(categoria)
                .fecha(LocalDateTime.now())
                .build();
        
        // 5. Si viene nroSocio, asociar
        if (dto.getNroSocio() != null) {
            socioRepository.findByNroSocio(dto.getNroSocio())
                    .ifPresent(consulta::setSocio);
        }
        
        return consultaRepository.save(consulta);
    }
    
    /**
     * Buscar si existe una consulta similar (mismo significado)
     */
    private ConsultaChatbot buscarConsultaSimilar(List<Double> nuevoEmbedding) {
        // Obtener todas las consultas con embedding
        List<ConsultaChatbot> todasLasConsultas = consultaRepository.findAllWithEmbedding();
        
        double maxSimilitud = 0.0;
        ConsultaChatbot mejorMatch = null;
        
        for (ConsultaChatbot consulta : todasLasConsultas) {
            if (consulta.getEmbedding() == null) continue;
            
            List<Double> embeddingExistente = openAIService.deserializarEmbedding(consulta.getEmbedding());
            if (embeddingExistente == null) continue;
            
            double similitud = openAIService.calcularSimilitudCoseno(nuevoEmbedding, embeddingExistente);
            
            if (similitud > maxSimilitud && similitud >= similarityThreshold) {
                maxSimilitud = similitud;
                mejorMatch = consulta;
            }
        }
        
        if (mejorMatch != null) {
            log.info("Similitud encontrada: {} con pregunta '{}'", 
                     maxSimilitud, mejorMatch.getPreguntaRepresentativa());
        }
        
        return mejorMatch;
    }
    
    /**
     * Obtener estadísticas generales
     */
    public EstadisticasChatbotDTO obtenerEstadisticas() {
        LocalDateTime hace7Dias = LocalDateTime.now().minusDays(7);
        LocalDateTime hace30Dias = LocalDateTime.now().minusDays(30);
        
        return EstadisticasChatbotDTO.builder()
                .totalConsultas(consultaRepository.count())
                .consultasHoy(consultaRepository.countConsultasHoy())
                .consultasSemana(consultaRepository.countConsultasDesdeFecha(hace7Dias))
                .consultasMes(consultaRepository.countConsultasDesdeFecha(hace30Dias))
                .tiempoPromedioRespuesta(consultaRepository.promedioTiempoRespuesta())
                .usuariosUnicos(consultaRepository.countUsuariosUnicos().intValue())
                .build();
    }
    
    /**
     * Top preguntas frecuentes AGRUPADAS por similitud semántica
     */
    public List<PreguntaFrecuenteDTO> obtenerPreguntasFrecuentes() {
        List<Object[]> results = consultaRepository.findTopPreguntasPorCluster();
        long total = consultaRepository.count();
        
        return results.stream()
                .map(row -> PreguntaFrecuenteDTO.builder()
                        .pregunta((String) row[0]) // pregunta representativa
                        .cantidad((Long) row[1])    // cantidad de consultas en el cluster
                        .porcentaje(total > 0 ? ((Long) row[1] * 100.0) / total : 0.0)
                        .build())
                .collect(Collectors.toList());
    }
    
    /**
     * Preguntas frecuentes por categoría
     */
    public Map<String, List<PreguntaFrecuenteDTO>> obtenerPreguntasPorCategoria() {
        List<Object[]> results = consultaRepository.findPreguntasPorCategoria();
        
        Map<String, List<PreguntaFrecuenteDTO>> porCategoria = new HashMap<>();
        
        for (Object[] row : results) {
            String categoria = (String) row[0];
            String pregunta = (String) row[1];
            Long cantidad = (Long) row[2];
            
            PreguntaFrecuenteDTO dto = PreguntaFrecuenteDTO.builder()
                    .pregunta(pregunta)
                    .cantidad(cantidad)
                    .build();
            
            porCategoria.computeIfAbsent(categoria, k -> new ArrayList<>()).add(dto);
        }
        
        return porCategoria;
    }
    
    /**
     * Tendencias diarias (últimos 30 días)
     */
    public List<TendenciaDiariaDTO> obtenerTendenciasDiarias() {
        LocalDateTime hace30Dias = LocalDateTime.now().minusDays(30);
        List<Object[]> results = consultaRepository.findTendenciasDiarias(hace30Dias);
        
        return results.stream()
                .map(row -> TendenciaDiariaDTO.builder()
                        .fecha(row[0].toString())
                        .cantidad((Long) row[1])
                        .build())
                .collect(Collectors.toList());
    }
    
    /**
     * Últimas consultas
     */
    public List<ConsultaChatbotDTO> obtenerUltimasConsultas() {
        List<ConsultaChatbot> consultas = consultaRepository.findTop20ByOrderByFechaDesc();
        
        return consultas.stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }
    
    /**
     * Buscar consultas por rango de fechas
     */
    public List<ConsultaChatbotDTO> buscarPorFecha(LocalDateTime inicio, LocalDateTime fin) {
        List<ConsultaChatbot> consultas = consultaRepository.findByFechaBetween(inicio, fin);
        
        return consultas.stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }
    
    // Convertir entidad a DTO
    private ConsultaChatbotDTO convertirADTO(ConsultaChatbot consulta) {
        return ConsultaChatbotDTO.builder()
                .id(consulta.getId().toString())
                .pregunta(consulta.getPregunta())
                .respuesta(consulta.getRespuesta())
                .fecha(consulta.getFecha())
                .tiempoRespuestaMs(consulta.getTiempoRespuestaMs())
                .tipoUsuario(consulta.getTipoUsuario())
                .nombreSocio(consulta.getSocio() != null ? 
                    consulta.getSocio().getNombre() + " " + consulta.getSocio().getApellido() : 
                    null)
                .build();
    }
}
