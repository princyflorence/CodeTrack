
package com.codetrack.backend.service;

import com.codetrack.backend.entity.Problem;
import com.codetrack.backend.repository.ProblemRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class ProblemService {

    private final ProblemRepository problemRepository;

    public ProblemService(ProblemRepository problemRepository) {
        this.problemRepository = problemRepository;
    }

    public List<Problem> getAllProblems() {
        return problemRepository.findAll();
    }

    public Problem getProblemById(Long id) {
        return problemRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Problem not found"
                        )
                );
    }

    // Add one problem
    public Problem addProblem(Problem problem) {

        String title = problem.getTitle().trim();

        if (problemRepository.existsByTitleIgnoreCase(title)) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Problem with title '" + title + "' already exists"
            );
        }

        problem.setTitle(title);

        return problemRepository.save(problem);
    }

    // Add multiple problems
    public List<Problem> addProblems(List<Problem> problems) {

        Set<String> titlesInRequest = new HashSet<>();

        for (Problem problem : problems) {

            String title = problem.getTitle().trim();

            String normalizedTitle = title.toLowerCase();

            // Duplicate inside same request
            if (!titlesInRequest.add(normalizedTitle)) {

                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Duplicate problem in request: " + title
                );
            }

            // Duplicate already in database
            if (problemRepository.existsByTitleIgnoreCase(title)) {

                throw new ResponseStatusException(
                        HttpStatus.CONFLICT,
                        "Problem with title '" + title + "' already exists"
                );
            }

            problem.setTitle(title);
        }

        return problemRepository.saveAll(problems);
    }

    // Delete problem
    public void deleteProblem(Long id) {
        problemRepository.deleteById(id);
    }
    // Update problem
    public Problem updateProblem(Long id, Problem problem) {

        Problem existingProblem = problemRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND,
                                "Problem not found"
                        )
                );

        String title = problem.getTitle().trim();

        if (!existingProblem.getTitle().equalsIgnoreCase(title)
                && problemRepository.existsByTitleIgnoreCase(title)) {

            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Problem with title '" + title + "' already exists"
            );
        }

        existingProblem.setTitle(title);
        existingProblem.setDifficulty(problem.getDifficulty());
        existingProblem.setTopic(problem.getTopic());
        existingProblem.setDescription(problem.getDescription());

        return problemRepository.save(existingProblem);
    }
}