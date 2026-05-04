package com.projectManagement.projectManagerBackend.Controller;

import com.projectManagement.projectManagerBackend.Dtos.ApiResponse;
import com.projectManagement.projectManagerBackend.Dtos.LoginRequestDto;
import com.projectManagement.projectManagerBackend.Dtos.RegisterUserRequestDto;
import com.projectManagement.projectManagerBackend.Dtos.TokenResponseDto;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public interface AuthController {

    @PostMapping("/login")
    public ApiResponse<TokenResponseDto> login(@RequestBody LoginRequestDto loginUserRequestDto);

    @PostMapping("/register")
    public ApiResponse<TokenResponseDto> register(@RequestBody RegisterUserRequestDto registerUserRequestDto);

}
