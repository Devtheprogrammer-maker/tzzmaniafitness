import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard: React.FC = () => {
    const API_URL = import.meta.env.VITE_API_URL;

    const { userObj, setUserObj, isLoading } = useAuth();
    const navigate = useNavigate();


    useEffect(() => {

        if (!isLoading && !userObj) {
            navigate("/login", { replace: true });
            // <Navigate to="/login" replace />;
        }
    }, [userObj, navigate, isLoading])

    async function LogOut() {
        try {
            const response = await fetch(`${API_URL}/api/auth/logout`, {
                method: "POST",
                credentials: "include",
            });

            const data = await response.json();
            console.log(data);
            setUserObj(null);

        } catch (error) {
            console.error("Failed to Log out:", error);
        }
    }

    return (
        <>

            <h1>Welcome, <span>{userObj?.name}</span></h1>

            {/* This is the log out section */}
            <button onClick={LogOut}>Log Out</button>


        </>
    );
}

export default Dashboard;