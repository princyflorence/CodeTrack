package com.codetrack.backend.repository;

import com.codetrack.backend.entity.Problem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProblemRepository extends JpaRepository<Problem, Long> {

    Optional<Problem> findByTitleIgnoreCase(String title);

    boolean existsByTitleIgnoreCase(String title);
}