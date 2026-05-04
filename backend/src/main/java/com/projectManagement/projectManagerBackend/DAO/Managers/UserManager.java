package com.projectManagement.projectManagerBackend.DAO.Managers;

import com.projectManagement.projectManagerBackend.DAO.Entities.User;
import com.projectManagement.projectManagerBackend.DAO.Repo.UserRepo;
import com.projectManagement.projectManagerBackend.Exceptions.CustomExceptions.BadRequestException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class UserManager {

    private final UserRepo userRepo;

    @Transactional(readOnly = true)
    public List<User> findAllByIds(List<UUID> ids){
        return userRepo.findAllById(ids);
    }

    public User findByEmail(String email){
        return userRepo.findByEmail(email)
                .orElseThrow(() -> new BadRequestException(
                        "Invalid credentials",
                        "INVALID_LOGIN"
                ));
    }

    public User findById(UUID id){
        return userRepo.findById(id).orElseThrow(() -> new BadRequestException(
                "Invalid credentials",
                "INVALID_LOGIN"
        ));
    }

    public Boolean checkEmailExists(String email){
        return userRepo.existsByEmail(email);
    }

    public void saveUser(User user){
        userRepo.save(user);
    }
}