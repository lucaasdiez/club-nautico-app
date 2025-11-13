package com.clubNautico.controller;

import com.clubNautico.dto.chatbot.*;
import com.clubNautico.model.ConsultaChatbot;
import com.clubNautico.response.ApiResponse;
import com.clubNautico.service.chatbot.ChatbotAnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/chatbot")
@CrossOrigin(origins = "*")
public class ChatbotAnalyticsController {
    
    private final ChatbotAnalyticsService chatbotService;
    
    /**
     * Endpoint para que n8n registre cada consulta
     * POST /api/chatbot/registrar
     */
    @PostMapping("/registrar")
    public ResponseEntity<ApiResponse> registrarConsulta(@RequestBody RegistrarConsultaDTO dto) {
        ConsultaChatbot consulta = chatbotService.registrarConsulta(dto);
        return ResponseEntity.ok(new ApiResponse("Consulta registrada exitosamente", consulta.getId()));
    }
    
    /**
     * Dashboard: Estadísticas generales
     * GET /api/chatbot/estadisticas
     */
    @GetMapping("/estadisticas")
    public ResponseEntity<ApiResponse> obtenerEstadisticas() {
        EstadisticasChatbotDTO stats = chatbotService.obtenerEstadisticas();
        return ResponseEntity.ok(new ApiResponse("Estadísticas del chatbot", stats));
    }
    
    /**
     * Dashboard: Top 10 preguntas más frecuentes (AGRUPADAS POR IA)
     * GET /api/chatbot/preguntas-frecuentes
     */
    @GetMapping("/preguntas-frecuentes")
    public ResponseEntity<ApiResponse> obtenerPreguntasFrecuentes() {
        List<PreguntaFrecuenteDTO> preguntas = chatbotService.obtenerPreguntasFrecuentes();
        return ResponseEntity.ok(new ApiResponse("Preguntas más frecuentes (agrupadas por similitud)", preguntas));
    }
    
    /**
     * Dashboard: Preguntas agrupadas por categoría
     * GET /api/chatbot/preguntas-por-categoria
     */
    @GetMapping("/preguntas-por-categoria")
    public ResponseEntity<ApiResponse> obtenerPreguntasPorCategoria() {
        Map<String, List<PreguntaFrecuenteDTO>> categorias = chatbotService.obtenerPreguntasPorCategoria();
        return ResponseEntity.ok(new ApiResponse("Preguntas agrupadas por categoría", categorias));
    }
    
    /**
     * Dashboard: Tendencias diarias (últimos 30 días)
     * GET /api/chatbot/tendencias
     */
    @GetMapping("/tendencias")
    public ResponseEntity<ApiResponse> obtenerTendencias() {
        List<TendenciaDiariaDTO> tendencias = chatbotService.obtenerTendenciasDiarias();
        return ResponseEntity.ok(new ApiResponse("Tendencias diarias", tendencias));
    }
    
    /**
     * Dashboard: Últimas 20 consultas
     * GET /api/chatbot/ultimas-consultas
     */
    @GetMapping("/ultimas-consultas")
    public ResponseEntity<ApiResponse> obtenerUltimasConsultas() {
        List<ConsultaChatbotDTO> consultas = chatbotService.obtenerUltimasConsultas();
        return ResponseEntity.ok(new ApiResponse("Últimas consultas", consultas));
    }
    
    /**
     * Dashboard: Buscar por rango de fechas
     * GET /api/chatbot/buscar?inicio=2025-01-01T00:00:00&fin=2025-01-31T23:59:59
     */
    @GetMapping("/buscar")
    public ResponseEntity<ApiResponse> buscarPorFecha(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin
    ) {
        List<ConsultaChatbotDTO> consultas = chatbotService.buscarPorFecha(inicio, fin);
        return ResponseEntity.ok(new ApiResponse("Consultas encontradas", consultas));
    }
}
