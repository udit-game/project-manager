package com.projectManagement.projectManagerBackend.Service;

import com.projectManagement.projectManagerBackend.Controller.TaskController;
import com.projectManagement.projectManagerBackend.DAO.Entities.Project;
import com.projectManagement.projectManagerBackend.DAO.Entities.ProjectMember;
import com.projectManagement.projectManagerBackend.DAO.Entities.Task;
import com.projectManagement.projectManagerBackend.DAO.Entities.User;
import com.projectManagement.projectManagerBackend.DAO.Managers.ProjectManager;
import com.projectManagement.projectManagerBackend.DAO.Managers.ProjectMemberManager;
import com.projectManagement.projectManagerBackend.DAO.Managers.TaskManager;
import com.projectManagement.projectManagerBackend.DAO.Managers.UserManager;
import com.projectManagement.projectManagerBackend.DAO.Repo.TaskRepo;
import com.projectManagement.projectManagerBackend.Dtos.*;
import com.projectManagement.projectManagerBackend.Exceptions.CustomExceptions.BadRequestException;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TaskService implements TaskController {

    private final TaskManager taskManager;
    private final ProjectManager projectManager;
    private final UserManager userManager;
    private final ProjectMemberManager projectMemberManager;

    @Override
    public ApiResponse<Object> createTask(UUID projectId, TaskCreateRequest req, UserDetailDto userDetail) {
        User requestor = userManager.findByEmail(userDetail.getEmail());

        requireRole(projectId, requestor.getId(), ProjectMember.Role.ADMIN);

        Project project = projectManager.getProjectById(projectId);

        User assignedTo = null;
        if (req.getAssignedToUserId() != null) {
            if (!projectMemberManager.existsByProjectAndUser(projectId, req.getAssignedToUserId())) {
                throw new BadRequestException("Assignee is not a project member", "NOT_A_MEMBER");
            }
            assignedTo = userManager.findById(req.getAssignedToUserId());
        }

        Task task = new Task();
        task.setTitle(req.getTitle());
        task.setDescription(req.getDescription());
        task.setProject(project);
        task.setCreatedBy(requestor);
        task.setAssignedTo(assignedTo);
        task.setStatus(Task.Status.TODO);
        task.setDueDate(req.getDueDate());

        Task saved = taskManager.save(task);

        return ApiResponse.builder()
                .success(true)
                .data(toDto(saved))
                .build();
    }

    @Override
    public ApiResponse<Object> getTasks(UUID projectId, Task.Status status,
                                        UUID assignedTo, int page, int size,
                                        UserDetailDto userDetail) {
        User requestor = userManager.findByEmail(userDetail.getEmail());
        requireMembership(projectId, requestor.getId());

        Page<Task> result = taskManager.findByProjectWithFilters(
                projectId, status, assignedTo,
                PageRequest.of(page, size)
        );

        List<TaskResponseDto> content = result.getContent().stream()
                .map(this::toDto)
                .toList();

        return ApiResponse.builder()
                .success(true)
                .data(Map.of(
                        "content", content,
                        "totalPages", result.getTotalPages(),
                        "totalElements", result.getTotalElements(),
                        "page", page
                ))
                .build();
    }

    @Override
    public ApiResponse<Object> updateTask(UUID projectId, UUID taskId, TaskUpdateRequest req, UserDetailDto userDetail) {
        User requestor = userManager.findByEmail(userDetail.getEmail());

        ProjectMember membership = requireMembership(projectId, requestor.getId());
        Task task = taskManager.findById(taskId);

        if (!task.getProject().getId().equals(projectId)) {
            throw new BadRequestException("Task not in this project", "TASK_NOT_IN_PROJECT");
        }

        boolean isAdmin = membership.getRole() == ProjectMember.Role.ADMIN;

        if (isAdmin) {
            if (req.getTitle() != null)       task.setTitle(req.getTitle());
            if (req.getDescription() != null) task.setDescription(req.getDescription());
            if (req.getDueDate() != null)     task.setDueDate(req.getDueDate());
            if (req.getStatus() != null)      task.setStatus(req.getStatus());

            if (req.getAssignedToUserId() != null) {
                if (!projectMemberManager.existsByProjectAndUser(projectId, req.getAssignedToUserId())) {
                    throw new BadRequestException("Assignee is not a project member", "NOT_A_MEMBER");
                }
                task.setAssignedTo(userManager.findById(req.getAssignedToUserId()));
            }
        } else {
            boolean isAssignee = task.getAssignedTo() != null &&
                    task.getAssignedTo().getId().equals(requestor.getId());
            if (!isAssignee) {
                throw new BadRequestException("You can only update your own tasks", "FORBIDDEN");
            }
            if (req.getStatus() != null) task.setStatus(req.getStatus());
        }

        return ApiResponse.builder()
                .success(true)
                .data(toDto(taskManager.save(task)))
                .build();
    }

    @Override
    public ApiResponse<Object> deleteTask(UUID projectId, UUID taskId, UserDetailDto userDetail) {
        User requestor = userManager.findByEmail(userDetail.getEmail());

        requireRole(projectId, requestor.getId(), ProjectMember.Role.ADMIN);

        Task task = taskManager.findById(taskId);
        if (!task.getProject().getId().equals(projectId)) {
            throw new BadRequestException("Task not in this project", "TASK_NOT_IN_PROJECT");
        }

        taskManager.delete(taskId);

        return ApiResponse.builder()
                .success(true)
                .build();
    }


    private ProjectMember requireMembership(UUID projectId, UUID userId) {
        return projectMemberManager.findByProjectAndUser(projectId, userId)
                .orElseThrow(() -> new BadRequestException("Not a project member", "FORBIDDEN"));
    }

    private void requireRole(UUID projectId, UUID userId, ProjectMember.Role role) {
        if (!projectMemberManager.existsByProjectAndUserAndRole(projectId, userId, role)) {
            throw new BadRequestException("Insufficient permissions", "FORBIDDEN");
        }
    }

    private TaskResponseDto toDto(Task t) {
        return TaskResponseDto.builder()
                .id(t.getId())
                .title(t.getTitle())
                .description(t.getDescription())
                .status(t.getStatus())
                .assignedToId(t.getAssignedTo() != null ? t.getAssignedTo().getId() : null)
                .assignedToEmail(t.getAssignedTo() != null ? t.getAssignedTo().getEmail() : null)
                .dueDate(t.getDueDate())
                .overdue(t.getDueDate() != null
                        && t.getDueDate().isBefore(LocalDateTime.now())
                        && t.getStatus() != Task.Status.COMPLETED)
                .build();
    }

    @Override
    public ApiResponse<Object> getMyTasks(Task.Status status, int page, int size, UserDetailDto userDetail) {
        User requestor = userManager.findByEmail(userDetail.getEmail());

        Page<Task> result = taskManager.findMyTasks(requestor.getId(), status, PageRequest.of(page, size));

        return ApiResponse.builder()
                .success(true)
                .data(Map.of(
                        "content", result.getContent().stream().map(this::toDto).toList(),
                        "totalPages", result.getTotalPages(),
                        "totalElements", result.getTotalElements(),
                        "page", page
                ))
                .build();
    }

    @Override
    public ApiResponse<Object> getProjectsWithMyTasks(int page, int size, UserDetailDto userDetail) {
        User requestor = userManager.findByEmail(userDetail.getEmail());

        Page<TaskRepo.ProjectionProject> result = taskManager.findProjectsWithMyTasks(
                requestor.getId(), PageRequest.of(page, size)
        );

        return ApiResponse.builder()
                .success(true)
                .data(Map.of(
                        "content", result.getContent(),
                        "totalPages", result.getTotalPages(),
                        "totalElements", result.getTotalElements(),
                        "page", page
                ))
                .build();
    }
}
