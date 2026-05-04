package com.projectManagement.projectManagerBackend.Controller;

import com.projectManagement.projectManagerBackend.Dtos.*;
import jakarta.validation.Valid;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/project")
public interface ProjectController {

    @GetMapping
    ApiResponse<Object> getMyProjects(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @AuthenticationPrincipal UserDetailDto user
    );

    @PostMapping
    public ApiResponse<Object> createAndAssign(
            @Valid @RequestBody ProjectCreateAndAssignRequest projectCreateAndAssignRequest,
            @AuthenticationPrincipal UserDetailDto user
    );

    @PostMapping("/{projectId}")
    public ApiResponse<Object> addMembers(
            @PathVariable UUID projectId,
            @Valid @RequestBody ProjectAssignMembersRequestDto projectAssignMembersRequestDto,
            @AuthenticationPrincipal UserDetailDto user
    );

    @DeleteMapping("/{projectId}")
    public ApiResponse<Object> deleteProject(
            @PathVariable UUID projectId,
            @AuthenticationPrincipal UserDetailDto user
    );

}
