package com.projectManagement.projectManagerBackend.Dtos;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class TaskCreateRequest {
    @NotBlank
    private String title;

    private String description;

    private UUID assignedToUserId;

    @Future
    private LocalDateTime dueDate;
}
