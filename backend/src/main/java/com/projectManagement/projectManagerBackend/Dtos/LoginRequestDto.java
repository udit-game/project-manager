package com.projectManagement.projectManagerBackend.Dtos;

import lombok.Data;

@Data
public class LoginRequestDto {
    private String email;
    private String password;
}
