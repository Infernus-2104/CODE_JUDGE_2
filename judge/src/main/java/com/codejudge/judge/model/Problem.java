package com.codejudge.judge.model;

import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.List;

@Document(collection = "problems")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Problem {

    @Id
    private String id;

    private String title;

    private String description;

    private int timeLimit;     // in milliseconds

    private int memoryLimit;   // in MB

    private List<TestCase> sampleTestcases;

    private List<TestCase> hiddenTestcases;

    private String createdBy;  // username (admin)
}