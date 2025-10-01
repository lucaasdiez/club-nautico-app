import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/socios")
@CrossOrigin(origins = "*")
public class SocioController {

    private final SocioService socioService;

    public SocioController(SocioService socioService) {
        this.socioService = socioService;
    }

    @PostMapping
    public ResponseEntity<?> crearSocio(@RequestBody Socio socio) {
        try {
            Socio nuevo = socioService.createSocio(socio);
            return ResponseEntity.ok(nuevo);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping
    public List<Socio> listarSocios() {
        return socioService.getAllSocios();
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarSocio(@PathVariable Long id, @RequestBody Socio socio) {
        try {
            Socio actualizado = socioService.updateSocio(id, socio);
            return ResponseEntity.ok(actualizado);
        } catch (RuntimeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarSocio(@PathVariable Long id) {
        socioService.deleteSocio(id);
        return ResponseEntity.ok("Socio eliminado correctamente");
    }
}
