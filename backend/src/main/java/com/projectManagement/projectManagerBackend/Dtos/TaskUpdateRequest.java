package com.projectManagement.projectManagerBackend.Dtos;

import com.projectManagement.projectManagerBackend.DAO.Entities.Task;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
public class TaskUpdateRequest {
    private String title;           // ADMIN only
    private String description;     // ADMIN only
    private UUID assignedToUserId;  // ADMIN only
    private LocalDateTime dueDate;  // ADMIN only
    private Task.Status status;     // ADMIN + MEMBER (own tasks)
}
