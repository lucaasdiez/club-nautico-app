package com.clubNautico.dto;

import java.time.LocalDate;
import java.util.UUID;

public class SocioConEstadoDTO {
    
    private UUID id;
    private Long nroSocio;
    private String dni;
    private String nombre;
    private String apellido;
    private String email;
    private String telefono;
    private LocalDate fechaAlta;
    private Boolean activo;
    
    // Datos de estado de cuota
    private String estadoCuota;  // AL_DIA, POR_VENCER, VENCIDA
    private Integer mesesAdeudados;
    private LocalDate ultimoPagado;

    // Constructor vacío
    public SocioConEstadoDTO() {
    }

    // Constructor completo
    public SocioConEstadoDTO(UUID id, Long nroSocio, String dni, String nombre, String apellido, 
                             String email, String telefono, LocalDate fechaAlta, Boolean activo,
                             String estadoCuota, Integer mesesAdeudados, LocalDate ultimoPagado) {
        this.id = id;
        this.nroSocio = nroSocio;
        this.dni = dni;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.telefono = telefono;
        this.fechaAlta = fechaAlta;
        this.activo = activo;
        this.estadoCuota = estadoCuota;
        this.mesesAdeudados = mesesAdeudados;
        this.ultimoPagado = ultimoPagado;
    }

    // Getters y Setters
    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public Long getNroSocio() {
        return nroSocio;
    }

    public void setNroSocio(Long nroSocio) {
        this.nroSocio = nroSocio;
    }

    public String getDni() {
        return dni;
    }

    public void setDni(String dni) {
        this.dni = dni;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getApellido() {
        return apellido;
    }

    public void setApellido(String apellido) {
        this.apellido = apellido;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public LocalDate getFechaAlta() {
        return fechaAlta;
    }

    public void setFechaAlta(LocalDate fechaAlta) {
        this.fechaAlta = fechaAlta;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }

    public String getEstadoCuota() {
        return estadoCuota;
    }

    public void setEstadoCuota(String estadoCuota) {
        this.estadoCuota = estadoCuota;
    }

    public Integer getMesesAdeudados() {
        return mesesAdeudados;
    }

    public void setMesesAdeudados(Integer mesesAdeudados) {
        this.mesesAdeudados = mesesAdeudados;
    }

    public LocalDate getUltimoPagado() {
        return ultimoPagado;
    }

    public void setUltimoPagado(LocalDate ultimoPagado) {
        this.ultimoPagado = ultimoPagado;
    }
}