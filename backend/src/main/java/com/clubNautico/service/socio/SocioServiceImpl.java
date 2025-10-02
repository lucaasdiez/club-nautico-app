package com.clubNautico.service.socio;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.clubNautico.dto.SocioConEstadoDTO;
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

    @Override
    public List<Socio> buscarSocios(String query) {
        if (query == null || query.trim().isEmpty()) {
            return socioRepository.findAll();
        }
        return socioRepository.buscarPorNombreApellidoODni(query.trim());
    }

    @Override
    public List<SocioConEstadoDTO> getSociosConEstadoCuota() {
        List<Object[]> resultados = socioRepository.findAllConEstadoCuota();
        return mapearResultadosADTO(resultados);
    }

    @Override
    public List<SocioConEstadoDTO> getSociosPorEstadoCuota(String estado) {
        List<Object[]> resultados = socioRepository.findByEstadoCuota(estado);
        return mapearResultadosADTO(resultados);
    }

    @Override
    public List<SocioConEstadoDTO> buscarSociosConEstado(String query) {
        List<Object[]> resultados = socioRepository.buscarConEstadoCuota(query);
        return mapearResultadosADTO(resultados);
    }

    // Método auxiliar para mapear Object[] a DTO
    private List<SocioConEstadoDTO> mapearResultadosADTO(List<Object[]> resultados) {
        return resultados.stream().map(row -> {
            SocioConEstadoDTO dto = new SocioConEstadoDTO();
            
            // Datos del socio
            dto.setId((UUID) row[0]);
            dto.setNroSocio(row[1] != null ? ((Number) row[1]).longValue() : null);
            dto.setDni((String) row[2]);
            dto.setNombre((String) row[3]);
            dto.setApellido((String) row[4]);
            dto.setEmail((String) row[5]);
            dto.setTelefono((String) row[6]);
            
            // Convertir fecha_alta
            if (row[7] != null) {
                if (row[7] instanceof Date) {
                    dto.setFechaAlta(((Date) row[7]).toLocalDate());
                } else if (row[7] instanceof LocalDate) {
                    dto.setFechaAlta((LocalDate) row[7]);
                }
            }
            
            dto.setActivo((Boolean) row[8]);
            
            // Datos del estado de cuota
            dto.setEstadoCuota((String) row[10]);
            dto.setMesesAdeudados(row[11] != null ? ((Number) row[11]).intValue() : 0);
            
            // Convertir ultimo_pagado
            if (row[12] != null) {
                if (row[12] instanceof Date) {
                    dto.setUltimoPagado(((Date) row[12]).toLocalDate());
                } else if (row[12] instanceof LocalDate) {
                    dto.setUltimoPagado((LocalDate) row[12]);
                }
            }
            
            return dto;
        }).collect(Collectors.toList());
    }
}