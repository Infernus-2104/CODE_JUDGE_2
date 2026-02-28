package com.codejudge.judge.util;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ExecutionResult {

    private String status;
    private String output;
    private String error;
    private long executionTime;

    public static ExecutionResult success(String output, long time) {
        return ExecutionResult.builder()
                .status("OK")
                .output(output)
                .executionTime(time)
                .build();
    }

    public static ExecutionResult compilationError(String error) {
        return ExecutionResult.builder()
                .status("COMPILATION_ERROR")
                .error(error)
                .build();
    }

    public static ExecutionResult runtimeError(String error) {
        return ExecutionResult.builder()
                .status("RUNTIME_ERROR")
                .error(error)
                .build();
    }

    public static ExecutionResult tle() {
        return ExecutionResult.builder()
                .status("TLE")
                .build();
    }
}