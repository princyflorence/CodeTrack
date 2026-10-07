import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Student.css";

function Student() {
    const location = useLocation();
    const navigate = useNavigate();

    const isProgressPage =
        new URLSearchParams(location.search).get("view") === "progress";

    const [student, setStudent] = useState(null);
    const [studentProblems, setStudentProblems] = useState([]);
    const [problems, setProblems] = useState([]);
    const [students, setStudents] = useState([]);
    const [allStudentProblems, setAllStudentProblems] = useState([]);

    const [loading, setLoading] = useState(true);
    const [profileOpen, setProfileOpen] = useState(false);

    const studentId = localStorage.getItem("studentId");

    useEffect(() => {
        if (!studentId) {
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                const [
                    studentResponse,
                    studentProblemsResponse,
                    problemsResponse,
                    studentsResponse,
                    allStudentProblemsResponse,
                ] = await Promise.all([
                    fetch(
                        `http://localhost:8080/api/students/${studentId}`
                    ),
                    fetch(
                        `http://localhost:8080/api/student-problems/student/${studentId}`
                    ),
                    fetch(
                        "http://localhost:8080/api/problems"
                    ),
                    fetch(
                        "http://localhost:8080/api/students"
                    ),
                    fetch(
                        "http://localhost:8080/api/student-problems"
                    ),
                ]);

                if (studentResponse.ok) {
                    const studentData =
                        await studentResponse.json();

                    setStudent(studentData);
                }

                if (studentProblemsResponse.ok) {
                    const studentProblemsData =
                        await studentProblemsResponse.json();

                    setStudentProblems(
                        studentProblemsData
                    );
                }

                if (problemsResponse.ok) {
                    const problemsData =
                        await problemsResponse.json();

                    setProblems(problemsData);
                }

                if (studentsResponse.ok) {
                    const studentsData =
                        await studentsResponse.json();

                    setStudents(studentsData);
                }

                if (allStudentProblemsResponse.ok) {
                    const allStudentProblemsData =
                        await allStudentProblemsResponse.json();

                    setAllStudentProblems(
                        allStudentProblemsData
                    );
                }
            } catch (error) {
                console.error(
                    "Error fetching student data:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [studentId]);

    /*
     * =========================
     * SIGN OUT
     * =========================
     */

    const handleSignOut = () => {
        localStorage.removeItem("studentId");
        localStorage.removeItem("studentName");
        localStorage.removeItem("studentEmail");
        localStorage.removeItem("userRole");

        setProfileOpen(false);

        navigate("/login", {
            replace: true,
        });
    };

    /*
     * =========================
     * HELPER FUNCTIONS
     * =========================
     */

    /*
     * Gets the problem ID safely.

     * Depending on the backend JSON response,
     * the problem ID can be available as:
     *
     * studentProblem.problem.id
     *
     * OR
     *
     * studentProblem.problemId
     */
    const getProblemId = (studentProblem) => {
        return (
            studentProblem?.problem?.id ??
            studentProblem?.problemId ??
            null
        );
    };

    /*
     * Gets the student ID safely.
     */
    const getStudentId = (studentProblem) => {
        return (
            studentProblem?.student?.id ??
            studentProblem?.studentId ??
            null
        );
    };

    /*
     * Gets the best available activity date.

     * Priority:
     *
     * 1. lastAttemptedAt
     * 2. solvedAt
     * 3. firstAttemptedAt
     *
     * If none exists, return null.
     */
    const getActivityDate = (studentProblem) => {
        return (
            studentProblem?.lastAttemptedAt ||
            studentProblem?.solvedAt ||
            studentProblem?.firstAttemptedAt ||
            null
        );
    };

    /*
     * =========================
     * CALCULATIONS
     * =========================
     */

    const solvedProblems = studentProblems.filter(
        (item) => item.status === "SOLVED"
    );

    const attemptedProblems = studentProblems.filter(
        (item) =>
            item.status &&
            item.status !== "NOT_ATTEMPTED"
    );

    const solvedCount = solvedProblems.length;
    const attemptedCount = attemptedProblems.length;

    const totalProblems = problems.length;

    const progress =
        totalProblems > 0
            ? Math.round(
                (solvedCount / totalProblems) * 100
            )
            : 0;

    /*
     * =========================
     * RANK CALCULATION
     * =========================
     */

    const studentScores = students.map(
        (currentStudent) => {
            const currentStudentProblems =
                allStudentProblems.filter(
                    (item) =>
                        String(
                            getStudentId(item)
                        ) ===
                        String(currentStudent.id) &&
                        item.status === "SOLVED"
                );

            return {
                id: currentStudent.id,
                solved:
                currentStudentProblems.length,
            };
        }
    );

    studentScores.sort(
        (a, b) => b.solved - a.solved
    );

    const currentRank =
        studentScores.findIndex(
            (item) =>
                String(item.id) ===
                String(studentId)
        ) + 1;

    /*
     * =========================
     * RECENT ACTIVITY
     * =========================
     *
     * IMPORTANT:
     *
     * We DO NOT filter only by
     * lastAttemptedAt anymore.
     *
     * This allows older solved problems
     * to appear even when their timestamp
     * is missing.
     */

    const recentProblems = [...studentProblems]
        .filter(
            (item) =>
                item.status &&
                item.status !== "NOT_ATTEMPTED"
        )
        .sort((a, b) => {
            const dateA = getActivityDate(a);
            const dateB = getActivityDate(b);

            /*
             * If both have dates, newest first.
             */
            if (dateA && dateB) {
                return (
                    new Date(dateB) -
                    new Date(dateA)
                );
            }

            /*
             * Records with a date come before
             * records without a date.
             */
            if (dateA && !dateB) {
                return -1;
            }

            if (!dateA && dateB) {
                return 1;
            }

            /*
             * If neither has a timestamp,
             * use the StudentProblem database ID
             * as a fallback.
             *
             * Newer IDs generally represent
             * records created later.
             */
            return (
                Number(b.id || 0) -
                Number(a.id || 0)
            );
        })
        .slice(0, 5);

    /*
     * =========================
     * TOPIC PERFORMANCE
     * =========================
     */

    const topicMap = {};

    studentProblems.forEach(
        (studentProblem) => {
            const problemId =
                getProblemId(studentProblem);

            const problem = problems.find(
                (item) =>
                    String(item.id) ===
                    String(problemId)
            );

            if (!problem) return;

            const topic =
                problem.topic || "Other";

            if (!topicMap[topic]) {
                topicMap[topic] = {
                    total: 0,
                    solved: 0,
                };
            }

            topicMap[topic].total++;

            if (
                studentProblem.status ===
                "SOLVED"
            ) {
                topicMap[topic].solved++;
            }
        }
    );

    const topicPerformance = Object.entries(
        topicMap
    )
        .map(([topic, data]) => ({
            topic,
            total: data.total,
            solved: data.solved,
            percentage:
                data.total > 0
                    ? Math.round(
                        (data.solved /
                            data.total) *
                        100
                    )
                    : 0,
        }))
        .sort(
            (a, b) =>
                b.percentage -
                a.percentage
        );

    /*
     * =========================
     * DIFFICULTY PERFORMANCE
     * =========================
     */

    const difficultyMap = {
        Easy: {
            total: 0,
            solved: 0,
        },
        Medium: {
            total: 0,
            solved: 0,
        },
        Hard: {
            total: 0,
            solved: 0,
        },
    };

    studentProblems.forEach(
        (studentProblem) => {
            const problemId =
                getProblemId(studentProblem);

            const problem = problems.find(
                (item) =>
                    String(item.id) ===
                    String(problemId)
            );

            if (!problem) return;

            const difficulty =
                problem.difficulty ||
                "Easy";

            if (!difficultyMap[difficulty]) {
                difficultyMap[difficulty] = {
                    total: 0,
                    solved: 0,
                };
            }

            difficultyMap[difficulty]
                .total++;

            if (
                studentProblem.status ===
                "SOLVED"
            ) {
                difficultyMap[difficulty]
                    .solved++;
            }
        }
    );

    /*
     * =========================
     * PROFILE DROPDOWN
     * =========================
     */

    const ProfileMenu = () => {
        return (
            <div
                style={{
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                }}
            >
                <button
                    type="button"
                    onClick={() =>
                        setProfileOpen(
                            !profileOpen
                        )
                    }
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        background: "transparent",
                        border: "none",
                        padding: "6px 8px",
                        borderRadius: "12px",
                        cursor: "pointer",
                        fontFamily:
                            "inherit",
                    }}
                >
                    <div className="profile-avatar">
                        {student?.name
                            ? student.name
                                .charAt(0)
                                .toUpperCase()
                            : "S"}
                    </div>

                    <div
                        className="profile-info"
                        style={{
                            textAlign:
                                "left",
                        }}
                    >
                        <span className="profile-name">
                            {student?.name ||
                                "Student"}
                        </span>

                        <span className="profile-role">
                            Student
                        </span>
                    </div>

                    <span
                        style={{
                            fontSize:
                                "12px",
                            marginLeft:
                                "2px",
                            color:
                                "#64748b",
                            transform:
                                profileOpen
                                    ? "rotate(180deg)"
                                    : "rotate(0deg)",
                            transition:
                                "0.2s ease",
                        }}
                    >
                        ▼
                    </span>
                </button>

                {profileOpen && (
                    <div
                        style={{
                            position:
                                "absolute",
                            top:
                                "calc(100% + 10px)",
                            right: 0,
                            width:
                                "270px",
                            background:
                                "#ffffff",
                            border:
                                "1px solid #e5e7eb",
                            borderRadius:
                                "14px",
                            boxShadow:
                                "0 12px 35px rgba(15, 23, 42, 0.15)",
                            padding:
                                "8px",
                            zIndex: 1000,
                        }}
                    >
                        <div
                            style={{
                                display:
                                    "flex",
                                alignItems:
                                    "center",
                                gap:
                                    "12px",
                                padding:
                                    "12px",
                            }}
                        >
                            <div
                                style={{
                                    width:
                                        "46px",
                                    height:
                                        "46px",
                                    borderRadius:
                                        "50%",
                                    background:
                                        "#eef2ff",
                                    color:
                                        "#4f46e5",
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "center",
                                    fontWeight:
                                        "700",
                                    fontSize:
                                        "18px",
                                }}
                            >
                                {student?.name
                                    ? student.name
                                        .charAt(
                                            0
                                        )
                                        .toUpperCase()
                                    : "S"}
                            </div>

                            <div
                                style={{
                                    minWidth:
                                        0,
                                }}
                            >
                                <div
                                    style={{
                                        fontWeight:
                                            "700",
                                        color:
                                            "#172033",
                                        fontSize:
                                            "14px",
                                    }}
                                >
                                    {student?.name ||
                                        "Student"}
                                </div>

                                <div
                                    style={{
                                        color:
                                            "#64748b",
                                        fontSize:
                                            "12px",
                                        marginTop:
                                            "3px",
                                        wordBreak:
                                            "break-word",
                                    }}
                                >
                                    {student?.email ||
                                        localStorage.getItem(
                                            "studentEmail"
                                        ) ||
                                        "No email available"}
                                </div>
                            </div>
                        </div>

                        <div
                            style={{
                                margin:
                                    "4px 8px 8px",
                                padding:
                                    "8px 10px",
                                background:
                                    "#f8fafc",
                                borderRadius:
                                    "8px",
                                color:
                                    "#64748b",
                                fontSize:
                                    "12px",
                            }}
                        >
                            <strong
                                style={{
                                    color:
                                        "#334155",
                                }}
                            >
                                Role:
                            </strong>{" "}
                            Student
                        </div>

                        <div
                            style={{
                                height:
                                    "1px",
                                background:
                                    "#e5e7eb",
                                margin:
                                    "6px 0",
                            }}
                        />

                        <button
                            type="button"
                            onClick={
                                handleSignOut
                            }
                            style={{
                                width:
                                    "100%",
                                display:
                                    "flex",
                                alignItems:
                                    "center",
                                gap:
                                    "10px",
                                padding:
                                    "11px 12px",
                                border:
                                    "none",
                                background:
                                    "transparent",
                                borderRadius:
                                    "9px",
                                color:
                                    "#dc2626",
                                fontSize:
                                    "14px",
                                fontWeight:
                                    "600",
                                cursor:
                                    "pointer",
                                textAlign:
                                    "left",
                                fontFamily:
                                    "inherit",
                            }}
                            onMouseEnter={(
                                event
                            ) => {
                                event.currentTarget.style.background =
                                    "#fef2f2";
                            }}
                            onMouseLeave={(
                                event
                            ) => {
                                event.currentTarget.style.background =
                                    "transparent";
                            }}
                        >
                            <span>
                                🚪
                            </span>

                            <span>
                                Sign Out
                            </span>
                        </button>
                    </div>
                )}
            </div>
        );
    };

    /*
     * =========================
     * LOADING
     * =========================
     */

    if (loading) {
        return (
            <div className="student-page">
                <div className="student-loading">
                    <h2>
                        Loading...
                    </h2>

                    <p>
                        Please wait while we
                        load your dashboard.
                    </p>
                </div>
            </div>
        );
    }

    /*
     * =========================
     * PROGRESS PAGE
     * =========================
     */

    if (isProgressPage) {
        return (
            <div className="student-page">

                <nav className="student-navbar">

                    <div className="student-logo">
                        <span className="logo-icon">
                            &lt;/&gt;
                        </span>

                        <span>
                            CodeTrack
                        </span>
                    </div>

                    <div className="student-nav-links">

                        <Link to="/student">
                            Dashboard
                        </Link>

                        <Link to="/problems">
                            Problems
                        </Link>

                        <Link
                            to="/student?view=progress"
                            className="active"
                        >
                            Progress
                        </Link>

                    </div>

                    <ProfileMenu />

                </nav>

                <section className="student-hero">

                    <div className="hero-content">

                        <p className="hero-small-title">
                            YOUR PROGRESS
                        </p>

                        <h1>
                            Coding Journey
                        </h1>

                        <p>
                            Track your coding
                            performance and keep
                            improving every day.
                        </p>

                    </div>

                    <Link
                        to="/problems"
                        className="hero-button"
                    >
                        Start Practicing
                    </Link>

                </section>

                <section className="student-stats">

                    <div className="stat-card">

                        <div className="stat-icon">
                            ✓
                        </div>

                        <div>
                            <h3>
                                {solvedCount}
                            </h3>

                            <p>
                                Problems Solved
                            </p>
                        </div>

                    </div>

                    <div className="stat-card">

                        <div className="stat-icon">
                            ↗
                        </div>

                        <div>
                            <h3>
                                {attemptedCount}
                            </h3>

                            <p>
                                Problems Attempted
                            </p>
                        </div>

                    </div>

                    <div className="stat-card">

                        <div className="stat-icon">
                            ◉
                        </div>

                        <div>
                            <h3>
                                {progress}%
                            </h3>

                            <p>
                                Overall Progress
                            </p>
                        </div>

                    </div>

                    <div className="stat-card">

                        <div className="stat-icon">
                            #
                        </div>

                        <div>
                            <h3>
                                {currentRank > 0
                                    ? `#${currentRank}`
                                    : "N/A"}
                            </h3>

                            <p>
                                Current Rank
                            </p>
                        </div>

                    </div>

                </section>

                <main className="student-content">

                    <section className="progress-section">

                        <div className="section-header">

                            <div>

                                <p className="section-label">
                                    OVERVIEW
                                </p>

                                <h2>
                                    Overall Progress
                                </h2>

                            </div>

                            <span className="progress-percentage">
                                {progress}%
                            </span>

                        </div>

                        <div className="progress-bar-container">

                            <div
                                className="progress-bar-fill"
                                style={{
                                    width: `${progress}%`,
                                }}
                            ></div>

                        </div>

                        <div className="progress-details">

                            <span>
                                {solvedCount} solved
                            </span>

                            <span>
                                {totalProblems} total
                                problems
                            </span>

                        </div>

                    </section>

                    <section className="progress-section">

                        <div className="section-header">

                            <div>

                                <p className="section-label">
                                    LEADERBOARD
                                </p>

                                <h2>
                                    Your Rank
                                </h2>

                            </div>

                        </div>

                        <div className="rank-card">

                            <div className="rank-number">
                                {currentRank > 0
                                    ? `#${currentRank}`
                                    : "N/A"}
                            </div>

                            <div className="rank-info">

                                <h3>
                                    Keep climbing!
                                </h3>

                                <p>
                                    Solve more problems
                                    to improve your
                                    leaderboard
                                    position.
                                </p>

                            </div>

                        </div>

                    </section>

                    <section className="progress-section">

                        <div className="section-header">

                            <div>

                                <p className="section-label">
                                    PERFORMANCE
                                </p>

                                <h2>
                                    Topic Performance
                                </h2>

                            </div>

                        </div>

                        {topicPerformance.length ===
                        0 ? (
                            <div className="empty-progress">

                                <h3>
                                    No topic data yet
                                </h3>

                                <p>
                                    Start solving
                                    problems to see
                                    your topic
                                    performance.
                                </p>

                            </div>
                        ) : (
                            <div className="topic-list">

                                {topicPerformance.map(
                                    (item) => (
                                        <div
                                            className="topic-item"
                                            key={
                                                item.topic
                                            }
                                        >

                                            <div className="topic-header">

                                                <span>
                                                    {
                                                        item.topic
                                                    }
                                                </span>

                                                <span>
                                                    {
                                                        item.solved
                                                    }
                                                    /
                                                    {
                                                        item.total
                                                    }
                                                </span>

                                            </div>

                                            <div className="topic-bar">

                                                <div
                                                    className="topic-bar-fill"
                                                    style={{
                                                        width: `${item.percentage}%`,
                                                    }}
                                                ></div>

                                            </div>

                                            <div className="topic-percentage">
                                                {
                                                    item.percentage
                                                }
                                                %
                                            </div>

                                        </div>
                                    )
                                )}

                            </div>
                        )}

                    </section>

                    <section className="progress-section">

                        <div className="section-header">

                            <div>

                                <p className="section-label">
                                    SKILL LEVEL
                                </p>

                                <h2>
                                    Difficulty
                                    Performance
                                </h2>

                            </div>

                        </div>

                        <div className="difficulty-grid">

                            {[
                                "Easy",
                                "Medium",
                                "Hard",
                            ].map(
                                (difficulty) => {

                                    const data =
                                        difficultyMap[
                                            difficulty
                                            ];

                                    const percentage =
                                        data.total >
                                        0
                                            ? Math.round(
                                                (data.solved /
                                                    data.total) *
                                                100
                                            )
                                            : 0;

                                    return (
                                        <div
                                            className="difficulty-card"
                                            key={
                                                difficulty
                                            }
                                        >

                                            <h3>
                                                {
                                                    difficulty
                                                }
                                            </h3>

                                            <div className="difficulty-number">
                                                {
                                                    data.solved
                                                }
                                            </div>

                                            <p>
                                                of{" "}
                                                {
                                                    data.total
                                                }{" "}
                                                solved
                                            </p>

                                            <div className="difficulty-bar">

                                                <div
                                                    className="difficulty-bar-fill"
                                                    style={{
                                                        width: `${percentage}%`,
                                                    }}
                                                ></div>

                                            </div>

                                            <span>
                                                {
                                                    percentage
                                                }
                                                %
                                            </span>

                                        </div>
                                    );
                                }
                            )}

                        </div>

                    </section>

                    <section className="progress-section">

                        <div className="section-header">

                            <div>

                                <p className="section-label">
                                    ACTIVITY
                                </p>

                                <h2>
                                    Recent Activity
                                </h2>

                            </div>

                        </div>

                        {recentProblems.length ===
                        0 ? (
                            <div className="empty-progress">

                                <h3>
                                    No recent activity
                                </h3>

                                <p>
                                    Your recent problem
                                    activity will
                                    appear here.
                                </p>

                            </div>
                        ) : (
                            <div className="recent-activity-list">

                                {recentProblems.map(
                                    (
                                        studentProblem
                                    ) => {

                                        const problemId =
                                            getProblemId(
                                                studentProblem
                                            );

                                        const problem =
                                            problems.find(
                                                (
                                                    item
                                                ) =>
                                                    String(
                                                        item.id
                                                    ) ===
                                                    String(
                                                        problemId
                                                    )
                                            );

                                        if (!problem) {
                                            return null;
                                        }

                                        return (
                                            <Link
                                                to={`/problem/${problem.id}`}
                                                className="recent-activity-item"
                                                key={
                                                    studentProblem.id
                                                }
                                            >

                                                <div>

                                                    <h3>
                                                        {
                                                            problem.title
                                                        }
                                                    </h3>

                                                    <p>
                                                        {
                                                            problem.difficulty
                                                        }{" "}
                                                        •{" "}
                                                        {
                                                            problem.topic
                                                        }
                                                    </p>

                                                </div>

                                                <span
                                                    className={
                                                        studentProblem.status ===
                                                        "SOLVED"
                                                            ? "activity-status solved"
                                                            : "activity-status"
                                                    }
                                                >
                                                    {
                                                        studentProblem.status
                                                    }
                                                </span>

                                            </Link>
                                        );
                                    }
                                )}

                            </div>
                        )}

                    </section>

                </main>

                <footer className="student-footer">

                    <p>
                        © 2026 CodeTrack. Keep
                        coding, keep growing.
                    </p>

                </footer>

            </div>
        );
    }

    /*
     * =========================
     * DASHBOARD PAGE
     * =========================
     */

    return (
        <div className="student-page">

            <nav className="student-navbar">

                <div className="student-logo">

                    <span className="logo-icon">
                        &lt;/&gt;
                    </span>

                    <span>
                        CodeTrack
                    </span>

                </div>

                <div className="student-nav-links">

                    <Link
                        to="/student"
                        className="active"
                    >
                        Dashboard
                    </Link>

                    <Link to="/problems">
                        Problems
                    </Link>

                    <Link to="/student?view=progress">
                        Progress
                    </Link>

                </div>

                <ProfileMenu />

            </nav>

            <section className="student-hero">

                <div className="hero-content">

                    <p className="hero-small-title">
                        STUDENT DASHBOARD
                    </p>

                    <h1>
                        Welcome back,{" "}
                        {student?.name ||
                            "Student"}!
                    </h1>

                    <p>
                        Keep learning, keep coding,
                        and keep growing.
                    </p>

                </div>

                <Link
                    to="/problems"
                    className="hero-button"
                >
                    Solve Problems
                </Link>

            </section>

            <section className="student-stats">

                <div className="stat-card">

                    <div className="stat-icon">
                        ✓
                    </div>

                    <div>

                        <h3>
                            {solvedCount}
                        </h3>

                        <p>
                            Problems Solved
                        </p>

                    </div>

                </div>

                <div className="stat-card">

                    <div className="stat-icon">
                        ↗
                    </div>

                    <div>

                        <h3>
                            {attemptedCount}
                        </h3>

                        <p>
                            Problems Attempted
                        </p>

                    </div>

                </div>

                <div className="stat-card">

                    <div className="stat-icon">
                        ◉
                    </div>

                    <div>

                        <h3>
                            {progress}%
                        </h3>

                        <p>
                            Overall Progress
                        </p>

                    </div>

                </div>

                <div className="stat-card">

                    <div className="stat-icon">
                        #
                    </div>

                    <div>

                        <h3>
                            {currentRank > 0
                                ? `#${currentRank}`
                                : "N/A"}
                        </h3>

                        <p>
                            Current Rank
                        </p>

                    </div>

                </div>

            </section>

            <main className="student-content">

                <section className="progress-section">

                    <div className="section-header">

                        <div>

                            <p className="section-label">
                                YOUR JOURNEY
                            </p>

                            <h2>
                                Overall Progress
                            </h2>

                        </div>

                        <Link
                            to="/student?view=progress"
                            className="view-progress-link"
                        >
                            View Details →
                        </Link>

                    </div>

                    <div className="progress-bar-container">

                        <div
                            className="progress-bar-fill"
                            style={{
                                width: `${progress}%`,
                            }}
                        ></div>

                    </div>

                    <div className="progress-details">

                        <span>
                            {solvedCount} solved
                        </span>

                        <span>
                            {totalProblems} total
                            problems
                        </span>

                    </div>

                </section>

                {/* =========================
                    RECENT PROBLEMS
                ========================= */}

                <section className="progress-section">

                    <div className="section-header">

                        <div>

                            <p className="section-label">
                                KEEP GOING
                            </p>

                            <h2>
                                Recent Problems
                            </h2>

                        </div>

                        <Link
                            to="/problems"
                            className="view-progress-link"
                        >
                            View All →
                        </Link>

                    </div>

                    {recentProblems.length ===
                    0 ? (
                        <div className="empty-progress">

                            <h3>
                                No recent problems
                            </h3>

                            <p>
                                Start solving
                                problems to see
                                your activity here.
                            </p>

                        </div>
                    ) : (
                        <div className="recent-activity-list">

                            {recentProblems.map(
                                (
                                    studentProblem
                                ) => {

                                    const problemId =
                                        getProblemId(
                                            studentProblem
                                        );

                                    const problem =
                                        problems.find(
                                            (
                                                item
                                            ) =>
                                                String(
                                                    item.id
                                                ) ===
                                                String(
                                                    problemId
                                                )
                                        );

                                    if (!problem) {
                                        return null;
                                    }

                                    return (
                                        <Link
                                            to={`/problem/${problem.id}`}
                                            className="recent-activity-item"
                                            key={
                                                studentProblem.id
                                            }
                                        >

                                            <div>

                                                <h3>
                                                    {
                                                        problem.title
                                                    }
                                                </h3>

                                                <p>
                                                    {
                                                        problem.difficulty
                                                    }{" "}
                                                    •{" "}
                                                    {
                                                        problem.topic
                                                    }
                                                </p>

                                            </div>

                                            <span
                                                className={
                                                    studentProblem.status ===
                                                    "SOLVED"
                                                        ? "activity-status solved"
                                                        : "activity-status"
                                                }
                                            >
                                                {
                                                    studentProblem.status
                                                }
                                            </span>

                                        </Link>
                                    );
                                }
                            )}

                        </div>
                    )}

                </section>

                {/* =========================
                    QUICK ACTIONS
                ========================= */}

                <section className="progress-section">

                    <div className="section-header">

                        <div>

                            <p className="section-label">
                                GET STARTED
                            </p>

                            <h2>
                                Quick Actions
                            </h2>

                        </div>

                    </div>

                    <div className="quick-actions">

                        <Link
                            to="/problems"
                            className="quick-action-card"
                        >

                            <span className="quick-action-icon">
                                &lt;/&gt;
                            </span>

                            <h3>
                                Solve Problems
                            </h3>

                            <p>
                                Practice coding and
                                improve your skills.
                            </p>

                            <span>
                                Start →
                            </span>

                        </Link>

                        <Link
                            to="/student?view=progress"
                            className="quick-action-card"
                        >

                            <span className="quick-action-icon">
                                ↗
                            </span>

                            <h3>
                                View Progress
                            </h3>

                            <p>
                                Check your performance
                                and coding journey.
                            </p>

                            <span>
                                View →
                            </span>

                        </Link>

                    </div>

                </section>

            </main>

            <footer className="student-footer">

                <p>
                    © 2026 CodeTrack. Keep
                    coding, keep growing.
                </p>

            </footer>

        </div>
    );
}

export default Student;