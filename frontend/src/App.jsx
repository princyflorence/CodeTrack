import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";

import Problems from "./Problems";
import Login from "./Login";
import Student from "./Student";
import AddProblem from "./AddProblem";
import Students from "./Students";
import StudentDetails from "./StudentDetails";
import ProblemDetails from "./ProblemDetails";
import Admin from "./Admin";

/* =========================
   STUDENT ROUTE PROTECTION
========================= */

function StudentRoute({ children }) {
    const studentId = localStorage.getItem("studentId");
    const userRole = localStorage.getItem("userRole");

    if (!studentId || userRole !== "STUDENT") {
        return <Navigate to="/login" replace />;
    }

    return children;
}

/* =========================
   ADMIN ROUTE PROTECTION
========================= */

function AdminRoute({ children }) {
    const userRole = localStorage.getItem("userRole");

    if (userRole !== "ADMIN") {
        return <Navigate to="/login" replace />;
    }

    return children;
}

/* =========================
   APP
========================= */

function App() {
    return (
        <Routes>

            {/* =========================
                DEFAULT
            ========================= */}

            <Route
                path="/"
                element={<Navigate to="/login" replace />}
            />

            {/* =========================
                LOGIN
            ========================= */}

            <Route
                path="/login"
                element={<Login />}
            />

            {/* =========================
                STUDENT PAGES
            ========================= */}

            <Route
                path="/student"
                element={
                    <StudentRoute>
                        <Student />
                    </StudentRoute>
                }
            />

            <Route
                path="/problems"
                element={
                    <StudentRoute>
                        <Problems />
                    </StudentRoute>
                }
            />

            {/* =========================
                PROBLEM DETAILS
                AVAILABLE TO STUDENT + ADMIN
            ========================= */}

            <Route
                path="/problem/:id"
                element={<ProblemDetails />}
            />

            {/* =========================
                ADMIN DASHBOARD
            ========================= */}

            <Route
                path="/admin"
                element={
                    <AdminRoute>
                        <Admin />
                    </AdminRoute>
                }
            />

            {/* =========================
                ADMIN PROBLEMS
            ========================= */}

            <Route
                path="/admin/problems"
                element={
                    <AdminRoute>
                        <Problems />
                    </AdminRoute>
                }
            />

            {/* =========================
                ADD PROBLEM
            ========================= */}

            <Route
                path="/add-problem"
                element={
                    <AdminRoute>
                        <AddProblem />
                    </AdminRoute>
                }
            />

            {/* =========================
                ADMIN STUDENTS
            ========================= */}

            <Route
                path="/students"
                element={
                    <AdminRoute>
                        <Students />
                    </AdminRoute>
                }
            />

            {/* =========================
                STUDENT DETAILS
            ========================= */}

            <Route
                path="/student-details/:id"
                element={
                    <AdminRoute>
                        <StudentDetails />
                    </AdminRoute>
                }
            />

            {/* =========================
                FALLBACK
            ========================= */}

            <Route
                path="*"
                element={<Navigate to="/login" replace />}
            />

        </Routes>
    );
}

export default App;