package com.codejudge.judge.util;

import java.io.*;
import java.nio.file.*;
import java.util.concurrent.*;

public class CodeExecutor {

    private static final String TEMP_DIR = "temp";

    static {
        try {
            Files.createDirectories(Paths.get(TEMP_DIR));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public static ExecutionResult execute(
            String language,
            String code,
            String input,
            int timeLimit
    ) throws Exception {

        String fileName = "Solution";
        Path sourceFile;

        ProcessBuilder compileBuilder = null;
        ProcessBuilder runBuilder;

        // ============================
        // 🐍 PYTHON
        // ============================
        if (language.equals("python")) {

            sourceFile = Paths.get(TEMP_DIR, fileName + ".py");
            Files.writeString(sourceFile, code);

            runBuilder = new ProcessBuilder(
                    "python",
                    sourceFile.toAbsolutePath().toString()
            );
        }

        // ============================
        // 💻 C++
        // ============================
        else if (language.equals("cpp")) {

            sourceFile = Paths.get(TEMP_DIR, fileName + ".cpp");
            Files.writeString(sourceFile, code);

            compileBuilder = new ProcessBuilder(
                    "g++",
                    sourceFile.toAbsolutePath().toString(),
                    "-o",
                    TEMP_DIR + "/solution"
            );

            Process compileProcess = compileBuilder.start();
            String compileError = readStream(compileProcess.getErrorStream());

            if (compileProcess.waitFor() != 0) {
                return ExecutionResult.compilationError(compileError);
            }

            runBuilder = new ProcessBuilder(
                    TEMP_DIR + "/solution"
            );
        }

        // ============================
        // ☕ JAVA
        // ============================
        else if (language.equals("java")) {

            sourceFile = Paths.get(TEMP_DIR, fileName + ".java");
            Files.writeString(sourceFile, code);

            compileBuilder = new ProcessBuilder(
                    "javac",
                    sourceFile.toAbsolutePath().toString()
            );

            Process compileProcess = compileBuilder.start();
            String compileError = readStream(compileProcess.getErrorStream());

            if (compileProcess.waitFor() != 0) {
                return ExecutionResult.compilationError(compileError);
            }

            runBuilder = new ProcessBuilder(
                    "java",
                    "-cp",
                    TEMP_DIR,
                    "Solution"
            );
        }

        else {
            throw new RuntimeException("Unsupported language");
        }

        // ============================
        // 🚀 RUN PROGRAM
        // ============================

        long startTime = System.currentTimeMillis();
        Process process = runBuilder.start();

        // Send input
        try (BufferedWriter writer =
                     new BufferedWriter(
                             new OutputStreamWriter(process.getOutputStream()))) {
            writer.write(input);
            writer.flush();
        }

        ExecutorService executor = Executors.newSingleThreadExecutor();

        Future<Integer> future = executor.submit(() -> process.waitFor());

        try {
            future.get(timeLimit, TimeUnit.MILLISECONDS);
        } catch (TimeoutException e) {
            process.destroyForcibly();
            executor.shutdownNow();
            return ExecutionResult.tle();
        }

        long endTime = System.currentTimeMillis();
        long executionTime = endTime - startTime;

        String output = readStream(process.getInputStream());
        String runtimeError = readStream(process.getErrorStream());

        executor.shutdown();

        if (!runtimeError.isEmpty()) {
            return ExecutionResult.runtimeError(runtimeError);
        }

        return ExecutionResult.success(output, executionTime);
    }

    private static String readStream(InputStream stream)
            throws IOException {

        BufferedReader reader =
                new BufferedReader(new InputStreamReader(stream));

        StringBuilder sb = new StringBuilder();
        String line;

        while ((line = reader.readLine()) != null) {
            sb.append(line).append("\n");
        }

        return sb.toString().trim();
    }
}