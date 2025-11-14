package com.clubNautico.filter;

import com.clubNautico.service.jwt.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component // Le dice a Spring que esto es un componente manejado por él
@RequiredArgsConstructor // Crea el constructor para las variables 'final'
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService; // El Bean que creamos en ApplicationConfig

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {

        // 1. Extraer el "header" de Autorización
        final String authHeader = request.getHeader("Authorization");

        // 2. Validar que el header exista y tenga el formato "Bearer [token]"
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response); // Si no hay token, seguir al siguiente filtro
            return;
        }

        // 3. Extraer el token (sin la palabra "Bearer ")
        final String jwt = authHeader.substring(7);

        // 4. Extraer el username del token usando nuestro JwtService
        final String username = jwtService.extractUsername(jwt);

        // 5. Validar el token
        // Si hay username Y el usuario no está ya autenticado en el contexto de seguridad
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {

            // Cargamos al usuario (Admin o Socio) desde la BD
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);

            // Validamos que el token sea correcto (firma y expiración)
            if (jwtService.isTokenValid(jwt, userDetails)) {

                // 6. Si el token es válido, "oficializamos" la autenticación
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null, // No se usan credenciales (password) en la autenticación por token
                        userDetails.getAuthorities() // Los roles (ROLE_ADMIN, ROLE_SOCIO)
                );
                authToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                // 7. Guardamos al usuario en el Contexto de Seguridad
                // ¡El usuario está autenticado!
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        }

        // 8. Pasamos la posta al siguiente filtro
        filterChain.doFilter(request, response);
    }
}