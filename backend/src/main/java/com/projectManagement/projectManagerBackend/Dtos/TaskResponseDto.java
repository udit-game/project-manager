package com.projectManagement.projectManagerBackend.Dtos;

import com.projectManagement.projectManagerBackend.DAO.Entities.Task;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
public class TaskResponseDto {
    private UUID id;
    private String title;
    private String description;
    private Task.Status status;
    private String assignedToEmail;
    private UUID assignedToId;
    private LocalDateTime dueDate;
    private boolean overdue;
}
