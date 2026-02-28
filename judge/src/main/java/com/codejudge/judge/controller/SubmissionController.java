package com.codejudge.judge.controller;

import com.codejudge.judge.model.Submission;
import com.codejudge.judge.repository.SubmissionRepository;
import com.codejudge.judge.service.JudgeService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submissions")
@RequiredArgsConstructor
public class SubmissionController {

    private final JudgeService judgeService;
    private final SubmissionRepository submissionRepository;

    @PostMapping("/submit")
    public Submission submit(
            @RequestBody SubmitRequest request,
            Authentication authentication
    ) throws Exception {

        return judgeService.judge(
                request.getProblemId(),
                authentication.getName(),
                request.getLanguage(),
                request.getCode()
        );
    }

    @GetMapping("/{problemId}")
    public List<Submission> history(@PathVariable String problemId) {
        return submissionRepository
                .findByProblemIdOrderByCreatedAtDesc(problemId);
    }

    static class SubmitRequest {
        public String problemId;
        public String language;
        public String code;

        public String getProblemId() { return problemId; }
        public String getLanguage() { return language; }
        public String getCode() { return code; }
    }
}