package com.codejudge.judge.repository;

import com.codejudge.judge.model.Problem;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProblemRepository
        extends MongoRepository<Problem, String> {
}