package com.projectManagement.projectManagerBackend.DAO.Managers;

import com.projectManagement.projectManagerBackend.DAO.Entities.Task;
import com.projectManagement.projectManagerBackend.DAO.Repo.TaskRepo;
import com.projectManagement.projectManagerBackend.Exceptions.CustomExceptions.BadRequestException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor

public class TaskManager {

    private final TaskRepo taskRepo;

    public Task save(Task task) {
        return taskRepo.save(task);
    }

    public Task findById(UUID taskId) {
        return taskRepo.findById(taskId)
                .orElseThrow(() -> new BadRequestException("Task not found", "TASK_NOT_FOUND"));
    }

    public Page<Task> findByProjectWithFilters(UUID projectId, Task.Status status, UUID assignedTo, Pageable pageable) {
        return taskRepo.findByProjectWithFilters(projectId, status, assignedTo, pageable);
    }

    public void delete(UUID taskId) {
        taskRepo.deleteById(taskId);
    }

    public Page<Task> findMyTasks(UUID userId, Task.Status status, Pageable pageable) {
        return taskRepo.findMyTasks(userId, status, pageable);
    }

    public Page<TaskRepo.ProjectionProject> findProjectsWithMyTasks(UUID userId, Pageable pageable) {
        return taskRepo.findProjectsWithMyTasks(userId, pageable);
    }
}
