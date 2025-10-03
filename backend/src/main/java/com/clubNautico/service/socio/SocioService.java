package com.clubNautico.service.socio;

import java.util.List;
import java.util.UUID;

import com.clubNautico.dto.SocioConEstadoDTO;
import com.clubNautico.dto.SocioDTO;
import com.clubNautico.enums.EstadoCuota;
import com.clubNautico.model.Socio;

public interface SocioService {
    Socio buscarSocioPorNumero(Long nroSocio);
    List<Socio> getSociosPorCuota(EstadoCuota estadoCuota);
    Socio actualizarSocio(Long nroSocio, SocioDTO socio);
    SocioDTO convertirADTO(Socio socio);
    List<SocioDTO> convertirADTOS(List<Socio> socios);
    Socio createSocio(SocioDTO socio);
    List<Socio> getAllSocios();
    Socio updateSocio(UUID id, Socio socio);
    void deleteSocio(UUID id);
}