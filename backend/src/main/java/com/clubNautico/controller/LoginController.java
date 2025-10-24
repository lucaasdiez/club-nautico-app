package com.clubNautico.controller;

import com.clubNautico.dto.LoginRequest;
import com.clubNautico.dto.LoginResponse;
import com.clubNautico.model.Admin;
import com.clubNautico.model.Socio;
import com.clubNautico.repository.AdminRepository;
import com.clubNautico.repository.SocioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/login")
@CrossOrigin(origins = "*")
public class LoginController {

    private final SocioRepository socioRepository;
    private final AdminRepository adminRepository;

    @PostMapping
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        String username = loginRequest.getUsername();
        String password = loginRequest.getPassword();

        // 1️⃣ Buscar si es admin
        Optional<Admin> adminOpt = adminRepository.findByUsername(username);
        if (adminOpt.isPresent()) {
            Admin admin = adminOpt.get();
            if (admin.getPassword().equals(password)) {
                return ResponseEntity.ok(new LoginResponse("admin", "Login exitoso"));
            } else {
                return ResponseEntity.badRequest().body("Contraseña incorrecta.");
            }
        }

        // 2️⃣ Buscar si es socio
        Optional<Socio> socioOpt = socioRepository.findByUsername(username);
        if (socioOpt.isPresent()) {
            Socio socio = socioOpt.get();
            if (socio.getPassword().equals(password)) {
                return ResponseEntity.ok(new LoginResponse("socio", "Login exitoso"));
            } else {
                return ResponseEntity.badRequest().body("Contraseña incorrecta.");
            }
        }

        // 3️⃣ Si no existe en ninguna tabla
        return ResponseEntity.badRequest().body("El usuario no existe.");
    }
}
