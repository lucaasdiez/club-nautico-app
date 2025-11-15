package com.clubNautico.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

// --- Imports de Spring Security (NUEVOS) ---
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
// --- Fin Imports de Spring Security ---

import java.util.UUID;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Entity
@Inheritance(strategy = InheritanceType.JOINED)

public abstract class Usuario implements UserDetails {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(nullable = false, length = 100)
    @NotBlank(message = "La contraseña es obligatoria.")
    @Size(max = 100, message = "La contraseña no puede superar los 100 caracteres.")
    private String password;
    // (UserDetails usa este campo llamando a getPassword(), que Lombok ya crea)

    @Column(nullable = false, unique = true, length = 50)
    @NotBlank(message = "El nombre de usuario es obligatorio.")
    @Size(max = 50, message = "El nombre de usuario no puede superar los 50 caracteres.")
    private String username;



    @Override
    public abstract Collection<? extends GrantedAuthority> getAuthorities();


    @Override
    public boolean isAccountNonExpired() {
        return true; // La cuenta nunca expira
    }

    @Override
    public boolean isAccountNonLocked() {
        return true; // La cuenta nunca se bloquea
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true; // Las credenciales nunca expiran
    }

    @Override
    public boolean isEnabled() {
        return true; // La cuenta está habilitada
    }
}