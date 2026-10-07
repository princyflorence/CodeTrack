package com.codetrack.backend.controller;

import com.codetrack.backend.entity.StudentProblem;
import com.codetrack.backend.service.StudentProblemService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student-problems")
@CrossOrigin(origins = "*")
public class StudentProblemController {

    private final StudentProblemService studentProblemService;

    public StudentProblemController(
            StudentProblemService studentProblemService) {

        this.studentProblemService =
                studentProblemService;
    }

    /*
     * =========================================================
     * GET ALL STUDENT PROBLEMS
     * =========================================================
     */

    @GetMapping
    public List<StudentProblem> getAllStudentProblems() {

        return studentProblemService
                .getAllStudentProblems();
    }

    /*
     * =========================================================
     * GET STUDENT PROGRESS
     * =========================================================
     */

    @GetMapping("/student/{studentId}")
    public List<StudentProblem> getStudentProblems(
            @PathVariable Long studentId) {

        return studentProblemService
                .getStudentProblems(studentId);
    }

    /*
     * =========================================================
     * OLD POST ENDPOINT
     * =========================================================
     */

    @PostMapping
    public StudentProblem addStudentProblem(
            @RequestBody StudentProblem studentProblem) {

        return studentProblemService
                .addStudentProblem(studentProblem);
    }

    /*
     * =========================================================
     * OLD UPDATE ENDPOINT
     * =========================================================
     */

    @PutMapping
    public StudentProblem updateStudentProblem(
            @RequestBody StudentProblem studentProblem) {

        return studentProblemService
                .updateStudentProblem(studentProblem);
    }

    /*
     * =========================================================
     * SUBMIT SOLUTION
     * =========================================================
     *
     * Frontend sends:
     *
     * POST /api/student-problems/submit
     *
     * {
     *     "studentId": 1,
     *     "problemId": 5
     * }
     *
     * Backend handles:
     *
     * - attempts
     * - status
     * - firstAttemptedAt
     * - lastAttemptedAt
     * - solvedAt
     */

    @PostMapping("/submit")
    public ResponseEntity<?> submitSolution(
            @RequestBody Map<String, Object> request) {

        try {

            if (!request.containsKey("studentId")
                    || !request.containsKey("problemId")) {

                return ResponseEntity
                        .badRequest()
                        .body(Map.of(
                                "success", false,
                                "message",
                                "Student ID and Problem ID are required."
                        ));
            }

            Long studentId =
                    Long.valueOf(
                            request
                                    .get("studentId")
                                    .toString()
                    );

            Long problemId =
                    Long.valueOf(
                            request
                                    .get("problemId")
                                    .toString()
                    );

            StudentProblem result =
                    studentProblemService
                            .submitSolution(
                                    studentId,
                                    problemId
                            );

            return ResponseEntity.ok(
                    Map.of(
                            "success", true,
                            "message",
                            "Solution submitted successfully!",
                            "status",
                            result.getStatus(),
                            "attempts",
                            result.getAttempts(),
                            "studentProblemId",
                            result.getId()
                    )
            );

        } catch (Exception error) {

            error.printStackTrace();

            return ResponseEntity
                    .badRequest()
                    .body(Map.of(
                            "success", false,
                            "message",
                            error.getMessage() != null
                                    ? error.getMessage()
                                    : "Unable to submit solution."
                    ));
        }
    }
}