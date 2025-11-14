package com.clubNautico.service.archivo;

import com.clubNautico.model.Archivo;
import org.springframework.core.io.UrlResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.UUID;

public interface ArchivoService {
    List<Archivo> archivosUpload(List<MultipartFile> file, UUID socioId);
    Archivo archivoUpload(MultipartFile file, UUID socioId);
    ResponseEntity<UrlResource> descargarArchivo(UUID archivoId);
}
