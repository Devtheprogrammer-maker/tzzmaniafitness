import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";



const API_URL = "http://localhost:4000";

const Login: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { setUserObj } = useAuth();


    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            if (!email || !password) {
                return setError("Please enter a password and username");
            }

            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.error || "Login Failed Failed")
                return;
            }

            setUserObj(data.user)

            //Replace history: To overwrite the current page in the history stack (so the user cannot click "Back" to return to it), use { replace: true }:
            navigate("/dashboard", { replace: true });
        } catch (error) {
            setError(`Could not reach the server. Please try again. ${error}`);
        } finally {
            setLoading(false);
        }
    }

    return (
        <section>
            <h2>Login</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>

                <div>
                    <label htmlFor="password">Password:</label>
                    <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>

                <button type="submit" disabled={loading}>
                    {loading ? "Loging In..." : "Log In"}
                </button>
            </form>
            <br />
            <Link to="/signup"
                className="rounded-full bg-primary px-5 py-2 text-white font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg cursor-pointer"
            >
                New? Create an Account
            </Link>
        </section>
    )
}

export default Login