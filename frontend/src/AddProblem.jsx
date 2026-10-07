import { useState } from "react";
import { Link } from "react-router-dom";

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
            sampleOutput
        };

        try {
            const response = await fetch(
                "http://localhost:8080/api/problems",
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
                throw new Error(message || "Failed to add problem");
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
            console.error(error);

            alert(
                "Failed to add problem.\n\nMake sure the backend is running."
            );
        }
    };

    return (
        <div className="app">

            {/* NAVBAR */}

            <nav className="navbar">

                <div className="logo">

                    <div className="logo-icon">
                        C
                    </div>

                    <span>
                        CodeTrack
                    </span>

                </div>

                <div className="nav-links">

                    <Link to="/admin">
                        Dashboard
                    </Link>

                    <Link to="/admin/problems">
                        Problems
                    </Link>

                    <Link to="/students">
                        Students
                    </Link>

                </div>

                <button className="profile-button">
                    Profile
                </button>

            </nav>


            {/* HERO */}

            <section className="hero-section">

                <div className="hero-content">

                    <p className="welcome-text">
                        CODETRACK ADMIN
                    </p>

                    <h1>
                        Add Problem
                    </h1>

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
                    paddingBottom: "70px"
                }}
            >

                <div
                    className="problem-card"
                    style={{
                        width: "100%",
                        maxWidth: "700px"
                    }}
                >

                    <h2 style={{ marginBottom: "30px" }}>
                        Problem Details
                    </h2>

                    <form onSubmit={handleSubmit}>

                        {/* TITLE */}

                        <div style={{ marginBottom: "25px" }}>

                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "8px",
                                    fontWeight: "600"
                                }}
                            >
                                Problem Title
                            </label>

                            <input
                                type="text"
                                placeholder="Enter problem title"
                                value={title}
                                onChange={(e) =>
                                    setTitle(e.target.value)
                                }
                                required
                                style={{
                                    width: "100%",
                                    padding: "14px",
                                    borderRadius: "10px",
                                    border: "1px solid #ccc",
                                    fontSize: "15px",
                                    boxSizing: "border-box",
                                    outline: "none"
                                }}
                            />

                        </div>


                        {/* TOPIC */}

                        <div style={{ marginBottom: "25px" }}>

                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "8px",
                                    fontWeight: "600"
                                }}
                            >
                                Topic
                            </label>

                            <input
                                type="text"
                                placeholder="Example: Arrays"
                                value={topic}
                                onChange={(e) =>
                                    setTopic(e.target.value)
                                }
                                required
                                style={{
                                    width: "100%",
                                    padding: "14px",
                                    borderRadius: "10px",
                                    border: "1px solid #ccc",
                                    fontSize: "15px",
                                    boxSizing: "border-box",
                                    outline: "none"
                                }}
                            />

                        </div>


                        {/* DIFFICULTY */}

                        <div style={{ marginBottom: "25px" }}>

                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "8px",
                                    fontWeight: "600"
                                }}
                            >
                                Difficulty
                            </label>

                            <select
                                value={difficulty}
                                onChange={(e) =>
                                    setDifficulty(e.target.value)
                                }
                                style={{
                                    width: "100%",
                                    padding: "14px",
                                    borderRadius: "10px",
                                    border: "1px solid #ccc",
                                    fontSize: "15px",
                                    boxSizing: "border-box",
                                    background: "white",
                                    outline: "none"
                                }}
                            >

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

                        </div>


                        {/* DESCRIPTION */}

                        <div style={{ marginBottom: "25px" }}>

                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "8px",
                                    fontWeight: "600"
                                }}
                            >
                                Problem Description
                            </label>

                            <textarea
                                placeholder="Enter the complete problem description"
                                value={description}
                                onChange={(e) =>
                                    setDescription(e.target.value)
                                }
                                required
                                rows="6"
                                style={{
                                    width: "100%",
                                    padding: "14px",
                                    borderRadius: "10px",
                                    border: "1px solid #ccc",
                                    fontSize: "15px",
                                    boxSizing: "border-box",
                                    resize: "vertical",
                                    fontFamily: "inherit",
                                    outline: "none"
                                }}
                            />

                        </div>


                        {/* INPUT FORMAT */}

                        <div style={{ marginBottom: "25px" }}>

                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "8px",
                                    fontWeight: "600"
                                }}
                            >
                                Input Format
                            </label>

                            <textarea
                                placeholder="Example: First line contains an integer N..."
                                value={inputFormat}
                                onChange={(e) =>
                                    setInputFormat(e.target.value)
                                }
                                required
                                rows="4"
                                style={{
                                    width: "100%",
                                    padding: "14px",
                                    borderRadius: "10px",
                                    border: "1px solid #ccc",
                                    fontSize: "15px",
                                    boxSizing: "border-box",
                                    resize: "vertical",
                                    fontFamily: "inherit",
                                    outline: "none"
                                }}
                            />

                        </div>


                        {/* OUTPUT FORMAT */}

                        <div style={{ marginBottom: "25px" }}>

                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "8px",
                                    fontWeight: "600"
                                }}
                            >
                                Output Format
                            </label>

                            <textarea
                                placeholder="Example: Print the required answer..."
                                value={outputFormat}
                                onChange={(e) =>
                                    setOutputFormat(e.target.value)
                                }
                                required
                                rows="4"
                                style={{
                                    width: "100%",
                                    padding: "14px",
                                    borderRadius: "10px",
                                    border: "1px solid #ccc",
                                    fontSize: "15px",
                                    boxSizing: "border-box",
                                    resize: "vertical",
                                    fontFamily: "inherit",
                                    outline: "none"
                                }}
                            />

                        </div>


                        {/* CONSTRAINTS */}

                        <div style={{ marginBottom: "25px" }}>

                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "8px",
                                    fontWeight: "600"
                                }}
                            >
                                Constraints
                            </label>

                            <textarea
                                placeholder="Example: 1 ≤ N ≤ 100000"
                                value={constraints}
                                onChange={(e) =>
                                    setConstraints(e.target.value)
                                }
                                required
                                rows="5"
                                style={{
                                    width: "100%",
                                    padding: "14px",
                                    borderRadius: "10px",
                                    border: "1px solid #ccc",
                                    fontSize: "15px",
                                    boxSizing: "border-box",
                                    resize: "vertical",
                                    fontFamily: "inherit",
                                    outline: "none"
                                }}
                            />

                        </div>


                        {/* SAMPLE INPUT */}

                        <div style={{ marginBottom: "25px" }}>

                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "8px",
                                    fontWeight: "600"
                                }}
                            >
                                Sample Input
                            </label>

                            <textarea
                                placeholder="Enter sample input"
                                value={sampleInput}
                                onChange={(e) =>
                                    setSampleInput(e.target.value)
                                }
                                required
                                rows="4"
                                style={{
                                    width: "100%",
                                    padding: "14px",
                                    borderRadius: "10px",
                                    border: "1px solid #ccc",
                                    fontSize: "15px",
                                    boxSizing: "border-box",
                                    resize: "vertical",
                                    fontFamily: "monospace",
                                    outline: "none"
                                }}
                            />

                        </div>


                        {/* SAMPLE OUTPUT */}

                        <div style={{ marginBottom: "30px" }}>

                            <label
                                style={{
                                    display: "block",
                                    marginBottom: "8px",
                                    fontWeight: "600"
                                }}
                            >
                                Sample Output
                            </label>

                            <textarea
                                placeholder="Enter sample output"
                                value={sampleOutput}
                                onChange={(e) =>
                                    setSampleOutput(e.target.value)
                                }
                                required
                                rows="4"
                                style={{
                                    width: "100%",
                                    padding: "14px",
                                    borderRadius: "10px",
                                    border: "1px solid #ccc",
                                    fontSize: "15px",
                                    boxSizing: "border-box",
                                    resize: "vertical",
                                    fontFamily: "monospace",
                                    outline: "none"
                                }}
                            />

                        </div>


                        {/* SUBMIT */}

                        <button
                            type="submit"
                            className="solve-button"
                        >
                            Add Problem →
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

export default AddProblem;