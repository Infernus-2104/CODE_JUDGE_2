package com.codejudge.judge.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;
import java.util.List;

@Document(collection = "submissions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Submission {

    @Id
    private String id;

    private String problemId;

    private String username;

    private String language;   // python / cpp / java

    private String code;

    private String status;     // Accepted / WA / TLE / CE / RE

    private long executionTime;

    private long memoryUsed;

    private String compilationError;

    private List<SubmissionResult> results;

    private Instant createdAt;
}