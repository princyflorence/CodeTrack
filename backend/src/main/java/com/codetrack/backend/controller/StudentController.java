package com.codetrack.backend.controller;

import com.codetrack.backend.entity.Student;
import com.codetrack.backend.service.StudentService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = "*")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    /* =========================================
       GET ALL STUDENTS
    ========================================= */

    @GetMapping
    public List<Student> getAllStudents() {
        return studentService.getAllStudents();
    }

    /* =========================================
       GET STUDENT BY ID
    ========================================= */

    @GetMapping("/{id}")
    public ResponseEntity<Student> getStudent(
            @PathVariable Long id) {

        Student student =
                studentService.getStudentById(id);

        if (student == null) {
            return ResponseEntity
                    .notFound()
                    .build();
        }

        return ResponseEntity.ok(student);
    }

    /* =========================================
       ADD STUDENT
    ========================================= */

    @PostMapping
    public Student addStudent(
            @RequestBody Student student) {

        return studentService.addStudent(student);
    }

    /* =========================================
       STUDENT LOGIN
    ========================================= */

    @PostMapping("/login")
    public ResponseEntity<?> loginStudent(
            @RequestBody Map<String, String> request) {

        String email = request.get("email");
        String password = request.get("password");

        if (email == null ||
                email.trim().isEmpty() ||
                password == null ||
                password.trim().isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body(
                            Map.of(
                                    "success", false,
                                    "message",
                                    "Email and password are required."
                            )
                    );
        }

        Student student =
                studentService.loginStudent(
                        email.trim(),
                        password
                );

        if (student == null) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body(
                            Map.of(
                                    "success", false,
                                    "message",
                                    "Invalid email or password, or account is inactive."
                            )
                    );
        }

        return ResponseEntity.ok(
                Map.of(
                        "success", true,
                        "message", "Login successful.",
                        "student", student
                )
        );
    }

    /* =========================================
       DELETE STUDENT
    ========================================= */

    @DeleteMapping("/{id}")
    public String deleteStudent(
            @PathVariable Long id) {

        studentService.deleteStudent(id);

        return "Student deleted successfully";
    }
}