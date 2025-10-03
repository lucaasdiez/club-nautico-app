package com.clubNautico.service.socio;


import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;
import java.util.stream.Collectors;

import com.clubNautico.dto.SocioDTO;
import com.clubNautico.enums.EstadoCuota;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.clubNautico.model.Socio;
import com.clubNautico.repository.SocioRepository;

@Service
@RequiredArgsConstructor
public class SocioServiceImpl implements SocioService {

    private final SocioRepository socioRepository;
    private final ModelMapper modelMapper;


    @Override
    public Socio buscarSocioPorNumero(Long nroSocio) {
        return socioRepository.findByNroSocio(nroSocio)
                .orElseThrow(()-> new NoSuchElementException("El usuario no existe"));
    }

    @Override
    public List<Socio> getSociosPorCuota(EstadoCuota estadoCuota) {
        return socioRepository.findAllByEstadoCuota(estadoCuota);
    }

    @Override
    public Socio actualizarSocio(Long nroSocio, SocioDTO socio) {
        return socioRepository.findByNroSocio(nroSocio)
                .map(socioExistente -> updateSocioExistente(socioExistente, socio))
                .map(socioRepository :: save)
                .orElseThrow(() -> new NoSuchElementException("Socio no encontrado"));
    }

    @Override
    public Socio createSocio(SocioDTO socio) {
        if (socioRepository.findByDni(socio.getDni()).isPresent()) {
            throw new RuntimeException("El DNI ya está registrado en el sistema.");
        }
        if (socioRepository.findByEmail(socio.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya está registrado en el sistema.");
        }
        if(socioRepository.findByNroSocio(socio.getNroSocio()).isPresent()) {
            throw new RuntimeException("El numero de socio ya está registrado en el sistema.");
        }

        Socio socioNuevo = Socio.builder()
                .username(socio.getUsername())
                .password(socio.getPassword())
                .dni(socio.getDni())
                .nombre(socio.getNombre())
                .email(socio.getEmail())
                .activo(socio.getActivo())
                .fechaAlta(socio.getFechaAlta())
                .telefono(socio.getTelefono())
                .nroSocio(socio.getNroSocio())
                .build();
        return socioRepository.save(socioNuevo);
    }

    @Override
    public List<Socio> getAllSocios() {
        return socioRepository.findAll();
    }


    @Override
    public void deleteSocio(UUID id) {
        socioRepository.deleteById(id);
    }

    private Socio updateSocioExistente(Socio socioExistente, SocioDTO socio) {
        socioExistente.setNombre(socio.getNombre());
        socioExistente.setApellido(socio.getApellido());
        socioExistente.setDni(socio.getDni());
        socioExistente.setEmail(socio.getEmail());
        socioExistente.setTelefono(socio.getTelefono());
        socioExistente.setActivo(socio.getActivo());
        socioExistente.setUsername(socio.getUsername());
        return socioExistente;
    }

    @Override
    public SocioDTO convertirADTO(Socio socio) {
        return modelMapper.map(socio, SocioDTO.class);
    }

    @Override
    public List<SocioDTO> convertirADTOS(List<Socio> socios) {
        return socios.stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

}