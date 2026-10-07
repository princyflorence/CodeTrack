package com.codetrack.backend.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    // Demo/admin credentials for the CodeTrack project
    private static final String ADMIN_EMAIL = "admin@codetrack.com";
    private static final String ADMIN_PASSWORD = "admin123";

    @PostMapping("/login")
    public ResponseEntity<?> loginAdmin(
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

        if (ADMIN_EMAIL.equalsIgnoreCase(email.trim())
                && ADMIN_PASSWORD.equals(password)) {

            return ResponseEntity.ok(
                    Map.of(
                            "success", true,
                            "message", "Admin login successful.",
                            "role", "ADMIN"
                    )
            );
        }

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(
                        Map.of(
                                "success", false,
                                "message",
                                "Invalid admin email or password."
                        )
                );
    }
}