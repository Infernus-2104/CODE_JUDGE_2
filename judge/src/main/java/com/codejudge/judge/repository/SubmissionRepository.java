package com.codejudge.judge.repository;

import com.codejudge.judge.model.Submission;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface SubmissionRepository
        extends MongoRepository<Submission, String> {

    List<Submission> findByProblemIdOrderByCreatedAtDesc(String problemId);
}