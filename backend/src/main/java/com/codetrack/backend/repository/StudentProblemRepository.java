package com.codetrack.backend.repository;

import com.codetrack.backend.entity.StudentProblem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudentProblemRepository extends JpaRepository<StudentProblem, Long> {

    Optional<StudentProblem> findByStudentIdAndProblemId(Long studentId, Long problemId);

    List<StudentProblem> findByStudentId(Long studentId);
}