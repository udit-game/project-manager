package com.projectManagement.projectManagerBackend.Exceptions;

import com.projectManagement.projectManagerBackend.Dtos.ApiError;
import com.projectManagement.projectManagerBackend.Dtos.ApiResponse;
import com.projectManagement.projectManagerBackend.Exceptions.CustomExceptions.BadRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiResponse<?>> handleBadRequest(BadRequestException ex) {
        ApiError error = ApiError.builder()
                .message(ex.getMessage())
                .code(ex.getCode())
                .build();

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.builder()
                        .success(false)
                        .error(error)
                        .build());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Object>> handleValidationException(
            MethodArgumentNotValidException ex) {

        String message = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(err -> err.getField() + ": " + err.getDefaultMessage())
                .findFirst()
                .orElse("Validation error");

        ApiError error = ApiError.builder()
                .message(message)
                .code("VALIDATION_ERROR")
                .build();

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST).body(ApiResponse.builder()
                        .success(false)
                        .data(null)
                        .error(error)
                        .build());
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<?>> handleGeneric(Exception ex) {
        ApiError error = ApiError.builder()
                .message("Something went wrong")
                .code("INTERNAL_SERVER_ERROR")
                .build();

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.builder()
                        .success(false)
                        .error(error)
                        .build());
    }
}
