package com.projectManagement.projectManagerBackend.DAO.Managers;

import com.projectManagement.projectManagerBackend.DAO.Entities.Project;
import com.projectManagement.projectManagerBackend.DAO.Entities.User;
import com.projectManagement.projectManagerBackend.DAO.Repo.ProjectRepo;
import com.projectManagement.projectManagerBackend.Exceptions.CustomExceptions.BadRequestException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.UUID;

@Component
@RequiredArgsConstructor
public class ProjectManager {

    private final ProjectRepo projectRepo;

    public Project getProjectById(UUID id){
        return projectRepo.findById(id)
                .orElseThrow(() ->
                        new BadRequestException("Project not found for id: " + id, "PROJECT_NOT_FOUND")
                );
    }

    public Project createProject(String name, User user){
        Project project = new Project();
        project.setName(name);
        project.setCreatedBy(user);
        return projectRepo.save(project);
    }

    public void deleteProject(UUID id){
        projectRepo.deleteById(id);
    }

    public Page<ProjectRepo.ProjectionProject> getMyProjects(UUID userId, Pageable pageable) {
        return projectRepo.findMyProjects(userId, pageable);
    }
}
