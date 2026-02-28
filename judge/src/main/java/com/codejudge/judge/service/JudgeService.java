package com.codejudge.judge.service;

import com.codejudge.judge.model.*;
import com.codejudge.judge.repository.*;
import com.codejudge.judge.util.CodeExecutor;
import com.codejudge.judge.util.ExecutionResult;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JudgeService {

    private final ProblemRepository problemRepository;
    private final SubmissionRepository submissionRepository;

    public Submission judge(
            String problemId,
            String username,
            String language,
            String code
    ) throws Exception {

        Problem problem = problemRepository.findById(problemId)
                .orElseThrow(() -> new RuntimeException("Problem not found"));

        List<TestCase> sample =
                problem.getSampleTestcases() != null
                        ? problem.getSampleTestcases()
                        : new ArrayList<>();

        List<TestCase> hidden =
                problem.getHiddenTestcases() != null
                        ? problem.getHiddenTestcases()
                        : new ArrayList<>();

        List<TestCase> allTestcases = new ArrayList<>();
        allTestcases.addAll(sample);
        allTestcases.addAll(hidden);

        if (allTestcases.isEmpty()) {
            throw new RuntimeException("No testcases found");
        }

        List<SubmissionResult> results = new ArrayList<>();

        String finalStatus = "Accepted";
        long maxTime = 0;
        String compilationError = null;

        for (int i = 0; i < allTestcases.size(); i++) {

            TestCase tc = allTestcases.get(i);
            boolean isSample = i < sample.size();

            ExecutionResult executionResult =
                    CodeExecutor.execute(
                            language,
                            code,
                            tc.getInput(),
                            problem.getTimeLimit()
                    );

            // =============================
            // COMPILATION ERROR
            // =============================
            if (executionResult.getStatus().equals("COMPILATION_ERROR")) {

                finalStatus = "Compilation Error";
                compilationError = executionResult.getError();
                break;
            }

            // =============================
            // TLE
            // =============================
            if (executionResult.getStatus().equals("TLE")) {

                finalStatus = "TLE";
                results.add(SubmissionResult.builder()
                        .testcaseNumber(i + 1)
                        .status("TLE")
                        .build());
                break;
            }

            // =============================
            // RUNTIME ERROR
            // =============================
            if (executionResult.getStatus().equals("RUNTIME_ERROR")) {

                finalStatus = "Runtime Error";
                results.add(SubmissionResult.builder()
                        .testcaseNumber(i + 1)
                        .status("Runtime Error")
                        .build());
                break;
            }

            // =============================
            // SUCCESS → Compare Output
            // =============================

            String expected = normalize(tc.getOutput());
            String userOutput = normalize(executionResult.getOutput());

            maxTime = Math.max(maxTime,
                    executionResult.getExecutionTime());

            if (!expected.equals(userOutput)) {

                finalStatus = "Wrong Answer";

                SubmissionResult result =
                        SubmissionResult.builder()
                                .testcaseNumber(i + 1)
                                .status("Wrong Answer")
                                .time(executionResult.getExecutionTime())
                                .build();

                if (isSample) {
                    result.setExpectedOutput(expected);
                    result.setUserOutput(userOutput);
                }

                results.add(result);
                break;
            }

            results.add(
                    SubmissionResult.builder()
                            .testcaseNumber(i + 1)
                            .status("Passed")
                            .time(executionResult.getExecutionTime())
                            .build()
            );
        }

        Submission submission = Submission.builder()
                .problemId(problemId)
                .username(username)
                .language(language)
                .code(code)
                .status(finalStatus)
                .executionTime(maxTime)
                .memoryUsed(0)
                .compilationError(compilationError)
                .results(results)
                .createdAt(Instant.now())
                .build();

        submissionRepository.save(submission);

        return submission;
    }

    private String normalize(String s) {
        if (s == null) return "";
        return s.trim().replace("\r\n", "\n");
    }
}