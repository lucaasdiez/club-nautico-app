package com.clubNautico.exception;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {


    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<String> handleDataIntegrityViolation(DataIntegrityViolationException ex) {

        String message = "Error al procesar la solicitud.";

        if (ex.getMessage().contains("uk_") || ex.getMessage().contains("duplicate key")) {

            message = "El nombre de usuario o DNI ya está registrado en el sistema.";
        }


        return new ResponseEntity<>(message, HttpStatus.CONFLICT);
    }

}