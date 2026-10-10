import { useState } from "react";
import { Link } from "react-router-dom";

const API_BASE_URL = "https://codetrack-backend-l3s6.onrender.com";

function AddProblem() {
    const [title, setTitle] = useState("");
    const [topic, setTopic] = useState("");
    const [difficulty, setDifficulty] = useState("Easy");
    const [description, setDescription] = useState("");
    const [inputFormat, setInputFormat] = useState("");
    const [outputFormat, setOutputFormat] = useState("");
    const [constraints, setConstraints] = useState("");
    const [sampleInput, setSampleInput] = useState("");
    const [sampleOutput, setSampleOutput] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const problem = {
            title,
            topic,
            difficulty,
            description,
            inputFormat,
            outputFormat,
            constraints,
            sampleInput,
            sampleOutput,
        };

        setIsSubmitting(true);

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/problems`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(problem),
                }
            );

            if (!response.ok) {
                const message = await response.text();
                throw new Error(
                    message || `Request failed (${response.status})`
                );
            }

            alert("Problem added successfully!");

            setTitle("");
            setTopic("");
            setDifficulty("Easy");
            setDescription("");
            setInputFormat("");
            setOutputFormat("");
            setConstraints("");
            setSampleInput("");
            setSampleOutput("");
        } catch (error) {
            console.error("Error adding problem:", error);

            alert(
                `Failed to add problem: ${error.message}\n\n` +
                "Please check that the backend is running and " +
                "the API endpoint is configured correctly."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="app">
            {/* NAVBAR */}
            <nav className="navbar">
                <div className="logo">
                    <div className="logo-icon">C</div>
                    <span>CodeTrack</span>
                </div>

                <div className="nav-links">
                    <Link to="/admin">Dashboard</Link>
                    <Link to="/admin/problems">Problems</Link>
                    <Link to="/students">Students</Link>
                </div>

                <button type="button" className="profile-button">
                    Profile
                </button>
            </nav>

            {/* HERO */}
            <section className="hero-section">
                <div className="hero-content">
                    <p className="welcome-text">CODETRACK ADMIN</p>
                    <h1>Add Problem</h1>
                    <p className="hero-description">
                        Create a new coding problem for students.
                    </p>
                </div>
            </section>

            {/* FORM */}
            <section
                className="problems-section"
                style={{
                    display: "flex",
                    justifyContent: "center",
                    paddingTop: "50px",
                    paddingBottom: "70px",
                }}
            >
                <div
                    className="problem-card"
                    style={{
                        width: "100%",
                        maxWidth: "700px",
                    }}
                >
                    <h2 style={{ marginBottom: "30px" }}>
                        Problem Details
                    </h2>

                    <form onSubmit={handleSubmit}>
                        <div style={{ marginBottom: "25px" }}>
                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "8px",
                                    fontWeight: "600",
                                }}
                            >
                                Problem Title
                            </label>
                            <input
                                type="text"
                                placeholder="Enter problem title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                style={inputStyle}
                            />
                        </div>

                        <div style={{ marginBottom: "25px" }}>
                            <label style={labelStyle}>Topic</label>
                            <input
                                type="text"
                                placeholder="Example: Arrays"
                                value={topic}
                                onChange={(e) => setTopic(e.target.value)}
                                required
                                style={inputStyle}
                            />
                        </div>

                        <div style={{ marginBottom: "25px" }}>
                            <label style={labelStyle}>Difficulty</label>
                            <select
                                value={difficulty}
                                onChange={(e) =>
                                    setDifficulty(e.target.value)
                                }
                                style={{
                                    ...inputStyle,
                                    background: "white",
                                }}
                            >
                                <option value="Easy">Easy</option>
                                <option value="Medium">Medium</option>
                                <option value="Hard">Hard</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: "25px" }}>
                            <label style={labelStyle}>
                                Problem Description
                            </label>
                            <textarea
                                placeholder="Enter the complete problem description"
                                value={description}
                                onChange={(e) =>
                                    setDescription(e.target.value)
                                }
                                required
                                rows={6}
                                style={textareaStyle}
                            />
                        </div>

                        <div style={{ marginBottom: "25px" }}>
                            <label style={labelStyle}>Input Format</label>
                            <textarea
                                placeholder="Example: First line contains an integer N..."
                                value={inputFormat}
                                onChange={(e) =>
                                    setInputFormat(e.target.value)
                                }
                                required
                                rows={4}
                                style={textareaStyle}
                            />
                        </div>

                        <div style={{ marginBottom: "25px" }}>
                            <label style={labelStyle}>Output Format</label>
                            <textarea
                                placeholder="Example: Print the required answer..."
                                value={outputFormat}
                                onChange={(e) =>
                                    setOutputFormat(e.target.value)
                                }
                                required
                                rows={4}
                                style={textareaStyle}
                            />
                        </div>

                        <div style={{ marginBottom: "25px" }}>
                            <label style={labelStyle}>Constraints</label>
                            <textarea
                                placeholder="Example: 1 ≤ N ≤ 100000"
                                value={constraints}
                                onChange={(e) =>
                                    setConstraints(e.target.value)
                                }
                                required
                                rows={5}
                                style={textareaStyle}
                            />
                        </div>

                        <div style={{ marginBottom: "25px" }}>
                            <label style={labelStyle}>Sample Input</label>
                            <textarea
                                placeholder="Enter sample input"
                                value={sampleInput}
                                onChange={(e) =>
                                    setSampleInput(e.target.value)
                                }
                                required
                                rows={4}
                                style={{
                                    ...textareaStyle,
                                    fontFamily: "monospace",
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: "30px" }}>
                            <label style={labelStyle}>Sample Output</label>
                            <textarea
                                placeholder="Enter sample output"
                                value={sampleOutput}
                                onChange={(e) =>
                                    setSampleOutput(e.target.value)
                                }
                                required
                                rows={4}
                                style={{
                                    ...textareaStyle,
                                    fontFamily: "monospace",
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            className="solve-button"
                            disabled={isSubmitting}
                        >
                            {isSubmitting
                                ? "Adding Problem..."
                                : "Add Problem →"}
                        </button>
                    </form>
                </div>
            </section>

            {/* FOOTER */}
            <footer>
                <p>
                    © 2026 CodeTrack. Built for better coding progress.
                </p>
            </footer>
        </div>
    );
}

const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontWeight: "600",
};

const inputStyle = {
    width: "100%",
    padding: "14px",
    borderRadius: "10px",
    border: "1px solid #ccc",
    fontSize: "15px",
    boxSizing: "border-box",
    outline: "none",
};

const textareaStyle = {
    ...inputStyle,
    resize: "vertical",
    fontFamily: "inherit",
};

export default AddProblem;
