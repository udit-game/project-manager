package com.projectManagement.projectManagerBackend.Dtos;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class UserDetailDto {
    private UUID id;
    private String email;
}
