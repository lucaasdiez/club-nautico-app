package com.clubNautico.service.socio;

import java.sql.Date;
import java.time.LocalDate;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.UUID;
import java.util.stream.Collectors;

import com.clubNautico.dto.SocioDTO;
import com.clubNautico.enums.EstadoCuota;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder; // <-- Importar
import org.springframework.stereotype.Service;

import com.clubNautico.model.Socio;
import com.clubNautico.repository.SocioRepository;

@Service
@RequiredArgsConstructor
public class SocioServiceImpl implements SocioService {

    private final SocioRepository socioRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Socio buscarSocioPorNumero(String nroSocio) {
        return socioRepository.findByNroSocio(nroSocio)
                .orElseThrow(() -> new NoSuchElementException("El usuario no existe"));
    }

    @Override
    public List<Socio> getSociosPorCuota(EstadoCuota estadoCuota) {
        return socioRepository.findAllByEstadoCuota(estadoCuota);
    }

    @Override
    public Socio actualizarSocio(String nroSocio, SocioDTO socio) {
        return socioRepository.findByNroSocio(nroSocio)
                .map(socioExistente -> updateSocioExistente(socioExistente, socio))
                .map(socioRepository::save)
                .orElseThrow(() -> new NoSuchElementException("Socio no encontrado"));
    }

    @Override
    public Socio createSocio(SocioDTO socio) {
        // 🔹 Verificar que los campos obligatorios no vengan vacíos
        if (socio.getUsername() == null || socio.getUsername().isBlank()) {
            throw new RuntimeException("El nombre de usuario es obligatorio.");
        }
        if (socio.getEmail() == null || socio.getEmail().isBlank()) {
            throw new RuntimeException("El email es obligatorio.");
        }
        if (socio.getPassword() == null || socio.getPassword().isBlank()) {
            throw new RuntimeException("La contraseña es obligatoria.");
        }

        // 🔹 Validaciones de duplicados
        if (socioRepository.findByDni(socio.getDni()).isPresent()) {
            throw new RuntimeException("El DNI ya está registrado en el sistema.");
        }
        if (socioRepository.findByEmail(socio.getEmail()).isPresent()) {
            throw new RuntimeException("El email ya está registrado en el sistema.");
        }

        // 🔹 Generar número de socio incremental
        long count = socioRepository.count() + 1;
        String nroSocio = String.format("%08d", count);

        // 🔹 Fechas
        LocalDate fechaAlta = socio.getFechaAlta() != null ? socio.getFechaAlta() : LocalDate.now();
        LocalDate ultimoPagado = socio.getUltimoPagado() != null ? socio.getUltimoPagado() : LocalDate.now();
        LocalDate fechaVencimiento = ultimoPagado.plusMonths(1);
        EstadoCuota estadoInicial = calcularEstadoCuota(ultimoPagado);

        // 🔹 Crear y guardar el socio
        Socio socioNuevo = Socio.builder()
                .username(socio.getUsername())
                .password(passwordEncoder.encode(socio.getPassword()))
                .dni(socio.getDni())
                .nombre(socio.getNombre())
                .apellido(socio.getApellido())
                .email(socio.getEmail())
                .telefono(socio.getTelefono())
                .activo(true)
                .fechaAlta(fechaAlta)
                .ultimoPagado(ultimoPagado)
                .fechaVencimiento(fechaVencimiento)
                .estadoCuota(estadoInicial)
                .mesesAdeudados(0)
                .nroSocio(nroSocio)
                .build();

        return socioRepository.save(socioNuevo);
    }

    @Override
    public List<Socio> getAllSocios() {
        return socioRepository.findAll();
    }

    @Override
    public void deleteSocio(String numeroSocio) {
        Socio socio = socioRepository.findByNroSocio(numeroSocio)
                .orElseThrow(() -> new NoSuchElementException("El usuario no existe"));
        socio.setActivo(false);
        socioRepository.save(socio);
    }

    private Socio updateSocioExistente(Socio socioExistente, SocioDTO socio) {
        socioExistente.setNombre(socio.getNombre());
        socioExistente.setApellido(socio.getApellido());
        socioExistente.setDni(socio.getDni());
        socioExistente.setEmail(socio.getEmail());
        socioExistente.setTelefono(socio.getTelefono());
        socioExistente.setActivo(socio.getActivo());
        socioExistente.setUsername(socio.getUsername());
        return socioExistente;
    }

    @Override
    public SocioDTO convertirADTO(Socio socio) {
        return modelMapper.map(socio, SocioDTO.class);
    }

    @Override
    public List<SocioDTO> convertirADTOS(List<Socio> socios) {
        return socios.stream()
                .map(this::convertirADTO)
                .collect(Collectors.toList());
    }

    private EstadoCuota calcularEstadoCuota(LocalDate ultimoPagado) {
        LocalDate hoy = LocalDate.now();
        LocalDate vencimiento = ultimoPagado.plusMonths(1);
        if (vencimiento.isBefore(hoy)) {
            return EstadoCuota.VENCIDA;
        } else if (vencimiento.isEqual(hoy)) {
            return EstadoCuota.AL_DIA;
        } else if (vencimiento.minusDays(5).isBefore(hoy)) {
            return EstadoCuota.POR_VENCER;
        } else {
            return EstadoCuota.AL_DIA;
        }
    }

    public void actualizarEstadosCuotas() {
        List<Socio> socios = socioRepository.findAll();
        for (Socio socio : socios) {
            EstadoCuota nuevoEstado = calcularEstadoCuota(socio.getUltimoPagado());
            socio.setEstadoCuota(nuevoEstado);

            if (nuevoEstado == EstadoCuota.VENCIDA) {
                int meses = (int) java.time.temporal.ChronoUnit.MONTHS.between(socio.getUltimoPagado(),
                        LocalDate.now());
                socio.setMesesAdeudados(meses);
            } else {
                socio.setMesesAdeudados(0);
            }

            socioRepository.save(socio);
        }
    }

    @Scheduled(cron = "0 0 2 * * ?") // todos los días a las 2 AM
    public void actualizarCuotasDiarias() {
        actualizarEstadosCuotas();
    }

}