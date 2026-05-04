package com.projectManagement.projectManagerBackend.Dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.util.List;

@Data
public class ProjectCreateAndAssignRequest {
    @NotBlank(message = "Name cannot be empty")
    private String name;
    List<@Pattern(
            regexp = "^[0-9a-fA-F-]{36}$",
            message = "Invalid UUID format"
    ) String> membersIds;
}
