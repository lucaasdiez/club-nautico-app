package com.clubNautico.service.socio;

import com.clubNautico.model.Socio;
import java.util.List;
import java.util.UUID;

public interface SocioService {
    Socio createSocio(Socio socio);
    List<Socio> getAllSocios();
    Socio updateSocio(UUID id, Socio socio);
    void deleteSocio(UUID id);
}