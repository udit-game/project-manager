package com.projectManagement.projectManagerBackend.Dtos;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.util.List;

@Data
public class ProjectAssignMembersRequestDto {
    @NotEmpty
    private List<@Pattern(
            regexp = "^[0-9a-fA-F-]{36}$",
            message = "Invalid UUID"
    ) String> memberIds;
}
