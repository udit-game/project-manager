package com.projectManagement.projectManagerBackend.Controller;

import com.projectManagement.projectManagerBackend.DAO.Entities.Task;
import com.projectManagement.projectManagerBackend.Dtos.ApiResponse;
import com.projectManagement.projectManagerBackend.Dtos.TaskCreateRequest;
import com.projectManagement.projectManagerBackend.Dtos.TaskUpdateRequest;
import com.projectManagement.projectManagerBackend.Dtos.UserDetailDto;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/task")
public interface TaskController {

    @PostMapping("/{projectId}")
    ApiResponse<Object> createTask(
            @PathVariable UUID projectId,
            @Valid @RequestBody TaskCreateRequest req,
            @AuthenticationPrincipal UserDetailDto user
    );

    @GetMapping("/{projectId}")
    ApiResponse<Object> getTasks(
            @PathVariable UUID projectId,
            @RequestParam(required = false) Task.Status status,
            @RequestParam(required = false) UUID assignedTo,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserDetailDto user
    );

    @PostMapping("/{projectId}/{taskId}")
    ApiResponse<Object> updateTask(
            @PathVariable UUID projectId,
            @PathVariable UUID taskId,
            @Valid @RequestBody TaskUpdateRequest req,
            @AuthenticationPrincipal UserDetailDto user
    );

    @DeleteMapping("/{projectId}/{taskId}")
    ApiResponse<Object> deleteTask(
            @PathVariable UUID projectId,
            @PathVariable UUID taskId,
            @AuthenticationPrincipal UserDetailDto user
    );

    @GetMapping("/my-tasks")
    ApiResponse<Object> getMyTasks(
            @RequestParam(required = false) Task.Status status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserDetailDto user
    );

    @GetMapping("/my-projects")
    ApiResponse<Object> getProjectsWithMyTasks(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserDetailDto user
    );
}