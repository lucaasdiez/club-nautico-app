package com.clubNautico.service.socio;

import com.clubNautico.model.Socio;
import com.clubNautico.repository.SocioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SocioServiceImpl implements SocioService {

    private final SocioRepository socioRepository;

    public SocioServiceImpl(SocioRepository socioRepository) {
        this.socioRepository = socioRepository;
    }

    @Override
    public List<Socio> getAllSocios() {
        return socioRepository.findAll();
    }

    @Override
    public Socio createSocio(Socio socio) {
        return socioRepository.save(socio);
    }

    @Override
    public Socio updateSocio(Long id, Socio socio) {
        return socioRepository.findById(id).map(s -> {
            s.setNombre(socio.getNombre());
            s.setApellido(socio.getApellido());
            s.setDni(socio.getDni());
            s.setEmail(socio.getEmail());
            s.setTelefono(socio.getTelefono());
            s.setDireccion(socio.getDireccion());
            s.setFechaNacimiento(socio.getFechaNacimiento());
            s.setFechaAlta(socio.getFechaAlta());
            s.setCuotaAlDia(socio.isCuotaAlDia());
            return socioRepository.save(s);
        }).orElseThrow(() -> new RuntimeException("Socio no encontrado con id " + id));
    }

    @Override
    public void deleteSocio(Long id) {
        socioRepository.deleteById(id);
    }
}
