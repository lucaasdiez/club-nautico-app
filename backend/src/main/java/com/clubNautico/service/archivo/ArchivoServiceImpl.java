package com.clubNautico.service.archivo;

import com.clubNautico.model.Archivo;
import com.clubNautico.model.Socio;
import com.clubNautico.repository.ArchivoRepository;
import com.clubNautico.repository.SocioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@RequiredArgsConstructor
@Service
public class ArchivoServiceImpl implements ArchivoService {
    private final ArchivoRepository archivoRepository;
    private final SocioRepository socioRepository;
    @Value("${flies.location}")
    private String carpetaPath;


    @Override
    public List<Archivo> archivosUpload(List<MultipartFile> files, UUID socioId) {
        Socio socio = socioRepository.findById(socioId)
                .orElseThrow(() -> new RuntimeException("Socio no encontrado"));
        List<Archivo> archivos = new ArrayList<>();
        try {
            for(MultipartFile file : files){
                if(file.isEmpty()){continue;}
                String fileName= UUID.randomUUID().toString();
                byte[] bytes = file.getBytes();
                String fileOriginalName = file.getOriginalFilename();
                assert fileOriginalName != null;

                long fileSize = file.getSize();
                if(fileSize==0){continue;}
                String newFileName = getString(fileSize, fileOriginalName, fileName);
                Path path = Paths.get(carpetaPath +"/"+  newFileName);
                Files.write(path, bytes);

                Archivo archivo = new Archivo();
                archivo.setNombre(fileOriginalName);
                archivo.setRuta(path.toString());
                archivo.setSocio(socio);

                archivoRepository.save(archivo);
                archivos.add(archivo);
            }
            return archivos;
        }catch (IOException e){
            throw new RuntimeException(e.getMessage());
        }
    }
    @Override
    public Archivo archivoUpload(MultipartFile file, UUID socioId) {
        if (file == null || file.isEmpty()) {
            throw new RuntimeException("No se recibió archivo");
        }
        List<Archivo> archivos = archivosUpload(List.of(file), socioId);
        return archivos.getFirst();
    }


    private static String getString(long fileSize, String fileOriginalName, String fileName) {
        long maxFileSize = 5 * 1024 * 1024;
        if(fileSize > maxFileSize){
            throw new RuntimeException("Archivo excedido");
        }
        if(!fileOriginalName.endsWith(".pdf") && !fileOriginalName.endsWith(".docx") && !fileOriginalName.endsWith(".xlsx")){
            throw new RuntimeException("Archivo debes ser WORD, PDF o EXCEL");
        }
        String fileExtension = fileOriginalName.substring(fileOriginalName.lastIndexOf("."));
        return fileName + fileExtension;
    }

    @Override
    public ResponseEntity<UrlResource> descargarArchivo(UUID archivoId) {
        try {
            Archivo archivo = archivoRepository.findById(archivoId)
                    .orElseThrow(() -> new RuntimeException("Archivo no encontrado con id: " + archivoId));

            // Validar que el archivo existe en el sistema de archivos
            Path filePath = Paths.get(archivo.getRuta());
            if (!Files.exists(filePath) || !Files.isRegularFile(filePath)) {
                throw new FileNotFoundException("El archivo no existe en la ruta especificada: " + archivo.getRuta());
            }

            // Crear el recurso para la descarga
            UrlResource resource = new UrlResource(filePath.toUri());
            if (!resource.exists() || !resource.isReadable()) {
                throw new FileNotFoundException("El archivo no es accesible para lectura");
            }

            // Verificar que el nombre coincida
            String fileName = filePath.getFileName().toString();
            if (!fileName.equals(new File(archivo.getRuta()).getName())) {
                throw new IllegalArgumentException("El nombre del archivo no coincide con el registrado");
            }

            return ResponseEntity.ok()
                    .contentType(Files.probeContentType(filePath) == null ? MediaType.APPLICATION_OCTET_STREAM : MediaType.parseMediaType(Files.probeContentType(filePath)))
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + archivo.getNombre() + "\"")
                    .body(resource);
        } catch (Exception e) {
            throw new RuntimeException("Error al descargar el archivo: " + e.getMessage());
        }
    }
}
