package com.codejudge.judge.service;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
@RequiredArgsConstructor
public class AiService {

    @Value("${gemini.api-key}")
    private String apiKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public String explain(
            String code,
            String language,
            String status,
            String error,
            String expected,
            String userOutput
    ) {

        String prompt = """
You are a competitive programming assistant.

Language: %s
Submission Status: %s

Code:
%s

Error:
%s

Expected Output:
%s

User Output:
%s

Explain:
1. Why it failed
2. What mistake was made
3. How to fix it
4. Provide corrected code
""".formatted(
                language,
                status,
                code,
                error == null ? "None" : error,
                expected == null ? "N/A" : expected,
                userOutput == null ? "N/A" : userOutput
        );

        String url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" + apiKey;

        Map<String, Object> body = Map.of(
                "contents", List.of(
                        Map.of(
                                "parts", List.of(
                                        Map.of("text", prompt)
                                )
                        )
                )
        );

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request =
                new HttpEntity<>(body, headers);

        ResponseEntity<Map> response =
                restTemplate.postForEntity(url, request, Map.class);

        Map data = response.getBody();

        List candidates = (List) data.get("candidates");
        Map first = (Map) candidates.get(0);
        Map content = (Map) first.get("content");
        List parts = (List) content.get("parts");
        Map textPart = (Map) parts.get(0);

        return (String) textPart.get("text");
    }
}