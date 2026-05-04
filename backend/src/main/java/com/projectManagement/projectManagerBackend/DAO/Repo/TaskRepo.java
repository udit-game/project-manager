package com.projectManagement.projectManagerBackend.DAO.Repo;

import com.projectManagement.projectManagerBackend.DAO.Entities.ProjectMember;
import com.projectManagement.projectManagerBackend.DAO.Entities.Task;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface TaskRepo extends JpaRepository<Task, UUID> {

    @Query("""
    SELECT t FROM Task t
    WHERE t.project.id = :projectId
      AND (:status IS NULL OR t.status = :status)
      AND (:assignedTo IS NULL OR t.assignedTo.id = :assignedTo)
""")
    Page<Task> findByProjectWithFilters(
            @Param("projectId") UUID projectId,
            @Param("status") Task.Status status,
            @Param("assignedTo") UUID assignedTo,
            Pageable pageable
    );

    // all tasks assigned to me, optional status filter
    @Query("""
    SELECT t FROM Task t
    WHERE t.assignedTo.id = :userId
      AND (:status IS NULL OR t.status = :status)
""")
    Page<Task> findMyTasks(
            @Param("userId") UUID userId,
            @Param("status") Task.Status status,
            Pageable pageable
    );

    // distinct projects where I have at least one task
    @Query("""
    SELECT DISTINCT t.project.id as id, t.project.name as name
    FROM Task t
    WHERE t.assignedTo.id = :userId
""")
    Page<ProjectionProject> findProjectsWithMyTasks(
            @Param("userId") UUID userId,
            Pageable pageable
    );

    interface ProjectionProject {
        UUID getId();
        String getName();
    }
}
