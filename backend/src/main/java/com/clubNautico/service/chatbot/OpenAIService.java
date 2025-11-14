package com.clubNautico.service.chatbot;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class OpenAIService {
    
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    
    @Value("${OPENAI_API_KEY}")
    private String apiKey;
    
    @Value("${openai.embedding.model:text-embedding-3-small}")
    private String embeddingModel;
    
    private static final String OPENAI_API_URL = "https://api.openai.com/v1/embeddings";
    
    public OpenAIService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }
    
    /**
     * Generar embedding para una pregunta usando la API de OpenAI
     * @param texto La pregunta a convertir en embedding
     * @return Array de doubles representando el vector
     */
    public List<Double> generarEmbedding(String texto) {
        try {
            log.debug("Generando embedding para: {}", texto);
            
            // Construir el request body
            Map<String, Object> requestBody = Map.of(
                "model", embeddingModel,
                "input", texto
            );
            
            // Configurar headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);
            
            // Crear la petición
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(requestBody, headers);
            
            // Hacer la llamada a OpenAI
            ResponseEntity<String> response = restTemplate.exchange(
                OPENAI_API_URL,
                HttpMethod.POST,
                request,
                String.class
            );
            
            // Parsear la respuesta
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                JsonNode embeddingNode = root.path("data").get(0).path("embedding");
                
                List<Double> embedding = new ArrayList<>();
                embeddingNode.forEach(node -> embedding.add(node.asDouble()));
                
                log.debug("Embedding generado exitosamente con {} dimensiones", embedding.size());
                return embedding;
            } else {
                log.error("Error en respuesta de OpenAI: {}", response.getStatusCode());
                return null;
            }
            
        } catch (Exception e) {
            log.error("Error generando embedding: {}", e.getMessage(), e);
            return null;
        }
    }
    
    /**
     * Serializar embedding a JSON string para guardarlo en DB
     */
    public String serializarEmbedding(List<Double> embedding) {
        try {
            return objectMapper.writeValueAsString(embedding);
        } catch (JsonProcessingException e) {
            log.error("Error serializando embedding", e);
            return null;
        }
    }
    
    /**
     * Deserializar embedding desde JSON string
     */
    public List<Double> deserializarEmbedding(String embeddingJson) {
        try {
            return objectMapper.readValue(embeddingJson, new TypeReference<List<Double>>() {});
        } catch (JsonProcessingException e) {
            log.error("Error deserializando embedding", e);
            return null;
        }
    }
    
    /**
     * Calcular similitud coseno entre dos embeddings
     * Retorna un valor entre 0 (totalmente diferentes) y 1 (idénticos)
     */
    public double calcularSimilitudCoseno(List<Double> embedding1, List<Double> embedding2) {
        if (embedding1 == null || embedding2 == null || 
            embedding1.size() != embedding2.size()) {
            return 0.0;
        }
        
        double dotProduct = 0.0;
        double norm1 = 0.0;
        double norm2 = 0.0;
        
        for (int i = 0; i < embedding1.size(); i++) {
            dotProduct += embedding1.get(i) * embedding2.get(i);
            norm1 += Math.pow(embedding1.get(i), 2);
            norm2 += Math.pow(embedding2.get(i), 2);
        }
        
        if (norm1 == 0 || norm2 == 0) {
            return 0.0;
        }
        
        return dotProduct / (Math.sqrt(norm1) * Math.sqrt(norm2));
    }
    
    /**
     * Categorizar automáticamente una pregunta usando keywords
     */
    public String categorizarPregunta(String pregunta) {
        try {
            String preguntaLower = pregunta.toLowerCase();
            
            // Categorización por keywords
            if (preguntaLower.contains("inscri") || preguntaLower.contains("registr")) {
                return "INSCRIPCIONES";
            } else if (preguntaLower.contains("pag") || preguntaLower.contains("abonar") || 
                       preguntaLower.contains("cobr")) {
                return "PAGOS";
            } else if (preguntaLower.contains("disciplina") || preguntaLower.contains("deporte") || 
                       preguntaLower.contains("natación") || preguntaLower.contains("yoga") ||
                       preguntaLower.contains("actividad")) {
                return "DISCIPLINAS";
            } else if (preguntaLower.contains("horario") || preguntaLower.contains("hora") ||
                       preguntaLower.contains("cuando")) {
                return "HORARIOS";
            } else if (preguntaLower.contains("acceso") || preguntaLower.contains("entrar") || 
                       preguntaLower.contains("qr") || preguntaLower.contains("código") ||
                       preguntaLower.contains("codigo")) {
                return "ACCESO";
            } else if (preguntaLower.contains("cuota") || preguntaLower.contains("vencimiento") ||
                       preguntaLower.contains("mensualidad")) {
                return "CUOTAS";
            } else {
                return "GENERAL";
            }
            
        } catch (Exception e) {
            log.error("Error categorizando pregunta", e);
            return "GENERAL";
        }
    }

    /**
     * Determinar si el texto es una pregunta real o solo un saludo/conversación
     * @param texto El texto a analizar
     * @return true si es una pregunta, false si es saludo/conversación
     */
    public boolean esPregunta(String texto) {
        try {
            String textoLower = texto.toLowerCase().trim();
            
            // Lista de saludos y frases que NO son preguntas
            String[] noPreguntas = {
                "hola", "holi", "buenas", "buenos dias", "buenas tardes", "buenas noches",
                "hey", "ola", "saludos", "buen dia",
                "gracias", "muchas gracias", "ok", "vale", "perfecto", "excelente",
                "adios", "adiós", "chau", "hasta luego", "nos vemos",
                "si", "sí", "no", "claro", "dale", "bien", "mal"
            };
            
            // Si es muy corto (menos de 3 palabras) y es un saludo, no es pregunta
            String[] palabras = textoLower.split("\\s+");
            if (palabras.length <= 3) {
                for (String noPreg : noPreguntas) {
                    if (textoLower.equals(noPreg) || textoLower.startsWith(noPreg + " ") || textoLower.endsWith(" " + noPreg)) {
                        log.info("Detectado NO-pregunta (saludo/conversación): {}", texto);
                        return false;
                    }
                }
            }
            
            // Palabras clave que indican que SÍ es una pregunta
            String[] palabrasClavePregunta = {
                "qué", "que", "cuál", "cual", "cuáles", "cuales", 
                "cómo", "como", "cuándo", "cuando", "cuánto", "cuanto",
                "dónde", "donde", "por qué", "porque", "para qué",
                "quién", "quien", "quiénes", "quienes",
                "puedo", "puedes", "puede", "podría", "podria",
                "hay", "existe", "tienen", "tiene", "tengo",
                "saber", "conocer", "informar", "decir", "explicar",
                "horario", "precio", "costo", "cuota", "inscri", "pagar"
            };
            
            // Si contiene alguna palabra clave de pregunta, es pregunta
            for (String palabra : palabrasClavePregunta) {
                if (textoLower.contains(palabra)) {
                    log.info("Detectado SÍ-pregunta (contiene '{}'): {}", palabra, texto);
                    return true;
                }
            }
            
            // Si termina con "?" es pregunta
            if (texto.trim().endsWith("?")) {
                log.info("Detectado SÍ-pregunta (tiene '?'): {}", texto);
                return true;
            }
            
            // Si tiene más de 5 palabras y no es un saludo obvio, asumimos que es pregunta
            if (palabras.length > 5) {
                log.info("Detectado SÍ-pregunta (mensaje largo): {}", texto);
                return true;
            }
            
            // Por defecto, si no detectamos nada, consideramos que NO es pregunta
            log.info("Detectado NO-pregunta (default): {}", texto);
            return false;
            
        } catch (Exception e) {
            log.error("Error detectando si es pregunta", e);
            return true; // En caso de error, guardamos por defecto
        }
    }
}