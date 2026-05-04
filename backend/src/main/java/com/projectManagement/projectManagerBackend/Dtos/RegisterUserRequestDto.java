package com.projectManagement.projectManagerBackend.Dtos;

import lombok.Data;

@Data
public class RegisterUserRequestDto {
    private String email;
    private String password;
}
