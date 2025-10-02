package com.clubNautico.service.socio;

import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.clubNautico.model.Socio;
import com.clubNautico.repository.SocioRepository;

@Service
public class SocioServiceImpl implements SocioService {

    private final SocioRepository socioRepository;

    public SocioServiceImpl(SocioRepository socioRepository) {
        this.socioRepository = socioRepository;
    }

    @Override
    public Socio createSocio(Socio socio) {
        // Validar duplicados
        if (socioRepository.findByDni(socio.getDni()).isPresent()) {
            throw new RuntimeException("El DNI ya está registrado en el sistema.");
        }

        if (socioRepository.findByEmail(socio.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya está registrado en el sistema.");
        }

        return socioRepository.save(socio);
    }

    @Override
    public List<Socio> getAllSocios() {
        return socioRepository.findAll();
    }

    @Override
    public Socio updateSocio(UUID id, Socio socio) {
        Socio existente = socioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Socio no encontrado"));

        existente.setNombre(socio.getNombre());
        existente.setApellido(socio.getApellido());
        existente.setDni(socio.getDni());
        existente.setEmail(socio.getEmail());
        existente.setTelefono(socio.getTelefono());
        existente.setActivo(socio.getActivo());
        existente.setCategoriaId(socio.getCategoriaId());

        return socioRepository.save(existente);
    }

    @Override
    public void deleteSocio(UUID id) {
        socioRepository.deleteById(id);
    }
}