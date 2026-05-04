package com.projectManagement.projectManagerBackend.DAO.Managers;

import com.projectManagement.projectManagerBackend.DAO.Entities.ProjectMember;
import com.projectManagement.projectManagerBackend.DAO.Repo.ProjectMemberRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class ProjectMemberManager {

    private final ProjectMemberRepo repo;

    public boolean existsByProjectAndUserAndRole(UUID projectId, UUID userId, ProjectMember.Role role){
        return repo.existsByProjectIdAndUserIdAndRole(projectId, userId, role);
    }

    public void saveAll(List<ProjectMember> members){
        repo.saveAll(members);
    }

    public Optional<ProjectMember> findByProjectAndUser(UUID projectId, UUID userId) {
        return repo.findByProjectIdAndUserId(projectId, userId);
    }

    public boolean existsByProjectAndUser(UUID projectId, UUID userId) {
        return repo.existsByProjectIdAndUserId(projectId, userId);
    }

}