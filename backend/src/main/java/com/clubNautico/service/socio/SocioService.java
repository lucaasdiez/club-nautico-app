package com.clubNautico.service.socio;

import java.util.List;
import java.util.UUID;

import com.clubNautico.dto.SocioConEstadoDTO;
import com.clubNautico.model.Socio;

public interface SocioService {
    
    // CRUD básico
    Socio createSocio(Socio socio);
    List<Socio> getAllSocios();
    Socio updateSocio(UUID id, Socio socio);
    void deleteSocio(UUID id);
    
    // Búsqueda
    List<Socio> buscarSocios(String query);
    
    // Socios con estado de cuota
    List<SocioConEstadoDTO> getSociosConEstadoCuota();
    List<SocioConEstadoDTO> getSociosPorEstadoCuota(String estado);
    List<SocioConEstadoDTO> buscarSociosConEstado(String query);
}