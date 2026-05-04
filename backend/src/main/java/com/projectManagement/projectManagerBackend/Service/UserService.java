package com.projectManagement.projectManagerBackend.Service;

import com.projectManagement.projectManagerBackend.Controller.UserController;
import com.projectManagement.projectManagerBackend.DAO.Repo.UserRepo;
import com.projectManagement.projectManagerBackend.Dtos.ApiResponse;
import com.projectManagement.projectManagerBackend.Dtos.UserMinimalDto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService implements UserController {

    private final UserRepo userRepo;

    @Override
    public ApiResponse<List<UserMinimalDto>> searchUsers(String query) {
        List<UserMinimalDto> users = userRepo.findByEmailContainingIgnoreCase(query)
                .stream()
                .map(user -> new UserMinimalDto(user.getId(), user.getEmail()))
                .toList();

        return ApiResponse.<List<UserMinimalDto>>builder()
                .success(true)
                .data(users)
                .build();
    }
}