import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Admin.css";

function Admin() {

    const navigate = useNavigate();

    const [problems, setProblems] = useState([]);
    const [students, setStudents] = useState([]);

    const [loadingProblems, setLoadingProblems] = useState(true);
    const [loadingStudents, setLoadingStudents] = useState(true);

    /* =========================
       SIGN OUT
    ========================= */

    const handleSignOut = () => {

        localStorage.removeItem("studentId");
        localStorage.removeItem("studentName");
        localStorage.removeItem("studentEmail");
        localStorage.removeItem("userRole");
        localStorage.removeItem("adminEmail");

        navigate("/login", { replace: true });
    };


    /* =========================
       LOAD DASHBOARD DATA
    ========================= */

    useEffect(() => {

        // Get problems
        fetch("http://localhost:8080/api/problems")
            .then((response) => {

                if (!response.ok) {
                    throw new Error("Failed to load problems");
                }

                return response.json();

            })
            .then((data) => {

                setProblems(data);
                setLoadingProblems(false);

            })
            .catch((error) => {

                console.error("Problems error:", error);
                setLoadingProblems(false);

            });


        // Get students
        fetch("http://localhost:8080/api/students")
            .then((response) => {

                if (!response.ok) {
                    throw new Error("Failed to load students");
                }

                return response.json();

            })
            .then((data) => {

                setStudents(data);
                setLoadingStudents(false);

            })
            .catch((error) => {

                console.error("Students error:", error);
                setLoadingStudents(false);

            });

    }, []);


    /* =========================
       STATISTICS
    ========================= */

    const totalProblems = problems.length;

    const totalStudents = students.length;

    const activeStudents = students.filter(
        (student) => student.active
    ).length;


    return (

        <div className="admin-page">

            {/* =========================
                NAVBAR
            ========================= */}

            <nav className="admin-navbar">

                {/* LOGO */}

                <Link
                    to="/admin"
                    className="admin-logo"
                >

                    <div className="admin-logo-icon">
                        C
                    </div>

                    <div className="admin-logo-text">

                        <strong>
                            CodeTrack
                        </strong>

                        <span>
                            Admin Portal
                        </span>

                    </div>

                </Link>


                {/* NAVIGATION */}

                <div className="admin-nav-links">

                    <Link
                        to="/admin"
                        className="active"
                    >
                        Dashboard
                    </Link>

                    <Link to="/admin/problems">
                        Problems
                    </Link>

                    <Link to="/students">
                        Students
                    </Link>

                </div>


                {/* SIGN OUT */}

                <button
                    onClick={handleSignOut}
                    className="admin-signout-button"
                >
                    Sign Out
                </button>

            </nav>


            {/* =========================
                MAIN
            ========================= */}

            <main className="admin-main">


                {/* =========================
                    HERO
                ========================= */}

                <section className="admin-hero">

                    <div className="admin-hero-content">

                        <span className="admin-eyebrow">
                            ADMIN DASHBOARD
                        </span>

                        <h1>
                            Welcome back, <span>Admin</span>
                        </h1>

                        <p>
                            Manage coding problems, monitor students,
                            and track overall learning activity from
                            one place.
                        </p>


                        <div className="admin-hero-actions">

                            <Link
                                to="/add-problem"
                                className="admin-primary-button"
                            >
                                + Add Problem
                            </Link>

                            <Link
                                to="/students"
                                className="admin-secondary-button"
                            >
                                Manage Students
                            </Link>

                        </div>

                    </div>


                    {/* ADMIN CARD */}

                    <div className="admin-welcome-card">

                        <div className="admin-welcome-icon">
                            C
                        </div>

                        <span>
                            ADMIN PORTAL
                        </span>

                        <strong>
                            CodeTrack
                        </strong>

                        <p>
                            Manage your university coding
                            practice platform.
                        </p>

                    </div>

                </section>


                {/* =========================
                    STATISTICS
                ========================= */}

                <section className="admin-stats">

                    {/* TOTAL PROBLEMS */}

                    <div className="admin-stat-card">

                        <div className="admin-stat-icon">
                            ◈
                        </div>

                        <div>

                            <strong>
                                {loadingProblems
                                    ? "..."
                                    : totalProblems}
                            </strong>

                            <span>
                                Total Problems
                            </span>

                            <p>
                                Available coding problems
                            </p>

                        </div>

                    </div>


                    {/* TOTAL STUDENTS */}

                    <div className="admin-stat-card">

                        <div className="admin-stat-icon">
                            ♟
                        </div>

                        <div>

                            <strong>
                                {loadingStudents
                                    ? "..."
                                    : totalStudents}
                            </strong>

                            <span>
                                Total Students
                            </span>

                            <p>
                                Registered students
                            </p>

                        </div>

                    </div>


                    {/* ACTIVE STUDENTS */}

                    <div className="admin-stat-card">

                        <div className="admin-stat-icon">
                            ✓
                        </div>

                        <div>

                            <strong>
                                {loadingStudents
                                    ? "..."
                                    : activeStudents}
                            </strong>

                            <span>
                                Active Students
                            </span>

                            <p>
                                Currently active
                            </p>

                        </div>

                    </div>


                    {/* PROGRESS */}

                    <div className="admin-stat-card">

                        <div className="admin-stat-icon">
                            %
                        </div>

                        <div>

                            <strong>
                                72%
                            </strong>

                            <span>
                                Avg. Progress
                            </span>

                            <p>
                                Overall completion
                            </p>

                        </div>

                    </div>

                </section>


                {/* =========================
                    MANAGEMENT
                ========================= */}

                <section className="admin-management">

                    <div className="admin-section-heading">

                        <div>

                            <span>
                                MANAGEMENT
                            </span>

                            <h2>
                                Quick Actions
                            </h2>

                        </div>

                    </div>


                    <div className="admin-action-grid">


                        {/* ADD PROBLEM */}

                        <Link
                            to="/add-problem"
                            className="admin-action-card"
                        >

                            <div className="admin-action-icon">
                                +
                            </div>

                            <div>

                                <h3>
                                    Add Coding Problem
                                </h3>

                                <p>
                                    Create a new coding problem
                                    for students.
                                </p>

                            </div>

                            <span className="admin-action-arrow">
                                →
                            </span>

                        </Link>


                        {/* MANAGE PROBLEMS */}

                        <Link
                            to="/admin/problems"
                            className="admin-action-card"
                        >

                            <div className="admin-action-icon">
                                ◈
                            </div>

                            <div>

                                <h3>
                                    Manage Problems
                                </h3>

                                <p>
                                    View and manage all coding
                                    problems.
                                </p>

                            </div>

                            <span className="admin-action-arrow">
                                →
                            </span>

                        </Link>


                        {/* STUDENTS */}

                        <Link
                            to="/students"
                            className="admin-action-card"
                        >

                            <div className="admin-action-icon">
                                ♟
                            </div>

                            <div>

                                <h3>
                                    Manage Students
                                </h3>

                                <p>
                                    Monitor student accounts
                                    and activity.
                                </p>

                            </div>

                            <span className="admin-action-arrow">
                                →
                            </span>

                        </Link>

                    </div>

                </section>


                {/* =========================
                    PLATFORM OVERVIEW
                ========================= */}

                <section className="admin-overview">

                    <div className="admin-overview-header">

                        <div>

                            <span>
                                PLATFORM OVERVIEW
                            </span>

                            <h2>
                                CodeTrack Activity
                            </h2>

                        </div>

                        <span className="admin-status">
                            ● System Active
                        </span>

                    </div>


                    <div className="admin-overview-grid">

                        <div>

                            <strong>
                                {totalProblems}
                            </strong>

                            <span>
                                Coding Problems
                            </span>

                        </div>


                        <div>

                            <strong>
                                {totalStudents}
                            </strong>

                            <span>
                                Registered Students
                            </span>

                        </div>


                        <div>

                            <strong>
                                {activeStudents}
                            </strong>

                            <span>
                                Active Students
                            </span>

                        </div>


                        <div>

                            <strong>
                                72%
                            </strong>

                            <span>
                                Average Progress
                            </span>

                        </div>

                    </div>

                </section>

            </main>


            {/* =========================
                FOOTER
            ========================= */}

            <footer className="admin-footer">

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

export default Admin;