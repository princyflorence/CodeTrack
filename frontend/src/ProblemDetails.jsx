import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./Problem.css";

function ProblemDetails() {
    const { id } = useParams();

    const userRole = localStorage.getItem("userRole");
    const isAdmin = userRole === "ADMIN";
    const isStudent = userRole === "STUDENT";

    const [problem, setProblem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [code, setCode] = useState("");
    const [testInput, setTestInput] = useState("");
    const [expectedOutput, setExpectedOutput] = useState("");
    const [testResult, setTestResult] = useState("");

    const [running, setRunning] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // =========================
    // LOAD PROBLEM
    // =========================
    useEffect(() => {
        setLoading(true);
        setError("");

        fetch(`http://localhost:8080/api/problems/${id}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Problem not found");
                }

                return response.json();
            })
            .then((data) => {
                setProblem(data);

                // Automatically use sample input/output
                setTestInput(data.sampleInput || "");
                setExpectedOutput(data.sampleOutput || "");

                setLoading(false);
            })
            .catch((error) => {
                console.error("Problem loading error:", error);
                setError("Unable to load this problem.");
                setLoading(false);
            });
    }, [id]);

    // =========================
    // RUN TEST
    // =========================
    const handleRunTest = async () => {
        if (!code.trim()) {
            setTestResult("⚠️ Please write your code first.");
            return;
        }

        if (!testInput.trim()) {
            setTestResult("⚠️ Please enter test input.");
            return;
        }

        if (!expectedOutput.trim()) {
            setTestResult("⚠️ Please enter expected output.");
            return;
        }

        setRunning(true);
        setTestResult("⏳ Running your test...");

        try {
            const response = await fetch(
                "http://localhost:8080/api/code/run",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        code,
                        input: testInput,
                        expectedOutput,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Server error");
            }

            if (data.success) {
                setTestResult(
                    `✅ ${data.message} Status: ${data.status}`
                );
            } else {
                setTestResult(`❌ ${data.message}`);
            }
        } catch (error) {
            console.error("Run test error:", error);

            setTestResult(
                "❌ Unable to connect to the backend server."
            );
        } finally {
            setRunning(false);
        }
    };

    // =========================
    // SUBMIT SOLUTION
    // =========================
    const handleSubmit = async () => {
        if (!isStudent) {
            return;
        }

        if (!code.trim()) {
            setTestResult(
                "⚠️ Please write your code before submitting."
            );
            return;
        }

        const studentId =
            localStorage.getItem("studentId") ||
            localStorage.getItem("currentStudentId") ||
            localStorage.getItem("userId");

        if (!studentId) {
            setTestResult(
                "⚠️ Student login information not found. Please login again."
            );
            return;
        }

        setSubmitting(true);
        setTestResult("⏳ Submitting your solution...");

        try {
            const response = await fetch(
                "http://localhost:8080/api/student-problems/submit",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        studentId: Number(studentId),
                        problemId: Number(id),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message || "Unable to submit solution."
                );
            }

            if (data.success) {
                setTestResult(
                    `🎉 ${data.message} Attempts: ${data.attempts}`
                );
            } else {
                setTestResult(`❌ ${data.message}`);
            }
        } catch (error) {
            console.error("Submit solution error:", error);

            setTestResult(
                `❌ ${
                    error.message ||
                    "Unable to submit solution. Please check whether the backend is running."
                }`
            );
        } finally {
            setSubmitting(false);
        }
    };

    // =========================
    // LOADING
    // =========================
    if (loading) {
        return (
            <div className="problem-page">
                <ProblemNavbar isAdmin={isAdmin} />

                <main className="problem-loading">
                    <div className="loading-spinner"></div>

                    <h2>Loading problem...</h2>

                    <p>
                        Please wait while we load the problem.
                    </p>
                </main>
            </div>
        );
    }

    // =========================
    // ERROR
    // =========================
    if (error || !problem) {
        return (
            <div className="problem-page">
                <ProblemNavbar isAdmin={isAdmin} />

                <main className="problem-error">
                    <div className="error-icon">!</div>

                    <p className="problem-eyebrow">
                        CODETRACK
                    </p>

                    <h1>Problem Not Found</h1>

                    <p>
                        {error || "Unable to load this problem."}
                    </p>

                    <Link
                        to={
                            isAdmin
                                ? "/admin/problems"
                                : "/problems"
                        }
                        className="problem-primary-button"
                    >
                        ← Back to Problems
                    </Link>
                </main>
            </div>
        );
    }

    const difficultyClass =
        problem.difficulty?.toLowerCase() || "easy";

    return (
        <div className="problem-page">

            {/* =========================
                NAVBAR
            ========================= */}
            <ProblemNavbar isAdmin={isAdmin} />

            <main className="problem-container">

                {/* BACK LINK */}
                <Link
                    to={
                        isAdmin
                            ? "/admin/problems"
                            : "/problems"
                    }
                    className="problem-back-link"
                >
                    ← Back to Problems
                </Link>

                {/* =========================
                    PROBLEM HEADER
                ========================= */}
                <section className="problem-header-card">

                    <div className="problem-header-content">

                        <div className="problem-header-meta">

                            <span className="problem-topic-label">
                                {problem.topic}
                            </span>

                            <span
                                className={`problem-difficulty ${difficultyClass}`}
                            >
                                {problem.difficulty}
                            </span>

                        </div>

                        <p className="problem-eyebrow">
                            CODING PROBLEM
                        </p>

                        <h1>{problem.title}</h1>

                        <p className="problem-header-description">
                            {problem.description}
                        </p>

                    </div>

                    <div className="problem-number-box">

                        <span>PROBLEM</span>

                        <strong>
                            #{problem.id}
                        </strong>

                    </div>

                </section>

                {/* =========================
                    CODING LAYOUT
                ========================= */}
                <section className="coding-layout">

                    {/* =========================
                        PROBLEM DESCRIPTION
                    ========================= */}
                    <div className="problem-description-card">

                        <div className="card-title">

                            <div className="title-icon">
                                ?
                            </div>

                            <div>
                                <span>PROBLEM</span>

                                <h2>
                                    Problem Description
                                </h2>
                            </div>

                        </div>

                        <div className="description-content">

                            <p className="description-main">
                                {problem.description}
                            </p>

                            {problem.inputFormat && (
                                <div className="info-block">

                                    <h3>
                                        Input
                                    </h3>

                                    <pre>
                                        {problem.inputFormat}
                                    </pre>

                                </div>
                            )}

                            {problem.outputFormat && (
                                <div className="info-block">

                                    <h3>
                                        Output
                                    </h3>

                                    <pre>
                                        {problem.outputFormat}
                                    </pre>

                                </div>
                            )}

                            {problem.constraints && (
                                <div className="info-block">

                                    <h3>
                                        Constraints
                                    </h3>

                                    <pre>
                                        {problem.constraints}
                                    </pre>

                                </div>
                            )}

                            {problem.sampleInput && (
                                <div className="info-block">

                                    <h3>
                                        Sample Input
                                    </h3>

                                    <pre>
                                        {problem.sampleInput}
                                    </pre>

                                </div>
                            )}

                            {problem.sampleOutput && (
                                <div className="info-block">

                                    <h3>
                                        Sample Output
                                    </h3>

                                    <pre>
                                        {problem.sampleOutput}
                                    </pre>

                                </div>
                            )}

                        </div>

                    </div>

                    {/* =========================
                        CODE EDITOR
                    ========================= */}
                    <div className="coding-card">

                        <div className="coding-card-header">

                            <div>

                                <span>
                                    SOLUTION
                                </span>

                                <h2>
                                    {isAdmin
                                        ? "View & Test Code"
                                        : "Write Your Code"}
                                </h2>

                            </div>

                            <span className="language-badge">
                                Java
                            </span>

                        </div>

                        <div className="editor-wrapper">

                            <div className="editor-topbar">

                                <div className="editor-file">

                                    <span className="file-dot"></span>

                                    Main.java

                                </div>

                                <span>
                                    Java 17
                                </span>

                            </div>

                            <textarea
                                className="code-editor"
                                value={code}
                                onChange={(event) =>
                                    setCode(event.target.value)
                                }
                                placeholder={`// Write your Java solution here...

public class Solution {

    public static void main(String[] args) {

        // Your code here

    }
}`}
                                spellCheck="false"
                            />

                        </div>

                        {/* =========================
                            TEST BENCH
                        ========================= */}
                        <div className="test-bench">

                            <div className="test-bench-header">

                                <div>

                                    <span>
                                        TEST BENCH
                                    </span>

                                    <h3>
                                        Test Your Solution
                                    </h3>

                                </div>

                                <span className="test-info">
                                    Manual Test
                                </span>

                            </div>

                            <div className="test-input-grid">

                                {/* TEST INPUT */}
                                <div className="test-field">

                                    <label>
                                        Test Input
                                    </label>

                                    <textarea
                                        value={testInput}
                                        onChange={(event) =>
                                            setTestInput(
                                                event.target.value
                                            )
                                        }
                                        placeholder={
                                            problem.sampleInput ||
                                            "Enter test input"
                                        }
                                        rows="5"
                                        spellCheck="false"
                                    />

                                </div>

                                {/* EXPECTED OUTPUT */}
                                <div className="test-field">

                                    <label>
                                        Expected Output
                                    </label>

                                    <textarea
                                        value={expectedOutput}
                                        onChange={(event) =>
                                            setExpectedOutput(
                                                event.target.value
                                            )
                                        }
                                        placeholder={
                                            problem.sampleOutput ||
                                            "Enter expected output"
                                        }
                                        rows="5"
                                        spellCheck="false"
                                    />

                                </div>

                            </div>

                            {/* =========================
                                ACTION BUTTONS
                            ========================= */}
                            <div className="coding-actions">

                                <button
                                    className="run-button"
                                    onClick={handleRunTest}
                                    disabled={running}
                                >
                                    {running
                                        ? "⏳ Running..."
                                        : "▶ Run Test"}
                                </button>

                                {isStudent && (
                                    <button
                                        className="submit-button"
                                        onClick={handleSubmit}
                                        disabled={submitting}
                                    >
                                        {submitting
                                            ? "⏳ Submitting..."
                                            : "Submit Solution →"}
                                    </button>
                                )}

                            </div>

                            {/* TEST RESULT */}
                            {testResult && (
                                <div className="test-result">

                                    <span>
                                        TEST RESULT
                                    </span>

                                    <p>
                                        {testResult}
                                    </p>

                                </div>
                            )}

                        </div>

                    </div>

                </section>

            </main>

            <footer className="problem-footer">
                © 2026 CodeTrack • Coding Progress Management System
            </footer>

        </div>
    );
}


// =====================================================
// PROBLEM NAVBAR
// =====================================================

function ProblemNavbar({ isAdmin }) {

    // FIX: define isStudent inside this component
    const isStudent = !isAdmin;

    const dashboardPath = isAdmin
        ? "/admin"
        : "/student";

    const problemsPath = isAdmin
        ? "/admin/problems"
        : "/problems";

    return (
        <nav className="problem-navbar">

            {/* LOGO */}
            <Link
                to={dashboardPath}
                className="problem-logo"
            >

                <div className="problem-logo-icon">
                    C
                </div>

                <div>

                    <strong>
                        CodeTrack
                    </strong>

                    <span>
                        Coding Progress Platform
                    </span>

                </div>

            </Link>

            {/* NAVIGATION */}
            <div className="problem-nav-links">

                <Link to={dashboardPath}>
                    Dashboard
                </Link>

                <Link
                    to={problemsPath}
                    className="active"
                >
                    Problems
                </Link>

                {isStudent && (
                    <Link to="/student?view=progress">
                        Progress
                    </Link>
                )}

                {isAdmin && (
                    <Link to="/students">
                        Students
                    </Link>
                )}

            </div>

            {/* SIGN OUT */}
            <Link
                to="/login"
                className="problem-role-button"
                onClick={() => {
                    localStorage.clear();
                }}
            >
                Sign Out
            </Link>

        </nav>
    );
}

export default ProblemDetails;