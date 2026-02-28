package com.codejudge.judge.controller;

import com.codejudge.judge.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiService aiService;

    @PostMapping("/explain")
    public Map<String, String> explain(@RequestBody AiRequest request) {

        String explanation = aiService.explain(
                request.code,
                request.language,
                request.status,
                request.error,
                request.expectedOutput,
                request.userOutput
        );

        return Map.of("explanation", explanation);
    }

    static class AiRequest {
        public String code;
        public String language;
        public String status;
        public String error;
        public String expectedOutput;
        public String userOutput;
    }
}