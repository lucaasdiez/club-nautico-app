import org.springframework.stereotype.Service;
import java.util.List;

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
    public Socio updateSocio(Long id, Socio socio) {
        Socio existente = socioRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Socio no encontrado"));

        existente.setNombre(socio.getNombre());
        existente.setApellido(socio.getApellido());
        existente.setDni(socio.getDni());
        existente.setEmail(socio.getEmail());
        existente.setTelefono(socio.getTelefono());
        existente.setDireccion(socio.getDireccion());

        return socioRepository.save(existente);
    }

    @Override
    public void deleteSocio(Long id) {
        socioRepository.deleteById(id);
    }
}
