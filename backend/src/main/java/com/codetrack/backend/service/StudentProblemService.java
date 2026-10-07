package com.codetrack.backend.service;

import com.codetrack.backend.entity.Problem;
import com.codetrack.backend.entity.Student;
import com.codetrack.backend.entity.StudentProblem;
import com.codetrack.backend.repository.StudentProblemRepository;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class StudentProblemService {

    private final StudentProblemRepository studentProblemRepository;
    private final EntityManager entityManager;

    public StudentProblemService(
            StudentProblemRepository studentProblemRepository,
            EntityManager entityManager) {

        this.studentProblemRepository = studentProblemRepository;
        this.entityManager = entityManager;
    }

    public List<StudentProblem> getAllStudentProblems() {
        return studentProblemRepository.findAll();
    }

    public List<StudentProblem> getStudentProblems(Long studentId) {
        return studentProblemRepository.findByStudentId(studentId);
    }

    public StudentProblem addStudentProblem(
            StudentProblem studentProblem) {

        return studentProblemRepository.save(studentProblem);
    }

    public StudentProblem updateStudentProblem(
            StudentProblem studentProblem) {

        if (studentProblem.getStudent() == null
                || studentProblem.getStudent().getId() == null) {

            throw new RuntimeException("Student ID is required.");
        }

        if (studentProblem.getProblem() == null
                || studentProblem.getProblem().getId() == null) {

            throw new RuntimeException("Problem ID is required.");
        }

        Long studentId =
                studentProblem.getStudent().getId();

        Long problemId =
                studentProblem.getProblem().getId();

        StudentProblem existing =
                studentProblemRepository
                        .findByStudentIdAndProblemId(
                                studentId,
                                problemId
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "StudentProblem not found for student "
                                                + studentId
                                                + " and problem "
                                                + problemId
                                )
                        );

        existing.setAttempts(
                studentProblem.getAttempts()
        );

        existing.setStatus(
                studentProblem.getStatus()
        );

        existing.setFirstAttemptedAt(
                studentProblem.getFirstAttemptedAt()
        );

        existing.setLastAttemptedAt(
                studentProblem.getLastAttemptedAt()
        );

        existing.setSolvedAt(
                studentProblem.getSolvedAt()
        );

        return studentProblemRepository.save(existing);
    }

    /*
     * =========================================================
     * REAL SUBMISSION RECORDING
     * =========================================================
     *
     * This method is responsible for:
     *
     * 1. Finding whether the student already attempted
     *    the problem.
     *
     * 2. Creating the StudentProblem record if this is
     *    the first submission.
     *
     * 3. Increasing attempts for later submissions.
     *
     * 4. Updating timestamps.
     *
     * 5. Marking the problem as SOLVED.
     *
     * The frontend no longer controls these values.
     */
    @Transactional
    public StudentProblem submitSolution(
            Long studentId,
            Long problemId) {

        if (studentId == null) {
            throw new RuntimeException(
                    "Student ID is required."
            );
        }

        if (problemId == null) {
            throw new RuntimeException(
                    "Problem ID is required."
            );
        }

        /*
         * Get references to the existing database
         * Student and Problem records.
         */
        Student student =
                entityManager.getReference(
                        Student.class,
                        studentId
                );

        Problem problem =
                entityManager.getReference(
                        Problem.class,
                        problemId
                );

        LocalDateTime now =
                LocalDateTime.now();

        /*
         * Check whether this student already has
         * a record for this problem.
         */
        var existingOptional =
                studentProblemRepository
                        .findByStudentIdAndProblemId(
                                studentId,
                                problemId
                        );

        /*
         * =====================================================
         * FIRST SUBMISSION
         * =====================================================
         */
        if (existingOptional.isEmpty()) {

            StudentProblem newStudentProblem =
                    new StudentProblem();

            newStudentProblem.setStudent(student);
            newStudentProblem.setProblem(problem);

            newStudentProblem.setStatus("SOLVED");

            newStudentProblem.setAttempts(1);

            newStudentProblem.setFirstAttemptedAt(now);

            newStudentProblem.setLastAttemptedAt(now);

            newStudentProblem.setSolvedAt(now);

            return studentProblemRepository.save(
                    newStudentProblem
            );
        }

        /*
         * =====================================================
         * RE-SUBMISSION
         * =====================================================
         */

        StudentProblem existing =
                existingOptional.get();

        existing.setStudent(student);
        existing.setProblem(problem);

        existing.setStatus("SOLVED");

        existing.setAttempts(
                existing.getAttempts() + 1
        );

        /*
         * Preserve the original first-attempt time.
         */
        if (existing.getFirstAttemptedAt() == null) {
            existing.setFirstAttemptedAt(now);
        }

        existing.setLastAttemptedAt(now);

        /*
         * Preserve the original solved time.
         */
        if (existing.getSolvedAt() == null) {
            existing.setSolvedAt(now);
        }

        return studentProblemRepository.save(existing);
    }
}