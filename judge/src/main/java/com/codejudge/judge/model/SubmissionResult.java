package com.codejudge.judge.model;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubmissionResult {

    private int testcaseNumber;

    private String status;  // Passed / Wrong Answer / TLE / Runtime Error

    private long time;      // execution time

    private String expectedOutput;  // only for sample

    private String userOutput;      // only for sample
}