import java.util.List;

public interface SocioService {
    Socio createSocio(Socio socio);
    List<Socio> getAllSocios();
    Socio updateSocio(Long id, Socio socio);
    void deleteSocio(Long id);
}
