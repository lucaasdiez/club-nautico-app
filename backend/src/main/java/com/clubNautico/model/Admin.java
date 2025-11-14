package com.clubNautico.model;

import jakarta.persistence.DiscriminatorValue;
import jakarta.persistence.Entity;
import lombok.*;
import lombok.experimental.SuperBuilder;

// --- Imports de Spring Security (NUEVOS) ---
import org.springframework.security.core.GrantedAuthority;
import java.util.Collection;
import java.util.List;
// --- Fin Imports de Spring Security ---

@Getter
@Setter
@NoArgsConstructor
@SuperBuilder
@Entity
@DiscriminatorValue("ADMIN")
public class Admin extends Usuario {

    // --- IMPLEMENTACIÓN DE ROL (UserDetails) ---
    // Agregamos el método que nos obliga la clase padre "Usuario"
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Le decimos a Spring que este usuario tiene el rol "ADMIN"
        return List.of(() -> "ROLE_ADMIN");
    }
}