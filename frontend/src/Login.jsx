import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

const API_BASE_URL = "https://codetrack-backend-l3s6.onrender.com";

function Login() {
    const navigate = useNavigate();

    const [loginType, setLoginType] = useState("STUDENT");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (event) => {
        event.preventDefault();
        setError("");

        if (!email.trim()) {
            setError("Please enter your email.");
            return;
        }

        if (!password.trim()) {
            setError("Please enter your password.");
            return;
        }

        setLoading(true);

        try {
            const endpoint =
                loginType === "STUDENT"
                    ? `${API_BASE_URL}/api/students/login`
                    : `${API_BASE_URL}/api/admin/login`;

            const response = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email.trim(),
                    password: password,
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                setError(
                    data.message || "Invalid email or password."
                );
                return;
            }

            // STUDENT LOGIN
            if (loginType === "STUDENT") {
                const student = data.student;

                if (!student) {
                    setError("Student information was not returned by the server.");
                    return;
                }

                localStorage.setItem(
                    "studentId",
                    String(student.id)
                );

                localStorage.setItem(
                    "studentName",
                    student.name || ""
                );

                localStorage.setItem(
                    "studentEmail",
                    student.email || ""
                );

                localStorage.setItem("userRole", "STUDENT");
                localStorage.removeItem("adminEmail");

                navigate("/student");
            }

            // ADMIN LOGIN
            else {
                localStorage.setItem("userRole", "ADMIN");
                localStorage.setItem("adminEmail", email.trim());

                localStorage.removeItem("studentId");
                localStorage.removeItem("studentName");
                localStorage.removeItem("studentEmail");

                navigate("/admin");
            }
        } catch (error) {
            console.error("Login error:", error);

            setError(
                "Unable to connect to the backend server. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const switchLoginType = (type) => {
        setLoginType(type);
        setEmail("");
        setPassword("");
        setError("");
    };

    return (
        <div className="login-page">
            <div className="login-container">

                {/* LOGO */}
                <div className="login-logo">
                    <div className="login-logo-icon">C</div>
                    <h1>CodeTrack</h1>
                </div>

                <p className="login-tagline">
                    Practice • Learn • Grow
                </p>

                {/* HEADING */}
                <h2>Welcome to CodeTrack</h2>

                <p className="login-description">
                    Login to continue to your portal
                </p>

                {/* LOGIN TYPE SWITCH */}
                <div
                    style={{
                        display: "flex",
                        gap: "10px",
                        marginBottom: "20px",
                        padding: "5px",
                        background: "#f3f4f6",
                        borderRadius: "12px",
                    }}
                >
                    <button
                        type="button"
                        onClick={() => switchLoginType("STUDENT")}
                        style={{
                            flex: 1,
                            padding: "12px",
                            border: "none",
                            borderRadius: "9px",
                            cursor: "pointer",
                            fontWeight: "600",
                            background:
                                loginType === "STUDENT"
                                    ? "#ffffff"
                                    : "transparent",
                            color:
                                loginType === "STUDENT"
                                    ? "#111827"
                                    : "#6b7280",
                            boxShadow:
                                loginType === "STUDENT"
                                    ? "0 2px 6px rgba(0,0,0,0.08)"
                                    : "none",
                        }}
                    >
                        🎓 Student
                    </button>

                    <button
                        type="button"
                        onClick={() => switchLoginType("ADMIN")}
                        style={{
                            flex: 1,
                            padding: "12px",
                            border: "none",
                            borderRadius: "9px",
                            cursor: "pointer",
                            fontWeight: "600",
                            background:
                                loginType === "ADMIN"
                                    ? "#ffffff"
                                    : "transparent",
                            color:
                                loginType === "ADMIN"
                                    ? "#111827"
                                    : "#6b7280",
                            boxShadow:
                                loginType === "ADMIN"
                                    ? "0 2px 6px rgba(0,0,0,0.08)"
                                    : "none",
                        }}
                    >
                        👨‍💼 Admin / Teacher
                    </button>
                </div>

                {/* LOGIN ROLE CARD */}
                <div
                    className={`role-card ${
                        loginType === "STUDENT"
                            ? "student-role"
                            : "admin-role"
                    }`}
                >
                    <div className="role-icon">
                        {loginType === "STUDENT" ? "🎓" : "👨‍💼"}
                    </div>

                    <div className="role-content">
                        <h3>
                            {loginType === "STUDENT"
                                ? "Student Login"
                                : "Admin / Teacher Login"}
                        </h3>

                        <p>
                            {loginType === "STUDENT"
                                ? "Login to solve coding problems and track your progress."
                                : "Login to manage problems, monitor students, and track performance."}
                        </p>
                    </div>
                </div>

                {/* LOGIN FORM */}
                <form
                    className="login-form"
                    onSubmit={handleLogin}
                >
                    <div className="login-field">
                        <label htmlFor="email">Email</label>

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            placeholder={
                                loginType === "ADMIN"
                                    ? "admin@codetrack.com"
                                    : "Enter your email"
                            }
                            autoComplete="email"
                            required
                        />
                    </div>

                    <div className="login-field">
                        <label htmlFor="password">Password</label>

                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            placeholder="Enter your password"
                            autoComplete="current-password"
                            required
                        />
                    </div>

                    {/* ADMIN CREDENTIAL HINT */}
                    {loginType === "ADMIN" && (
                        <div
                            style={{
                                background: "#f8fafc",
                                border: "1px solid #e2e8f0",
                                borderRadius: "10px",
                                padding: "12px",
                                marginBottom: "15px",
                                fontSize: "13px",
                                color: "#475569",
                            }}
                        >
                            <strong>Demo Admin Account</strong>

                            <div style={{ marginTop: "5px" }}>
                                Email: admin@codetrack.com
                            </div>

                            <div>Password: admin123</div>
                        </div>
                    )}

                    {/* ERROR MESSAGE */}
                    {error && (
                        <div className="login-error" role="alert">
                            ⚠️ {error}
                        </div>
                    )}

                    {/* LOGIN BUTTON */}
                    <button
                        type="submit"
                        className="login-submit-button"
                        disabled={loading}
                    >
                        {loading
                            ? "⏳ Logging in..."
                            : loginType === "STUDENT"
                                ? "Login as Student →"
                                : "Login as Admin →"}
                    </button>
                </form>

                {/* FOOTER */}
                <p className="login-footer">
                    CodeTrack • Coding Progress Management System
                </p>
            </div>
        </div>
    );
}

export default Login;
