package com.clubNautico.config;

import com.clubNautico.filter.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod; // <-- IMPORTANTE
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider;

    // (AQUÍ ES DONDE ESTÁ EL CAMBIO PRINCIPAL)
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // 1. Le decimos que use nuestra configuración de CORS (ver @Bean abajo)
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                .csrf(AbstractHttpConfigurer::disable)

                // 2. Definimos qué rutas son públicas
                .authorizeHttpRequests(authorize -> authorize
                        // 3. ¡NUEVO! Permitimos TODAS las peticiones de "comprobación" (OPTIONS)
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        .requestMatchers("/api/login", "/api/socios/crear").permitAll() // Login y Registro
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll() // Swagger
                        .requestMatchers("/archivos/archivo/descargar/**").permitAll()

                        // 4. Todas las demás rutas deben estar autenticadas
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )
                .authenticationProvider(authenticationProvider)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // 4. Esta es tu configuración de CORS (la dejamos como estaba)
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}