package com.projectManagement.projectManagerBackend.DAO.Repo;

import com.projectManagement.projectManagerBackend.DAO.Entities.ProjectMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;
import java.util.UUID;

public interface ProjectMemberRepo extends JpaRepository<ProjectMember, UUID> {
    boolean existsByProjectIdAndUserIdAndRole(
            UUID projectId,
            UUID userId,
            ProjectMember.Role role
    );

    Optional<ProjectMember> findByProjectIdAndUserId(UUID projectId, UUID userId);
    boolean existsByProjectIdAndUserId(UUID projectId, UUID userId);
}
