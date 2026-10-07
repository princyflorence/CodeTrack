package com.codetrack.backend.controller;

import org.springframework.web.bind.annotation.*;

import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.*;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api/code")
@CrossOrigin(origins = "*")
public class CodeExecutionController {

    // =========================================================
    // Thread Pool
    // =========================================================

    private final ExecutorService executorService =
            Executors.newFixedThreadPool(4);

    // =========================================================
    // Run Code
    // =========================================================

    @PostMapping("/run")
    public Map<String, Object> runCode(
            @RequestBody Map<String, String> request) {

        Map<String, Object> response = new HashMap<>();

        String code = request.get("code");
        String input = request.get("input");
        String expectedOutput = request.get("expectedOutput");

        // -----------------------------
        // Basic validation
        // -----------------------------

        if (code == null || code.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Please write your code first.");
            return response;
        }

        if (input == null || input.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "Please enter test input.");
            return response;
        }

        if (expectedOutput == null
                || expectedOutput.trim().isEmpty()) {

            response.put("success", false);
            response.put(
                    "message",
                    "Please enter expected output."
            );

            return response;
        }

        // =====================================================
        // Submit code execution as a separate task/thread
        // =====================================================

        Future<Map<String, Object>> future =
                executorService.submit(() ->
                        executeCode(
                                code,
                                input,
                                expectedOutput
                        )
                );

