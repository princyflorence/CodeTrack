package com.codetrack.backend.controller;

import com.codetrack.backend.entity.Problem;
import com.codetrack.backend.service.ProblemService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/problems")
@CrossOrigin(origins = "*")
public class ProblemController {

    private final ProblemService problemService;

    public ProblemController(ProblemService problemService) {
        this.problemService = problemService;
    }
    @GetMapping
    public List<Problem> getAllProblems() {
        return problemService.getAllProblems();
    }
    @GetMapping("/{id}")
    public Problem getProblem(@PathVariable Long id) {
        return problemService.getProblemById(id);
    }
    @PostMapping
    public Problem addProblem(@RequestBody Problem problem) {
        return problemService.addProblem(problem);
    }
    @PostMapping("/bulk")
    public List<Problem> addProblems(@RequestBody List<Problem> problems) {
        return problemService.addProblems(problems);
    }
    @DeleteMapping("/{id}")
    public String deleteProblem(@PathVariable Long id) {
        problemService.deleteProblem(id);
        return "Problem deleted successfully";
    }
    @PutMapping("/{id}")
    public Problem updateProblem(@PathVariable Long id, @RequestBody Problem problem) {
        return problemService.updateProblem(id, problem);
    }

}