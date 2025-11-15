package com.clubNautico.util; // O com.clubNautico.config

import com.clubNautico.model.Admin;
import com.clubNautico.repository.AdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class AdminInitializer implements CommandLineRunner {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;


    @Override
    public void run(String... args) throws Exception {

        if (adminRepository.count() == 0) {

            System.out.println("No se encontró Admin. Creando usuario Admin por defecto...");

            Admin admin = Admin.builder()
                    .username("admin") // <-- Este será tu usuario
                    .password(passwordEncoder.encode("admin123")) // <-- Esta será tu pass
                    .build();

            // 3. Guardamos el nuevo Admin en la base de datos
            adminRepository.save(admin);

            System.out.println("Usuario Admin 'admin' creado con contraseña 'admin123'");
        } else {
            System.out.println("Usuario Admin ya existe. No se crea uno nuevo.");
        }
    }
}