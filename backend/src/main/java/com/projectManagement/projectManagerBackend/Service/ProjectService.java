package com.projectManagement.projectManagerBackend.Service;

import com.projectManagement.projectManagerBackend.Controller.ProjectController;
import com.projectManagement.projectManagerBackend.DAO.Entities.Project;
import com.projectManagement.projectManagerBackend.DAO.Entities.ProjectMember;
import com.projectManagement.projectManagerBackend.DAO.Entities.User;
import com.projectManagement.projectManagerBackend.DAO.Managers.ProjectManager;
import com.projectManagement.projectManagerBackend.DAO.Managers.ProjectMemberManager;
import com.projectManagement.projectManagerBackend.DAO.Managers.UserManager;
import com.projectManagement.projectManagerBackend.DAO.Repo.ProjectRepo;
import com.projectManagement.projectManagerBackend.Dtos.*;
import com.projectManagement.projectManagerBackend.Exceptions.CustomExceptions.BadRequestException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService implements ProjectController {

    private final ProjectManager projectManager;
    private final UserManager userManager;
    private final ProjectMemberManager projectMemberManager;

    @Override
    public ApiResponse<Object> getMyProjects(int page, int size, UserDetailDto userDetail) {
        User requestor = userManager.findByEmail(userDetail.getEmail());

        Page<ProjectRepo.ProjectionProject> result = projectManager.getMyProjects(
                requestor.getId(),
                PageRequest.of(page, size)
        );

        List<ProjectResponseDto> content = result.getContent().stream()
                .map(p -> ProjectResponseDto.builder()
                        .id(p.getId())
                        .name(p.getName())
                        .role(p.getRole())
                        .taskCount(p.getTaskCount())
                        .build())
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

    @Transactional
    @Override
    public ApiResponse<Object> createAndAssign(ProjectCreateAndAssignRequest req, UserDetailDto requestorUser){
        User requestor = userManager.findByEmail(requestorUser.getEmail());
        List<UUID> uuids = validateAndFetchUsers(req.getMembersIds(), requestor);
        List<User> users = userManager.findAllByIds(uuids);

        if (users.size() != uuids.size()) {
            throw new BadRequestException("Some users not found", "USER_NOT_FOUND");
        }


        Project project = projectManager.createProject(req.getName(), requestor);;

        assignMembers(project, users, requestor);

        return ApiResponse.builder()
                .success(true)
                .data(project.getId())
                .build();
    }

    @Override
    public ApiResponse<Object> addMembers(UUID projectId, ProjectAssignMembersRequestDto dto, UserDetailDto requestorUser){

        User requestor = userManager.findByEmail(requestorUser.getEmail());

        List<UUID> uuids = validateAndFetchUsers(dto.getMemberIds(), requestor);
        List<User> users = userManager.findAllByIds(uuids);

        Project project = projectManager.getProjectById(projectId);

        boolean isAdmin = projectMemberManager.existsByProjectAndUserAndRole(
                projectId,
                requestor.getId(),
                ProjectMember.Role.ADMIN
        );


        if (!isAdmin) {
            throw new BadRequestException("Only admins allowed", "FORBIDDEN");
        }

        assignMembers(project, users, requestor);

        return ApiResponse.builder()
                .success(true)
                .build();
    }

    @Override
    public ApiResponse<Object> deleteProject(UUID projectId, UserDetailDto userDetailDto){
        User requestor = userManager.findByEmail(userDetailDto.getEmail());
        boolean isAdmin = projectMemberManager.existsByProjectAndUserAndRole(
                projectId,
                requestor.getId(),
                ProjectMember.Role.ADMIN
        );
        if (!isAdmin) {
            throw new BadRequestException("Only admins allowed", "FORBIDDEN");
        }
        projectManager.deleteProject(projectId);
        return ApiResponse.builder()
                .success(true)
                .build();
    }


    private List<UUID> validateAndFetchUsers(List<String> memberIds, User creator){

        List<UUID> uuids = new ArrayList<>();
        if (memberIds == null || memberIds.isEmpty()) {
            return new ArrayList<>(); // no members to add
        }

        for (String id : memberIds) {
            try {
                UUID uuid = UUID.fromString(id);

                if (!uuid.equals(creator.getId())) {
                    uuids.add(uuid);
                }

            } catch (IllegalArgumentException e) {
                throw new BadRequestException("Invalid member ID: " + id, "INVALID_UUID");
            }
        }

        return uuids;
    }

    private void assignMembers(Project project, List<User> users, User creator){

        List<ProjectMember> members = new ArrayList<>();

        // Get existing userIds
        Set<UUID> existingUserIds = project.getMembers() == null
                ? new HashSet<>()
                : project.getMembers().stream()
                .map(pm -> pm.getUser().getId())
                .collect(Collectors.toSet());

        // Add creator (if not already present)
        if (!existingUserIds.contains(creator.getId())) {
            ProjectMember admin = new ProjectMember();
            admin.setProject(project);
            admin.setUser(creator);
            admin.setRole(ProjectMember.Role.ADMIN);
            members.add(admin);
        }

        // Add other users
        for (User u : users) {
            if (!existingUserIds.contains(u.getId())) {
                ProjectMember pm = new ProjectMember();
                pm.setProject(project);
                pm.setUser(u);
                pm.setRole(ProjectMember.Role.MEMBER);
                members.add(pm);
            }
        }

        projectMemberManager.saveAll(members);
    }
}