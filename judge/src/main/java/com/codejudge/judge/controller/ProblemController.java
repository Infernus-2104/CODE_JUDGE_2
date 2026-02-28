package com.codejudge.judge.controller;

import com.codejudge.judge.model.Problem;
import com.codejudge.judge.repository.ProblemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/problems")
@RequiredArgsConstructor
public class ProblemController {

    private final ProblemRepository problemRepository;

    @GetMapping
    public List<Problem> getAll() {
        return problemRepository.findAll();
    }

    @GetMapping("/{id}")
    public Problem getById(@PathVariable String id) {
        return problemRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Problem not found"));
    }

    @PostMapping("/create")
    public Problem createProblem(
            @RequestBody Problem problem,
            Authentication authentication
    ) {
        problem.setCreatedBy(authentication.getName());
        return problemRepository.save(problem);
    }
}