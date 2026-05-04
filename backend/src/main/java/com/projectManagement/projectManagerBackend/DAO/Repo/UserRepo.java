package com.projectManagement.projectManagerBackend.DAO.Repo;

import com.projectManagement.projectManagerBackend.DAO.Entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepo extends JpaRepository<User, UUID> {

    public Optional<User> findByEmail(String email);

    public Boolean existsByEmail(String email);

    List<User> findByEmailContainingIgnoreCase(String email);
}
