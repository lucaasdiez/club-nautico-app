package com.clubNautico.service.codigoAcceso;

import com.clubNautico.dto.CodigoAcceso.CodigoAccesoResponseDTO;
import com.clubNautico.dto.CodigoAcceso.ValidarCodigoResponse;
import com.clubNautico.model.CodigoAcceso;

public interface CodigoAccesoService {
    CodigoAcceso generarCodigoParaSocio(String nroSocio);
    ValidarCodigoResponse validarCodigo(String token);
    CodigoAccesoResponseDTO convertirADto(CodigoAcceso codigoAcceso);
}
