import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./App.css";

function Students() {
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        fetch("http://localhost:8080/api/students")
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch students");
                }

                return response.json();
            })
            .then((data) => {
                setStudents(data);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setError("Unable to load students.");
                setLoading(false);
            });
    }, []);

    const handleViewStudent = (studentId) => {
        navigate(`/student-details/${studentId}`);
    };

    return (
        <div className="app">

            {/* ================= NAVBAR ================= */}

            <nav className="navbar">

                <Link to="/admin" className="logo">

                    <div className="logo-icon">
                        C
                    </div>

                    <span>
                        CodeTrack
                    </span>

                </Link>


                <div className="nav-links">

                    <Link to="/admin">
                        Dashboard
                    </Link>

                    <Link to="/admin/problems">
                        Problems
                    </Link>

                    <Link
                        to="/students"
                        className="active"
                    >
                        Students
                    </Link>

                </div>


                <button
                    className="profile-button"
                    onClick={() => {
                        localStorage.removeItem("studentId");
                        localStorage.removeItem("studentName");
                        localStorage.removeItem("studentEmail");
                        localStorage.removeItem("userRole");
                        localStorage.removeItem("adminEmail");

                        navigate("/login", {
                            replace: true,
                        });
                    }}
                >
                    Sign Out
                </button>

            </nav>


            {/* ================= HEADER ================= */}

            <section className="hero-section">

                <div className="hero-content">

                    <p className="welcome-text">
                        STUDENTS
                    </p>

                    <h1>
                        Student
                        <br />
                        <span>Progress.</span>
                    </h1>

                    <p className="hero-description">
                        Monitor student activity, progress, and coding
                        performance with CodeTrack.
                    </p>

                </div>

            </section>


            {/* ================= STUDENTS ================= */}

            <section className="students-section">

                <div className="section-heading">

                    <div>

                        <p className="section-label">
                            CODETRACK
                        </p>

                        <h2>
                            All Students
                        </h2>

                    </div>


                    <Link
                        to="/admin"
                        className="view-all-button"
                    >
                        ← Dashboard
                    </Link>

                </div>


                {/* LOADING */}

                {loading && (
                    <p style={{ textAlign: "center" }}>
                        Loading students...
                    </p>
                )}


                {/* ERROR */}

                {error && (
                    <p
                        style={{
                            textAlign: "center",
                            color: "red",
                        }}
                    >
                        {error}
                    </p>
                )}


                {/* EMPTY */}

                {!loading &&
                    !error &&
                    students.length === 0 && (
                        <p style={{ textAlign: "center" }}>
                            No students found.
                        </p>
                    )}


                {/* STUDENT LIST */}

                <div className="student-list">

                    {students.map((student) => (

                        <div
                            className="student-card"
                            key={student.id}
                        >

                            {/* AVATAR */}

                            <div className="student-avatar">

                                {student.name
                                    ? student.name
                                        .charAt(0)
                                        .toUpperCase()
                                    : "S"}

                            </div>


                            {/* STUDENT INFO */}

                            <div className="student-info">

                                <h3>
                                    {student.name}
                                </h3>

                                <p>
                                    {student.email}
                                </p>

                            </div>


                            {/* STATUS */}

                            <div className="student-progress">

                                <strong>
                                    {student.active
                                        ? "Active"
                                        : "Inactive"}
                                </strong>

                                <span>
                                    Account Status
                                </span>

                            </div>


                            {/* VIEW BUTTON */}

                            <button
                                className="view-button"
                                onClick={() =>
                                    handleViewStudent(student.id)
                                }
                            >
                                View
                            </button>

                        </div>

                    ))}

                </div>

            </section>


            {/* ================= FOOTER ================= */}

            <footer>

                <p>
                    © 2026 CodeTrack. Built for better coding progress.
                </p>

            </footer>

        </div>
    );
}

export default Students;