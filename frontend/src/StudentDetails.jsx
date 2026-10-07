import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

function StudentDetails() {
    const { id } = useParams();

    const [student, setStudent] = useState(null);
    const [studentProblems, setStudentProblems] = useState([]);
    const [totalProblems, setTotalProblems] = useState(0);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadStudentDetails = async () => {
            try {
                setLoading(true);
                setError("");

                const [
                    studentResponse,
                    activityResponse,
                    problemsResponse,
                ] = await Promise.all([
                    fetch(
                        `http://localhost:8080/api/students/${id}`
                    ),
                    fetch(
                        `http://localhost:8080/api/student-problems/student/${id}`
                    ),
                    fetch(
                        "http://localhost:8080/api/problems"
                    ),
                ]);

                if (!studentResponse.ok) {
                    throw new Error("Student not found");
                }

                if (!activityResponse.ok) {
                    throw new Error(
                        "Unable to load student activity"
                    );
                }

                if (!problemsResponse.ok) {
                    throw new Error(
                        "Unable to load problems"
                    );
                }

                const studentData =
                    await studentResponse.json();

                const activityData =
                    await activityResponse.json();

                const problemsData =
                    await problemsResponse.json();

                setStudent(studentData);

                setStudentProblems(
                    Array.isArray(activityData)
                        ? activityData
                        : []
                );

                setTotalProblems(
                    Array.isArray(problemsData)
                        ? problemsData.length
                        : 0
                );

            } catch (error) {
                console.error(
                    "Student details error:",
                    error
                );

                setError(
                    "Unable to load student details."
                );
            } finally {
                setLoading(false);
            }
        };

        loadStudentDetails();
    }, [id]);

    /* ---------------- LOADING ---------------- */

    if (loading) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#f7f8fc",
                    fontFamily:
                        "Inter, Arial, sans-serif",
                }}
            >
                <h2>
                    Loading student...
                </h2>
            </div>
        );
    }

    /* ---------------- ERROR ---------------- */

    if (error || !student) {
        return (
            <div
                style={{
                    minHeight: "100vh",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "#f7f8fc",
                    fontFamily:
                        "Inter, Arial, sans-serif",
                    padding: "20px",
                    textAlign: "center",
                }}
            >
                <h2>
                    {error ||
                        "Student not found."}
                </h2>

                <Link
                    to="/students"
                    style={{
                        marginTop: "20px",
                        padding: "10px 18px",
                        background: "#5b5ce2",
                        color: "white",
                        borderRadius: "8px",
                        textDecoration: "none",
                    }}
                >
                    ← Back to Students
                </Link>
            </div>
        );
    }

    /* ---------------- CALCULATIONS ---------------- */

    const solvedProblems =
        studentProblems.filter(
            (item) =>
                item.status === "SOLVED"
        );

    const attemptedProblems =
        studentProblems.filter(
            (item) =>
                item.status &&
                item.status !==
                "NOT_ATTEMPTED"
        );

    const solvedCount =
        solvedProblems.length;

    const attemptedCount =
        attemptedProblems.length;

    const progress =
        totalProblems > 0
            ? Math.round(
                (solvedCount /
                    totalProblems) *
                100
            )
            : 0;

    /* ---------------- HELPERS ---------------- */

    const getProblemTitle = (item) => {
        if (
            item.problem &&
            item.problem.title
        ) {
            return item.problem.title;
        }

        if (item.problemTitle) {
            return item.problemTitle;
        }

        if (item.problemId) {
            return `Problem #${item.problemId}`;
        }

        if (
            item.problem &&
            item.problem.id
        ) {
            return `Problem #${item.problem.id}`;
        }

        return "Coding Problem";
    };

    const getProblemId = (item) => {
        if (item.problemId) {
            return item.problemId;
        }

        if (
            item.problem &&
            item.problem.id
        ) {
            return item.problem.id;
        }

        return null;
    };

    const formatDate = (date) => {
        if (!date) {
            return "No activity yet";
        }

        try {
            return new Date(
                date
            ).toLocaleString();
        } catch {
            return "No activity yet";
        }
    };

    const getStatusStyle = (status) => {
        if (status === "SOLVED") {
            return {
                background: "#e8f8ef",
                color: "#16834b",
            };
        }

        if (status === "ATTEMPTED") {
            return {
                background: "#fff5df",
                color: "#b77900",
            };
        }

        return {
            background: "#eef0f5",
            color: "#667085",
        };
    };

    return (
        <div
            style={{
                minHeight: "100vh",
                background: "#f7f8fc",
                color: "#172033",
                fontFamily:
                    "Inter, Arial, sans-serif",
            }}
        >

            {/* ================= NAVBAR ================= */}

            <nav
                style={{
                    minHeight: "76px",
                    padding: "0 7%",
                    background: "white",
                    borderBottom:
                        "1px solid #e7e9f0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent:
                        "space-between",
                    gap: "20px",
                    flexWrap: "wrap",
                }}
            >

                {/* LOGO */}

                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                    }}
                >
                    <div
                        style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "11px",
                            background:
                                "linear-gradient(135deg, #6366f1, #4f46e5)",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent:
                                "center",
                            fontWeight: "800",
                            fontSize: "18px",
                        }}
                    >
                        C
                    </div>

                    <div>
                        <strong
                            style={{
                                display:
                                    "block",
                                fontSize:
                                    "20px",
                            }}
                        >
                            CodeTrack
                        </strong>

                        <span
                            style={{
                                fontSize:
                                    "10px",
                                color:
                                    "#8a91a1",
                            }}
                        >
                            Admin Portal
                        </span>
                    </div>
                </div>

                {/* NAVIGATION */}

                <div
                    style={{
                        display: "flex",
                        gap: "35px",
                        alignItems:
                            "center",
                    }}
                >
                    <Link
                        to="/admin"
                        style={{
                            textDecoration:
                                "none",
                            color:
                                "#667085",
                            fontWeight:
                                "600",
                        }}
                    >
                        Dashboard
                    </Link>

                    <Link
                        to="/problems"
                        style={{
                            textDecoration:
                                "none",
                            color:
                                "#667085",
                            fontWeight:
                                "600",
                        }}
                    >
                        Problems
                    </Link>

                    <Link
                        to="/students"
                        style={{
                            textDecoration:
                                "none",
                            color:
                                "#5b5ce2",
                            fontWeight:
                                "700",
                        }}
                    >
                        Students
                    </Link>
                </div>

                {/* SWITCH ROLE */}

                <Link
                    to="/login"
                    style={{
                        padding:
                            "11px 18px",
                        background:
                            "#172033",
                        color: "white",
                        borderRadius:
                            "9px",
                        textDecoration:
                            "none",
                        fontWeight:
                            "600",
                        fontSize:
                            "13px",
                    }}
                >
                    Switch Role
                </Link>
            </nav>

            {/* ================= MAIN ================= */}

            <main
                style={{
                    width: "86%",
                    maxWidth:
                        "1100px",
                    margin: "0 auto",
                    padding:
                        "50px 0 80px",
                }}
            >

                {/* BACK */}

                <Link
                    to="/students"
                    style={{
                        textDecoration:
                            "none",
                        color:
                            "#5b5ce2",
                        fontWeight:
                            "600",
                        fontSize:
                            "13px",
                    }}
                >
                    ← Back to Students
                </Link>

                {/* ================= STUDENT HEADER ================= */}

                <section
                    style={{
                        marginTop:
                            "25px",
                        padding:
                            "35px",
                        background:
                            "white",
                        border:
                            "1px solid #e7e9f0",
                        borderRadius:
                            "18px",
                        display:
                            "flex",
                        alignItems:
                            "center",
                        gap: "25px",
                        boxShadow:
                            "0 10px 30px rgba(38, 43, 75, 0.05)",
                    }}
                >

                    <div
                        style={{
                            width: "80px",
                            height: "80px",
                            minWidth:
                                "80px",
                            borderRadius:
                                "50%",
                            background:
                                "linear-gradient(135deg, #6366f1, #4f46e5)",
                            color: "white",
                            display:
                                "flex",
                            alignItems:
                                "center",
                            justifyContent:
                                "center",
                            fontSize:
                                "32px",
                            fontWeight:
                                "800",
                        }}
                    >
                        {student.name
                            ? student.name
                                .charAt(
                                    0
                                )
                                .toUpperCase()
                            : "S"}
                    </div>

                    <div>
                        <p
                            style={{
                                margin:
                                    "0 0 8px",
                                color:
                                    "#5b5ce2",
                                fontSize:
                                    "11px",
                                fontWeight:
                                    "800",
                                letterSpacing:
                                    "1.5px",
                            }}
                        >
                            STUDENT PROFILE
                        </p>

                        <h1
                            style={{
                                margin:
                                    "0 0 7px",
                                fontSize:
                                    "32px",
                            }}
                        >
                            {student.name}
                        </h1>

                        <p
                            style={{
                                margin: 0,
                                color:
                                    "#737c8e",
                            }}
                        >
                            {student.email}
                        </p>
                    </div>

                </section>

                {/* ================= INFORMATION CARDS ================= */}

                <section
                    style={{
                        display:
                            "grid",
                        gridTemplateColumns:
                            "repeat(4, 1fr)",
                        gap: "20px",
                        marginTop:
                            "25px",
                    }}
                >

                    {/* ACCOUNT STATUS */}

                    <div
                        style={{
                            background:
                                "white",
                            border:
                                "1px solid #e7e9f0",
                            borderRadius:
                                "15px",
                            padding:
                                "25px",
                        }}
                    >
                        <p
                            style={{
                                margin: 0,
                                color:
                                    "#8a91a1",
                                fontSize:
                                    "11px",
                                fontWeight:
                                    "700",
                            }}
                        >
                            ACCOUNT STATUS
                        </p>

                        <h2
                            style={{
                                margin:
                                    "10px 0 5px",
                                color:
                                    student.active
                                        ? "#159447"
                                        : "#d93636",
                            }}
                        >
                            {student.active
                                ? "Active"
                                : "Inactive"}
                        </h2>

                        <p
                            style={{
                                margin: 0,
                                color:
                                    "#8a91a1",
                                fontSize:
                                    "12px",
                            }}
                        >
                            Current account
                            status
                        </p>
                    </div>

                    {/* ATTEMPTED */}

                    <div
                        style={{
                            background:
                                "white",
                            border:
                                "1px solid #e7e9f0",
                            borderRadius:
                                "15px",
                            padding:
                                "25px",
                        }}
                    >
                        <p
                            style={{
                                margin: 0,
                                color:
                                    "#8a91a1",
                                fontSize:
                                    "11px",
                                fontWeight:
                                    "700",
                            }}
                        >
                            PROBLEMS ATTEMPTED
                        </p>

                        <h2
                            style={{
                                margin:
                                    "10px 0 5px",
                            }}
                        >
                            {attemptedCount}
                        </h2>

                        <p
                            style={{
                                margin: 0,
                                color:
                                    "#8a91a1",
                                fontSize:
                                    "12px",
                            }}
                        >
                            Problems attempted
                        </p>
                    </div>

                    {/* SOLVED */}

                    <div
                        style={{
                            background:
                                "white",
                            border:
                                "1px solid #e7e9f0",
                            borderRadius:
                                "15px",
                            padding:
                                "25px",
                        }}
                    >
                        <p
                            style={{
                                margin: 0,
                                color:
                                    "#8a91a1",
                                fontSize:
                                    "11px",
                                fontWeight:
                                    "700",
                            }}
                        >
                            PROBLEMS SOLVED
                        </p>

                        <h2
                            style={{
                                margin:
                                    "10px 0 5px",
                            }}
                        >
                            {solvedCount}
                        </h2>

                        <p
                            style={{
                                margin: 0,
                                color:
                                    "#8a91a1",
                                fontSize:
                                    "12px",
                            }}
                        >
                            Coding problems
                            solved
                        </p>
                    </div>

                    {/* PROGRESS */}

                    <div
                        style={{
                            background:
                                "white",
                            border:
                                "1px solid #e7e9f0",
                            borderRadius:
                                "15px",
                            padding:
                                "25px",
                        }}
                    >
                        <p
                            style={{
                                margin: 0,
                                color:
                                    "#8a91a1",
                                fontSize:
                                    "11px",
                                fontWeight:
                                    "700",
                            }}
                        >
                            PROGRESS
                        </p>

                        <h2
                            style={{
                                margin:
                                    "10px 0 5px",
                                color:
                                    "#5b5ce2",
                            }}
                        >
                            {progress}%
                        </h2>

                        <p
                            style={{
                                margin: 0,
                                color:
                                    "#8a91a1",
                                fontSize:
                                    "12px",
                            }}
                        >
                            {solvedCount} of{" "}
                            {totalProblems}{" "}
                            solved
                        </p>
                    </div>

                </section>

                {/* ================= PROGRESS BAR ================= */}

                <section
                    style={{
                        marginTop:
                            "25px",
                        background:
                            "white",
                        border:
                            "1px solid #e7e9f0",
                        borderRadius:
                            "18px",
                        padding:
                            "30px",
                    }}
                >

                    <div
                        style={{
                            display:
                                "flex",
                            justifyContent:
                                "space-between",
                            alignItems:
                                "center",
                            marginBottom:
                                "12px",
                        }}
                    >

                        <div>
                            <p
                                style={{
                                    margin:
                                        "0 0 5px",
                                    color:
                                        "#5b5ce2",
                                    fontSize:
                                        "11px",
                                    fontWeight:
                                        "800",
                                    letterSpacing:
                                        "1.5px",
                                }}
                            >
                                OVERALL PROGRESS
                            </p>

                            <h2
                                style={{
                                    margin: 0,
                                }}
                            >
                                Coding Progress
                            </h2>
                        </div>

                        <strong
                            style={{
                                fontSize:
                                    "22px",
                                color:
                                    "#5b5ce2",
                            }}
                        >
                            {progress}%
                        </strong>

                    </div>

                    <div
                        style={{
                            width:
                                "100%",
                            height:
                                "10px",
                            background:
                                "#eef0f5",
                            borderRadius:
                                "20px",
                            overflow:
                                "hidden",
                        }}
                    >
                        <div
                            style={{
                                width: `${progress}%`,
                                height:
                                    "100%",
                                background:
                                    "linear-gradient(90deg, #6366f1, #4f46e5)",
                                borderRadius:
                                    "20px",
                                transition:
                                    "width 0.5s ease",
                            }}
                        />
                    </div>

                    <p
                        style={{
                            margin:
                                "12px 0 0",
                            color:
                                "#8a91a1",
                            fontSize:
                                "13px",
                        }}
                    >
                        {solvedCount} of{" "}
                        {totalProblems}{" "}
                        coding problems
                        completed.
                    </p>

                </section>

                {/* ================= ACTIVITY ================= */}

                <section
                    style={{
                        marginTop:
                            "25px",
                        background:
                            "white",
                        border:
                            "1px solid #e7e9f0",
                        borderRadius:
                            "18px",
                        padding:
                            "30px",
                    }}
                >

                    <div
                        style={{
                            marginBottom:
                                "25px",
                        }}
                    >
                        <p
                            style={{
                                margin:
                                    "0 0 5px",
                                color:
                                    "#5b5ce2",
                                fontSize:
                                    "11px",
                                fontWeight:
                                    "800",
                                letterSpacing:
                                    "1.5px",
                            }}
                        >
                            STUDENT ACTIVITY
                        </p>

                        <h2
                            style={{
                                margin: 0,
                            }}
                        >
                            Problem Activity
                        </h2>
                    </div>

                    {studentProblems.length ===
                    0 ? (
                        <div
                            style={{
                                padding:
                                    "40px 20px",
                                textAlign:
                                    "center",
                                background:
                                    "#f8f9fc",
                                borderRadius:
                                    "12px",
                                color:
                                    "#8a91a1",
                            }}
                        >
                            No problem activity
                            found for this
                            student.
                        </div>
                    ) : (
                        <div
                            style={{
                                display:
                                    "flex",
                                flexDirection:
                                    "column",
                                gap: "12px",
                            }}
                        >
                            {studentProblems
                                .slice()
                                .sort(
                                    (
                                        a,
                                        b
                                    ) => {
                                        const dateA =
                                            new Date(
                                                a.lastAttemptedAt ||
                                                a.updatedAt ||
                                                0
                                            ).getTime();

                                        const dateB =
                                            new Date(
                                                b.lastAttemptedAt ||
                                                b.updatedAt ||
                                                0
                                            ).getTime();

                                        return (
                                            dateB -
                                            dateA
                                        );
                                    }
                                )
                                .map(
                                    (
                                        item,
                                        index
                                    ) => {
                                        const problemId =
                                            getProblemId(
                                                item
                                            );

                                        const statusStyle =
                                            getStatusStyle(
                                                item.status
                                            );

                                        return (
                                            <div
                                                key={
                                                    item.id ||
                                                    `${problemId}-${index}`
                                                }
                                                style={{
                                                    padding:
                                                        "18px",
                                                    border:
                                                        "1px solid #edf0f4",
                                                    borderRadius:
                                                        "12px",
                                                    display:
                                                        "flex",
                                                    alignItems:
                                                        "center",
                                                    justifyContent:
                                                        "space-between",
                                                    gap: "20px",
                                                }}
                                            >

                                                <div
                                                    style={{
                                                        display:
                                                            "flex",
                                                        alignItems:
                                                            "center",
                                                        gap: "15px",
                                                        minWidth: 0,
                                                    }}
                                                >

                                                    <div
                                                        style={{
                                                            width:
                                                                "42px",
                                                            height:
                                                                "42px",
                                                            minWidth:
                                                                "42px",
                                                            borderRadius:
                                                                "10px",
                                                            background:
                                                                "#f0f1ff",
                                                            color:
                                                                "#5b5ce2",
                                                            display:
                                                                "flex",
                                                            alignItems:
                                                                "center",
                                                            justifyContent:
                                                                "center",
                                                            fontWeight:
                                                                "800",
                                                        }}
                                                    >
                                                        {index +
                                                            1}
                                                    </div>

                                                    <div
                                                        style={{
                                                            minWidth:
                                                                0,
                                                        }}
                                                    >
                                                        <h3
                                                            style={{
                                                                margin:
                                                                    "0 0 5px",
                                                                fontSize:
                                                                    "15px",
                                                            }}
                                                        >
                                                            {getProblemTitle(
                                                                item
                                                            )}
                                                        </h3>

                                                        <p
                                                            style={{
                                                                margin: 0,
                                                                color:
                                                                    "#8a91a1",
                                                                fontSize:
                                                                    "12px",
                                                            }}
                                                        >
                                                            Attempts:{" "}
                                                            {item.attempts ||
                                                                0}
                                                        </p>
                                                    </div>

                                                </div>

                                                <div
                                                    style={{
                                                        display:
                                                            "flex",
                                                        alignItems:
                                                            "center",
                                                        gap: "18px",
                                                        flexShrink:
                                                            0,
                                                    }}
                                                >

                                                    <div
                                                        style={{
                                                            textAlign:
                                                                "right",
                                                        }}
                                                    >
                                                        <span
                                                            style={{
                                                                display:
                                                                    "inline-block",
                                                                padding:
                                                                    "6px 10px",
                                                                borderRadius:
                                                                    "20px",
                                                                fontSize:
                                                                    "11px",
                                                                fontWeight:
                                                                    "700",
                                                                background:
                                                                statusStyle.background,
                                                                color:
                                                                statusStyle.color,
                                                            }}
                                                        >
                                                            {item.status ||
                                                                "NOT_ATTEMPTED"}
                                                        </span>

                                                        <p
                                                            style={{
                                                                margin:
                                                                    "7px 0 0",
                                                                color:
                                                                    "#9aa1af",
                                                                fontSize:
                                                                    "11px",
                                                            }}
                                                        >
                                                            {formatDate(
                                                                item.lastAttemptedAt ||
                                                                item.updatedAt
                                                            )}
                                                        </p>
                                                    </div>

                                                    {problemId && (
                                                        <Link
                                                            to={`/problems/${problemId}`}
                                                            style={{
                                                                padding:
                                                                    "8px 13px",
                                                                border:
                                                                    "1px solid #dfe2ea",
                                                                borderRadius:
                                                                    "8px",
                                                                textDecoration:
                                                                    "none",
                                                                color:
                                                                    "#5b5ce2",
                                                                fontSize:
                                                                    "12px",
                                                                fontWeight:
                                                                    "700",
                                                            }}
                                                        >
                                                            View
                                                        </Link>
                                                    )}

                                                </div>

                                            </div>
                                        );
                                    }
                                )}
                        </div>
                    )}

                </section>

            </main>

        </div>
    );
}

export default StudentDetails;