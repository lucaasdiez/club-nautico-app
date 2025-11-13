package com.clubNautico.config;

import com.clubNautico.filter.JwtAuthenticationFilter; // <-- IMPORTAR
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider; // <-- IMPORTAR
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy; // <-- IMPORTAR
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter; // <-- IMPORTAR

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor // Inyecta las dependencias finales
public class SecurityConfig {

    // 1. Inyectamos nuestro nuevo Filtro y Proveedor
    private final JwtAuthenticationFilter jwtAuthFilter;
    private final AuthenticationProvider authenticationProvider; // El Bean de ApplicationConfig



    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .csrf(AbstractHttpConfigurer::disable) // Deshabilitamos CSRF

                // 2. Definimos qué rutas son públicas (no necesitan token)
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/api/login", "/api/socios/crear").permitAll() // Login y Registro
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll() // Swagger

                        // 3. Todas las demás rutas deben estar autenticadas
                        .anyRequest().authenticated()
                )

                // 4. ¡MUY IMPORTANTE! Le decimos a Spring que no guarde "sesiones"
                // Ahora usamos JWT (sin estado), no sesiones (con estado)
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
                )

                // 5. Le decimos a Spring que use nuestro "Cerebro"
                .authenticationProvider(authenticationProvider)

                // 6. Le decimos a Spring que use nuestro "Guardia"
                // (y que lo ponga ANTES del filtro de login estándar)
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}