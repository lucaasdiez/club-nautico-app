package com.clubNautico.service.socio;

import com.clubNautico.model.Socio;
import java.util.List;

public interface SocioService {
    List<Socio> getAllSocios();
    Socio createSocio(Socio socio);
    Socio updateSocio(Long id, Socio socio);
    void deleteSocio(Long id);
}
