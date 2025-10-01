import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SocioRepository extends JpaRepository<Socio, Long> {
    Optional<Socio> findByDni(String dni);
    Optional<Socio> findByEmail(String email);
}
