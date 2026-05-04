package com.projectManagement.projectManagerBackend.DAO.Repo;

import com.projectManagement.projectManagerBackend.DAO.Entities.Project;
import com.projectManagement.projectManagerBackend.DAO.Entities.ProjectMember;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.UUID;

public interface ProjectRepo extends JpaRepository<Project, UUID> {
    @Query("""
    SELECT p.id as id, p.name as name, pm.role as role,
           COUNT(t.id) as taskCount
    FROM ProjectMember pm
    JOIN pm.project p
    LEFT JOIN p.tasks t
    WHERE pm.user.id = :userId
    GROUP BY p.id, p.name, pm.role
""")
    Page<ProjectionProject> findMyProjects(@Param("userId") UUID userId, Pageable pageable);

    // projection interface — flat, no entity loading
    interface ProjectionProject {
        UUID getId();
        String getName();
        ProjectMember.Role getRole();
        long getTaskCount();
    }
}
