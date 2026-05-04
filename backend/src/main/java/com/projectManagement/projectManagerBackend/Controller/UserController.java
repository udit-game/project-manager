package com.projectManagement.projectManagerBackend.Controller;

import com.projectManagement.projectManagerBackend.Dtos.ApiResponse;
import com.projectManagement.projectManagerBackend.Dtos.UserMinimalDto;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/users")
public interface UserController {
    @GetMapping("/search")
    public ApiResponse<List<UserMinimalDto>> searchUsers(@RequestParam String query);
}