        try {

            // Wait for execution task
            // Maximum execution time = 15 seconds

            return future.get(15, TimeUnit.SECONDS);

        } catch (TimeoutException e) {

            future.cancel(true);

            response.put("success", false);
            response.put("status", "TIMEOUT");
            response.put(
                    "message",
                    "Code execution timed out."
            );

            return response;

        } catch (InterruptedException e) {

            Thread.currentThread().interrupt();

            response.put("success", false);
            response.put("status", "ERROR");
            response.put(
                    "message",
                    "Code execution was interrupted."
            );

            return response;

        } catch (ExecutionException e) {

            response.put("success", false);
            response.put("status", "ERROR");
            response.put(
                    "message",
                    "Unable to execute the code."
            );

            if (e.getCause() != null) {
                response.put(
                        "error",
                        e.getCause().getMessage()
                );
            }

            return response;
        }
    }

    // =========================================================
    // Actual Code Execution
    // =========================================================

    private Map<String, Object> executeCode(
            String code,
            String input,
            String expectedOutput) {

        Map<String, Object> response = new HashMap<>();

        Path tempDirectory = null;

        try {

            // -----------------------------
            // Create temporary directory
            // -----------------------------

            tempDirectory =
                    Files.createTempDirectory(
                            "codetrack-java-"
                    );

            // -----------------------------
            // Find Java class name
            // -----------------------------

            String className =
                    findClassName(code);

            if (className == null) {

                className = "Main";

                code = """
                        public class Main {
                            public static void main(String[] args) throws Exception {
                        """
                        + code
                        + """
                            }
                        }
                        """;
            }

            Path javaFile =
                    tempDirectory.resolve(
                            className + ".java"
                    );

            Files.writeString(
                    javaFile,
                    code,
                    StandardCharsets.UTF_8
            );

            // =================================================
            // Compile Java code
            // =================================================

            ProcessBuilder compileProcess =
                    new ProcessBuilder(
                            "javac",
                            javaFile.toString()
                    );

            compileProcess.directory(
                    tempDirectory.toFile()
            );

            Process compiler =
                    compileProcess.start();

            String compileError =
                    readStream(
                            compiler.getErrorStream()
                    );

            boolean compileFinished =
                    compiler.waitFor(
                            10,
                            TimeUnit.SECONDS
                    );

            if (!compileFinished) {

                compiler.destroyForcibly();

                response.put("success", false);
                response.put(
                        "status",
                        "COMPILE_ERROR"
                );
                response.put(
                        "message",
                        "Compilation timed out."
                );

                return response;
            }

            if (compiler.exitValue() != 0) {

                response.put("success", false);
                response.put(
                        "status",
                        "COMPILE_ERROR"
                );
                response.put(
                        "message",
                        "Compilation failed."
                );
                response.put(
                        "error",
                        compileError
                );

                return response;
            }

            // =================================================
            // Run Java program
            // =================================================

            ProcessBuilder runProcess =
                    new ProcessBuilder(
                            "java",
                            "-cp",
                            tempDirectory.toString(),
                            className
                    );

            runProcess.directory(
                    tempDirectory.toFile()
            );

            Process process =
                    runProcess.start();

            // -----------------------------
            // Send input
            // -----------------------------

            try (
                    BufferedWriter writer =
                            new BufferedWriter(
                                    new OutputStreamWriter(
                                            process.getOutputStream(),
                                            StandardCharsets.UTF_8
                                    )
                            )
            ) {

                writer.write(input);
                writer.newLine();
                writer.flush();
            }

            // -----------------------------
            // Read output
            // -----------------------------

            String output =
                    readStream(
                            process.getInputStream()
                    );

            String runtimeError =
                    readStream(
                            process.getErrorStream()
                    );

            boolean finished =
                    process.waitFor(
                            5,
                            TimeUnit.SECONDS
                    );

            if (!finished) {

                process.destroyForcibly();

                response.put("success", false);
                response.put(
                        "status",
                        "TIMEOUT"
                );
                response.put(
                        "message",
                        "Your program took too long to execute."
                );

                return response;
            }

            // =================================================
            // Runtime error
            // =================================================

            if (process.exitValue() != 0) {

                response.put("success", false);
                response.put(
                        "status",
                        "RUNTIME_ERROR"
                );
                response.put(
                        "message",
                        "Program execution failed."
                );
                response.put(
                        "error",
                        runtimeError
                );

                return response;
            }

            // =================================================
            // Compare output
            // =================================================

            String actual =
                    normalizeOutput(output);

            String expected =
                    normalizeOutput(expectedOutput);

            boolean correct =
                    actual.equals(expected);

            response.put("success", true);

            response.put(
                    "status",
                    correct
                            ? "PASSED"
                            : "FAILED"
            );

            response.put(
                    "actualOutput",
                    output
            );

            response.put(
                    "expectedOutput",
                    expectedOutput
            );

            if (correct) {

                response.put(
                        "message",
                        "Test case passed successfully!"
                );

            } else {

                response.put(
                        "message",
                        "Test case failed. Output does not match."
                );
            }

            return response;

        } catch (Exception e) {

            response.put("success", false);
            response.put(
                    "status",
                    "ERROR"
            );
            response.put(
                    "message",
                    "Unable to execute the code."
            );
            response.put(
                    "error",
                    e.getMessage()
            );

            return response;

        } finally {

            // -----------------------------
            // Delete temporary files
            // -----------------------------

            if (tempDirectory != null) {
                deleteDirectory(tempDirectory);
            }
        }
    }

    // =========================================================
    // Find Java class name
    // =========================================================

    private String findClassName(String code) {

        Pattern publicClassPattern =
                Pattern.compile(
                        "public\\s+class\\s+([A-Za-z_$][A-Za-z0-9_$]*)"
                );

        Matcher publicMatcher =
                publicClassPattern.matcher(code);

        if (publicMatcher.find()) {
            return publicMatcher.group(1);
        }

        Pattern classPattern =
                Pattern.compile(
                        "\\bclass\\s+([A-Za-z_$][A-Za-z0-9_$]*)"
                );

        Matcher matcher =
                classPattern.matcher(code);

        if (matcher.find()) {
            return matcher.group(1);
        }

        return null;
    }

    // =========================================================
    // Read process stream
    // =========================================================

    private String readStream(
            InputStream inputStream)
            throws IOException {

        return new String(
                inputStream.readAllBytes(),
                StandardCharsets.UTF_8
        );
    }

    // =========================================================
    // Normalize output
    // =========================================================

    private String normalizeOutput(
            String output) {

        if (output == null) {
            return "";
        }

        return output
                .replace("\r\n", "\n")
                .replace("\r", "\n")
                .trim()
                .replaceAll("\\s+", " ");
    }

    // =========================================================
    // Delete temporary directory
    // =========================================================

    private void deleteDirectory(
            Path directory) {

        try {

            if (!Files.exists(directory)) {
                return;
            }

            Files.walk(directory)
                    .sorted(
                            (a, b) ->
                                    b.compareTo(a)
                    )
                    .forEach(path -> {

                        try {
                            Files.deleteIfExists(path);
                        } catch (IOException ignored) {
                        }
                    });

        } catch (IOException ignored) {
        }
    }
}