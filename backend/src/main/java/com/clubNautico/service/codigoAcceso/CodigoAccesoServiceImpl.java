package com.clubNautico.service.codigoAcceso;

import com.clubNautico.dto.CodigoAcceso.CodigoAccesoResponseDTO;
import com.clubNautico.dto.CodigoAcceso.ValidarCodigoResponse;
import com.clubNautico.enums.EstadoCodigo;
import com.clubNautico.model.CodigoAcceso;
import com.clubNautico.model.Socio;
import com.clubNautico.repository.CodigoAccesoRepository;
import com.clubNautico.repository.SocioRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Base64;

@Service
@RequiredArgsConstructor
public class CodigoAccesoServiceImpl implements CodigoAccesoService{
    private final CodigoAccesoRepository codigoAccesoRepository;
    private final SocioRepository socioRepository;
    private final SecureRandom secureRandom = new SecureRandom();

    private static final Duration TTL = Duration.ofHours(24);

    private String generarToken(){
        byte[] token = new byte[9];
        secureRandom.nextBytes(token);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(token);
    }


    @Override
    @Transactional
    public CodigoAcceso generarCodigoParaSocio(String nroSocio) {
        Socio socio = socioRepository.findByNroSocio(nroSocio)
                .orElseThrow(() -> new RuntimeException("Socio no encontrado"));

        codigoAccesoRepository.revocarCodigosActivos(socio.getId());

        String token = generarToken();
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime expiration = now.plus(TTL);

        CodigoAcceso codigoAcceso = CodigoAcceso.builder()
                .socio(socio)
                .token(token)
                .expiraEn(expiration)
                .estadoCodigo(EstadoCodigo.VALIDO)
                .build();
        return codigoAccesoRepository.save(codigoAcceso);

    }

    @Override
    public ValidarCodigoResponse validarCodigo(String token) {
        CodigoAcceso codigoAcceso = codigoAccesoRepository.findByToken(token)
                .orElseThrow(() -> new RuntimeException("Código no encontrado"));

        if (codigoAcceso.getExpiraEn().isBefore(LocalDateTime.now())) {
            codigoAcceso.setEstadoCodigo(EstadoCodigo.EXPIRADO);
            codigoAccesoRepository.save(codigoAcceso);

            return new ValidarCodigoResponse(
                    false,
                    "Código expirado",
                    null,
                    null,
                    codigoAcceso.getExpiraEn()
            );
        }


        if (codigoAcceso.getEstadoCodigo() != EstadoCodigo.VALIDO) {
            return new ValidarCodigoResponse(
                    false,
                    "El código ya fue usado o revocado",
                    null,
                    null,
                    codigoAcceso.getExpiraEn()
            );
        }

        Socio socio = codigoAcceso.getSocio();


        if (!socio.getActivo()) {
            return new ValidarCodigoResponse(
                    false,
                    "Socio inactivo",
                    socio.getNroSocio(),
                    socio.getNombre() + " " + socio.getApellido(),
                    codigoAcceso.getExpiraEn()
            );
        }

        LocalDate hoy = LocalDate.now();
        LocalDate vencimiento = socio.getFechaVencimiento();

        if (vencimiento.isBefore(hoy)) {
            return new ValidarCodigoResponse(
                    false,
                    "Socio con cuota vencida",
                    socio.getNroSocio(),
                    socio.getNombre() + " " + socio.getApellido(),
                    codigoAcceso.getExpiraEn()
            );
        }

        if (!vencimiento.isBefore(hoy) && vencimiento.minusDays(5).isBefore(hoy)) {
            return new ValidarCodigoResponse(
                    true,
                    "Acceso permitido - cuota próxima a vencer",
                    socio.getNroSocio(),
                    socio.getNombre() + " " + socio.getApellido(),
                    codigoAcceso.getExpiraEn()
            );
        }

        codigoAcceso.setEstadoCodigo(EstadoCodigo.USADO);
        codigoAccesoRepository.save(codigoAcceso);

        return new ValidarCodigoResponse(
                true,
                "Acceso concedido",
                socio.getNroSocio(),
                socio.getNombre() + " " + socio.getApellido(),
                codigoAcceso.getExpiraEn()
        );
    }



    @Override
    public CodigoAccesoResponseDTO convertirADto(CodigoAcceso codigoAcceso) {
        return CodigoAccesoResponseDTO.builder()
                .expiraEn(codigoAcceso.getExpiraEn())
                .token(codigoAcceso.getToken())
                .build();
    }
}
