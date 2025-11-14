package com.clubNautico.config;

import com.clubNautico.repository.AdminRepository;
import com.clubNautico.repository.SocioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@RequiredArgsConstructor
public class ApplicationConfig {

    private final AdminRepository adminRepository;
    private final SocioRepository socioRepository;

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService());

        authProvider.setPasswordEncoder(passwordEncoder());

        return authProvider;
    }


    @Bean
    public UserDetailsService userDetailsService() {
        return username -> {
            // 1. Buscar en Admins
            var admin = adminRepository.findByUsername(username);
            if (admin.isPresent()) {
                return admin.get(); // Devuelve el Admin (que es un UserDetails)
            }

            // 2. Si no es Admin, buscar en Socios
            var socio = socioRepository.findByUsername(username);
            if (socio.isPresent()) {
                return socio.get(); // Devuelve el Socio (que es un UserDetails)
            }

            // 3. Si no se encontró en ningún lado
            throw new UsernameNotFoundException("Usuario no encontrado: " + username);
        };
    }
}