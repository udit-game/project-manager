package com.projectManagement.projectManagerBackend.Service;

import com.projectManagement.projectManagerBackend.Controller.AuthController;
import com.projectManagement.projectManagerBackend.DAO.Entities.User;
import com.projectManagement.projectManagerBackend.DAO.Managers.UserManager;
import com.projectManagement.projectManagerBackend.Dtos.ApiResponse;
import com.projectManagement.projectManagerBackend.Dtos.LoginRequestDto;
import com.projectManagement.projectManagerBackend.Dtos.RegisterUserRequestDto;
import com.projectManagement.projectManagerBackend.Dtos.TokenResponseDto;
import com.projectManagement.projectManagerBackend.Exceptions.CustomExceptions.BadRequestException;
import com.projectManagement.projectManagerBackend.Utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService implements AuthController {

    private final PasswordEncoder passwordEncoder;
    private final UserManager userManager;
    private final JwtUtil jwtUtil;

    @Override
    public ApiResponse<TokenResponseDto> register(RegisterUserRequestDto registerUserRequestDto) {
        if (registerUserRequestDto.getPassword().isEmpty() || registerUserRequestDto.getEmail().isEmpty()) {
            throw new BadRequestException(
                    "password or email cannot be empty",
                    "MISSING_FIELDS"
            );
        }
        if(userManager.checkEmailExists(registerUserRequestDto.getEmail())) {
            throw new BadRequestException(
                    "Email Already Exists",
                    "DUPLICATE_IDENTIFIER"
            );
        }
        User user = new User();
        user.setEmail(registerUserRequestDto.getEmail());
        user.setPassword(passwordEncoder.encode(registerUserRequestDto.getPassword()));
        userManager.saveUser(user);
        String token = jwtUtil.generateToken(user);
        return ApiResponse.<TokenResponseDto>builder()
                .success(true)
                .data(TokenResponseDto.builder().token(token).build())
                .build();
    }

    @Override
    public ApiResponse<TokenResponseDto> login(LoginRequestDto loginUserRequestDto) {
        if (loginUserRequestDto.getPassword().isEmpty() || loginUserRequestDto.getEmail().isEmpty()) {
            throw new BadRequestException(
                    "password or email cannot be empty",
                    "MISSING_FIELDS"
            );
        }
        User user = userManager.findByEmail(loginUserRequestDto.getEmail());

        boolean isMatch = passwordEncoder.matches(
                loginUserRequestDto.getPassword(),
                user.getPassword()
        );

        if (!isMatch) {
            throw new BadRequestException(
                    "Invalid credentials",
                    "INVALID_LOGIN"
            );
        }

        String token = jwtUtil.generateToken(user);
        return ApiResponse.<TokenResponseDto>builder()
                .success(true)
                .data(TokenResponseDto.builder().token(token).build())
                .build();
    }
}
