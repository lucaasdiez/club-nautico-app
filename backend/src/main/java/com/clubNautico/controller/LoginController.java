package com.clubNautico.controller;

import com.clubNautico.dto.LoginRequest;
import com.clubNautico.dto.LoginResponse;
import com.clubNautico.model.Admin;
import com.clubNautico.model.Socio;
import com.clubNautico.repository.AdminRepository;
import com.clubNautico.repository.SocioRepository;
import com.clubNautico.service.jwt.JwtService; // <-- IMPORTAR
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/login")
@CrossOrigin(origins = "*")
public class LoginController {

    private final SocioRepository socioRepository;
    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    @PostMapping
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();

        Optional<Admin> adminOpt = adminRepository.findByUsername(username);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            if (passwordEncoder.matches(password, admin.getPassword())) {

                String token = jwtService.generateToken(admin); // admin es un UserDetails

                return ResponseEntity.ok(new LoginResponse("admin", "Login exitoso", token));
            } else {
                return ResponseEntity.badRequest().body("Contraseña incorrecta.");
            }
        }

        Optional<Socio> socioOpt = socioRepository.findByUsername(username);
        if (socioOpt.isPresent()) {
            Socio socio = socioOpt.get();
            if (passwordEncoder.matches(password, socio.getPassword())) {

                String token = jwtService.generateToken(socio);

                return ResponseEntity.ok(new LoginResponse("socio", "Login exitoso", token));
            } else {
                return ResponseEntity.badRequest().body("Contraseña incorrecta.");
            }
        }

        return ResponseEntity.badRequest().body("El usuario no existe.");
    }
}