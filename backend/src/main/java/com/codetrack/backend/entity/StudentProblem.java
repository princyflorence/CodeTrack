package com.codetrack.backend.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "student_problems",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"student_id", "problem_id"})
        }
)
public class StudentProblem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id", nullable = false)
    private Student student;

    @ManyToOne
    @JoinColumn(name = "problem_id", nullable = false)
    private Problem problem;

    @Column(nullable = false)
    private String status = "NOT_ATTEMPTED";

    @Column(nullable = false)
    private int attempts = 0;

    private LocalDateTime firstAttemptedAt;

    private LocalDateTime lastAttemptedAt;

    private LocalDateTime solvedAt;

    public StudentProblem() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Student getStudent() {
        return student;
    }

    public void setStudent(Student student) {
        this.student = student;
    }

    public Problem getProblem() {
        return problem;
    }

    public void setProblem(Problem problem) {
        this.problem = problem;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public int getAttempts() {
        return attempts;
    }

    public void setAttempts(int attempts) {
        this.attempts = attempts;
    }

    public LocalDateTime getFirstAttemptedAt() {
        return firstAttemptedAt;
    }

    public void setFirstAttemptedAt(LocalDateTime firstAttemptedAt) {
        this.firstAttemptedAt = firstAttemptedAt;
    }

    public LocalDateTime getLastAttemptedAt() {
        return lastAttemptedAt;
    }

    public void setLastAttemptedAt(LocalDateTime lastAttemptedAt) {
        this.lastAttemptedAt = lastAttemptedAt;
    }

    public LocalDateTime getSolvedAt() {
        return solvedAt;
    }

    public void setSolvedAt(LocalDateTime solvedAt) {
        this.solvedAt = solvedAt;
    }
}