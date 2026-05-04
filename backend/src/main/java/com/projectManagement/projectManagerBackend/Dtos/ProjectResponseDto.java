package com.projectManagement.projectManagerBackend.Dtos;

import com.projectManagement.projectManagerBackend.DAO.Entities.ProjectMember;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class ProjectResponseDto {
    private UUID id;
    private String name;
    private ProjectMember.Role role;
    private long taskCount;
}
