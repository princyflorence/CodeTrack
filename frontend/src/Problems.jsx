import { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import "./Problems.css";

function Problems() {
    const navigate = useNavigate();

    const studentId = localStorage.getItem("studentId");
    const userRole = localStorage.getItem("userRole");
    const studentName =
        localStorage.getItem("studentName") || "Student";
    const adminEmail =
        localStorage.getItem("adminEmail") || "Teacher";

    const isStudent = userRole === "STUDENT";
    const isAdmin = userRole === "ADMIN";

    const [search, setSearch] = useState("");
    const [difficulty, setDifficulty] = useState("All");
    const [topic, setTopic] = useState("All");

    const [problems, setProblems] = useState([]);
    const [studentProblems, setStudentProblems] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    /* =========================================
       CHECK LOGIN
    ========================================= */

    if (
        (isStudent && !studentId) ||
        (!isStudent && !isAdmin)
    ) {
        return <Navigate to="/login" replace />;
    }

    /* =========================================
       ROLE BASED PATHS
    ========================================= */

    const dashboardPath = isAdmin
        ? "/admin"
        : "/student";

    const problemsPath = isAdmin
        ? "/admin/problems"
        : "/problems";

    /* =========================================
       LOAD PROBLEMS
    ========================================= */

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError("");

                const problemsResponse = await fetch(
                    "http://localhost:8080/api/problems"
                );

                if (!problemsResponse.ok) {
                    throw new Error(
                        "Unable to load problems"
                    );
                }

                const problemsData =
                    await problemsResponse.json();

                setProblems(problemsData);

                /*
                 * Only students need student progress.
                 * Admin should NOT call the student endpoint.
                 */
                if (isStudent) {
                    const studentProblemsResponse =
                        await fetch(
                            `http://localhost:8080/api/student-problems/student/${studentId}`
                        );

                    if (studentProblemsResponse.ok) {
                        const studentProblemsData =
                            await studentProblemsResponse.json();

                        setStudentProblems(
                            studentProblemsData
                        );
                    } else {
                        setStudentProblems([]);
                    }
                } else {
                    setStudentProblems([]);
                }
            } catch (error) {
                console.error(
                    "Error loading problems:",
                    error
                );

                setError(
                    "Unable to load problems. Please check whether the backend is running."
                );
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [isStudent, studentId]);

    /* =========================================
       SIGN OUT
    ========================================= */

    const handleSignOut = () => {
        localStorage.removeItem("studentId");
        localStorage.removeItem("studentName");
        localStorage.removeItem("studentEmail");
        localStorage.removeItem("userRole");
        localStorage.removeItem("adminEmail");

        navigate("/login", {
            replace: true,
        });
    };

    /* =========================================
       FILTER PROBLEMS
    ========================================= */

    const filteredProblems = problems.filter(
        (problem) => {
            const matchesSearch =
                problem.title
                    ?.toLowerCase()
                    .includes(search.toLowerCase());

            const matchesDifficulty =
                difficulty === "All" ||
                problem.difficulty === difficulty;

            const matchesTopic =
                topic === "All" ||
                problem.topic === topic;

            return (
                matchesSearch &&
                matchesDifficulty &&
                matchesTopic
            );
        }
    );

    /* =========================================
       GET STUDENT PROBLEM STATUS
    ========================================= */

    const getProblemStatus = (problemId) => {
        if (!isStudent) {
            return "NOT_ATTEMPTED";
        }

        const studentProblem =
            studentProblems.find(
                (item) =>
                    String(item.problemId) ===
                    String(problemId)
            );

        if (!studentProblem) {
            return "NOT_ATTEMPTED";
        }

        return (
            studentProblem.status ||
            "NOT_ATTEMPTED"
        );
    };

    /* =========================================
       STATUS TEXT
    ========================================= */

    const getStatusText = (status) => {
        if (status === "SOLVED") {
            return "Solved";
        }

        if (status === "ATTEMPTED") {
            return "Attempted";
        }

        if (status === "IN_PROGRESS") {
            return "In Progress";
        }

        return "Not Started";
    };

    /* =========================================
       STATUS CLASS
    ========================================= */

    const getStatusClass = (status) => {
        if (status === "SOLVED") {
            return "solved";
        }

        if (
            status === "ATTEMPTED" ||
            status === "IN_PROGRESS"
        ) {
            return "attempted";
        }

        return "not-started";
    };

    /* =========================================
       TOPIC LIST
    ========================================= */

    const topics = [
        ...new Set(
            problems
                .map((problem) => problem.topic)
                .filter(Boolean)
        ),
    ];

    /* =========================================
       CLEAR FILTERS
    ========================================= */

    const clearFilters = () => {
        setSearch("");
        setDifficulty("All");
        setTopic("All");
    };

    /* =========================================
       LOADING
    ========================================= */

    if (loading) {
        return (
            <div className="problems-page">

                <nav className="problems-navbar">

                    <Link
                        to={dashboardPath}
                        className="problems-logo"
                    >
                        <div className="problems-logo-icon">
                            C
                        </div>

                        <div>
                            <strong>
                                CodeTrack
                            </strong>

                            <span>
                                Practice • Learn • Grow
                            </span>
                        </div>
                    </Link>

                </nav>

                <main className="problems-container">

                    <div className="problems-loading">

                        <div className="loading-spinner"></div>

                        <h2>
                            Loading problems
                        </h2>

                        <p>
                            Please wait while we prepare
                            your coding practice.
                        </p>

                    </div>

                </main>

            </div>
        );
    }

    /* =========================================
       ERROR
    ========================================= */

    if (error) {
        return (
            <div className="problems-page">

                <nav className="problems-navbar">

                    <Link
                        to={dashboardPath}
                        className="problems-logo"
                    >
                        <div className="problems-logo-icon">
                            C
                        </div>

                        <div>
                            <strong>
                                CodeTrack
                            </strong>

                            <span>
                                Practice • Learn • Grow
                            </span>
                        </div>
                    </Link>

                    <button
                        type="button"
                        className="switch-role"
                        onClick={handleSignOut}
                    >
                        Sign Out
                    </button>

                </nav>

                <main className="problems-container">

                    <div className="problems-error">

                        <div className="error-icon">
                            !
                        </div>

                        <h1>
                            Unable to load problems
                        </h1>

                        <p>
                            {error}
                        </p>

                        <button
                            type="button"
                            className="primary-action-button"
                            onClick={() =>
                                window.location.reload()
                            }
                        >
                            Try Again
                        </button>

                    </div>

                </main>

            </div>
        );
    }

    /* =========================================
       MAIN PAGE
    ========================================= */

    return (
        <div className="problems-page">

            {/* =========================
                NAVBAR
            ========================= */}

            <nav className="problems-navbar">

                <Link
                    to={dashboardPath}
                    className="problems-logo"
                >
                    <div className="problems-logo-icon">
                        C
                    </div>

                    <div>
                        <strong>
                            CodeTrack
                        </strong>

                        <span>
                            Practice • Learn • Grow
                        </span>
                    </div>
                </Link>


                {/* =========================
                    NAVIGATION
                ========================= */}

                <div className="problems-nav-links">

                    <Link
                        to={dashboardPath}
                        className={
                            isAdmin
                                ? ""
                                : ""
                        }
                    >
                        Dashboard
                    </Link>

                    <Link
                        to={problemsPath}
                        className="active-link"
                    >
                        Problems
                    </Link>

                    {isStudent ? (
                        <Link to="/student?view=progress">
                            Progress
                        </Link>
                    ) : (
                        <Link to="/students">
                            Students
                        </Link>
                    )}

                </div>


                {/* =========================
                    PROFILE
                ========================= */}

                <div className="problems-profile">

                    <div className="problems-avatar">
                        {(isAdmin
                                ? adminEmail
                                : studentName
                        )
                            .charAt(0)
                            .toUpperCase()}
                    </div>

                    <div className="problems-profile-info">

                        <strong>
                            {isAdmin
                                ? "Admin"
                                : studentName}
                        </strong>

                        <span>
                            {isAdmin
                                ? adminEmail
                                : "Student"}
                        </span>

                    </div>

                    <button
                        type="button"
                        className="switch-role"
                        onClick={handleSignOut}
                    >
                        Sign Out
                    </button>

                </div>

            </nav>


            {/* =========================
                PAGE CONTENT
            ========================= */}

            <main className="problems-container">

                {/* =========================
                    HEADER
                ========================= */}

                <div className="problems-header">

                    <div className="problems-header-content">

                        <p className="page-label">
                            {isAdmin
                                ? "PROBLEM MANAGEMENT"
                                : "PRACTICE ARENA"}
                        </p>

                        <h1>
                            {isAdmin
                                ? "Manage Problems"
                                : "Coding Problems"}
                        </h1>

                        <p className="page-description">
                            {isAdmin
                                ? "View and manage the coding problems available to your students."
                                : "Challenge yourself, strengthen your coding skills, and track your progress."}
                        </p>

                    </div>

                    <div className="problem-count">

                        <strong>
                            {filteredProblems.length}
                        </strong>

                        <span>
                            {filteredProblems.length === 1
                                ? "Problem"
                                : "Problems"}
                        </span>

                    </div>

                </div>


                {/* =========================
                    FILTER BAR
                ========================= */}

                <div className="problem-filter-bar">

                    <div className="search-wrapper">

                        <span className="search-icon">
                            🔍
                        </span>

                        <input
                            type="text"
                            placeholder="Search problems..."
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                        />

                    </div>


                    <select
                        value={topic}
                        onChange={(event) =>
                            setTopic(
                                event.target.value
                            )
                        }
                    >

                        <option value="All">
                            All Topics
                        </option>

                        {topics.map(
                            (topicName) => (
                                <option
                                    key={topicName}
                                    value={topicName}
                                >
                                    {topicName}
                                </option>
                            )
                        )}

                    </select>


                    <select
                        value={difficulty}
                        onChange={(event) =>
                            setDifficulty(
                                event.target.value
                            )
                        }
                    >

                        <option value="All">
                            All Difficulties
                        </option>

                        <option value="Easy">
                            Easy
                        </option>

                        <option value="Medium">
                            Medium
                        </option>

                        <option value="Hard">
                            Hard
                        </option>

                    </select>


                    {(search ||
                        difficulty !== "All" ||
                        topic !== "All") && (

                        <button
                            type="button"
                            className="clear-filter-button"
                            onClick={clearFilters}
                        >
                            Clear
                        </button>

                    )}

                </div>


                {/* =========================
                    RESULTS INFO
                ========================= */}

                <div className="results-info">

                    <span>
                        Showing{" "}
                        <strong>
                            {filteredProblems.length}
                        </strong>{" "}
                        of{" "}
                        <strong>
                            {problems.length}
                        </strong>{" "}
                        problems
                    </span>

                    {(search ||
                        difficulty !== "All" ||
                        topic !== "All") && (

                        <span className="filter-active">
                            Filters active
                        </span>

                    )}

                </div>


                {/* =========================
                    PROBLEM TABLE
                ========================= */}

                <div className="problem-table-wrapper">

                    <table className="problem-table">

                        <thead>

                        <tr>

                            <th className="number-column">
                                #
                            </th>

                            <th>
                                Problem
                            </th>

                            <th>
                                Topic
                            </th>

                            <th>
                                Difficulty
                            </th>

                            <th>
                                {isAdmin
                                    ? "Availability"
                                    : "Status"}
                            </th>

                            <th className="action-column">
                                Action
                            </th>

                        </tr>

                        </thead>


                        <tbody>

                        {filteredProblems.map(
                            (problem) => {

                                const status =
                                    getProblemStatus(
                                        problem.id
                                    );

                                return (
                                    <tr
                                        key={
                                            problem.id
                                        }
                                    >

                                        {/* NUMBER */}

                                        <td className="problem-number">
                                            {String(
                                                problem.id
                                            ).padStart(
                                                2,
                                                "0"
                                            )}
                                        </td>


                                        {/* PROBLEM */}

                                        <td>

                                            <div className="problem-name">

                                                <strong>
                                                    {
                                                        problem.title
                                                    }
                                                </strong>

                                                <span>
                                                    {isAdmin
                                                        ? "Managed problem"
                                                        : "Practice problem"}
                                                </span>

                                            </div>

                                        </td>


                                        {/* TOPIC */}

                                        <td>

                                            <span className="topic-badge">
                                                {
                                                    problem.topic ||
                                                    "General"
                                                }
                                            </span>

                                        </td>


                                        {/* DIFFICULTY */}

                                        <td>

                                            <span
                                                className={`difficulty-badge ${
                                                    problem.difficulty
                                                        ?.toLowerCase() ||
                                                    "easy"
                                                }`}
                                            >
                                                {
                                                    problem.difficulty ||
                                                    "Easy"
                                                }
                                            </span>

                                        </td>


                                        {/* STATUS / AVAILABILITY */}

                                        <td>

                                            {isAdmin ? (

                                                <span className="status-badge solved">
                                                    <span className="status-dot">
                                                        ●
                                                    </span>

                                                    Available
                                                </span>

                                            ) : (

                                                <span
                                                    className={`status-badge ${getStatusClass(
                                                        status
                                                    )}`}
                                                >

                                                    <span className="status-dot">
                                                        ●
                                                    </span>

                                                    {getStatusText(
                                                        status
                                                    )}

                                                </span>

                                            )}

                                        </td>


                                        {/* ACTION */}

                                        <td>

                                            <Link
                                                to={`/problem/${problem.id}`}
                                                className="solve-link"
                                            >

                                                <span>
                                                    {isAdmin
                                                        ? "View"
                                                        : status ===
                                                        "SOLVED"
                                                            ? "View"
                                                            : "Solve"}
                                                </span>

                                                <span>
                                                    →
                                                </span>

                                            </Link>

                                        </td>

                                    </tr>
                                );
                            }
                        )}

                        </tbody>

                    </table>


                    {/* EMPTY STATE */}

                    {filteredProblems.length ===
                        0 && (

                            <div className="empty-problems">

                                <div className="empty-icon">
                                    🔍
                                </div>

                                <h3>
                                    No problems found
                                </h3>

                                <p>
                                    We couldn't find any
                                    problems matching your
                                    current filters.
                                </p>

                                <button
                                    type="button"
                                    className="primary-action-button"
                                    onClick={clearFilters}
                                >
                                    Clear Filters
                                </button>

                            </div>

                        )}

                </div>

            </main>


            {/* =========================
                FOOTER
            ========================= */}

            <footer className="problems-footer">

                <span>
                    © 2026 CodeTrack
                </span>

                <span>
                    Coding Progress Management System
                </span>

            </footer>

        </div>
    );
}

export default Problems;