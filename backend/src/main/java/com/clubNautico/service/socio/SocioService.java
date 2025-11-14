package com.clubNautico.service.socio;

import java.util.List;
import java.util.UUID;

import com.clubNautico.dto.SocioDTO;
import com.clubNautico.enums.EstadoCuota;
import com.clubNautico.model.Socio;

public interface SocioService {
    Socio buscarSocioPorNumero(String nroSocio);
    List<Socio> getSociosPorCuota(EstadoCuota estadoCuota);
    Socio actualizarSocio(String nroSocio, SocioDTO socio);
    SocioDTO convertirADTO(Socio socio);
    List<SocioDTO> convertirADTOS(List<Socio> socios);
    Socio createSocio(SocioDTO socio);
    List<Socio> getAllSocios();
    void deleteSocio(String numeroSocio);
    Socio findByUsername(String username);
}