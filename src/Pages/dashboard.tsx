import React from "react";
import { useAuth } from "../context/AuthContext";

const Dashboard: React.FC = () => {

    const { userObj } = useAuth();

    return (
        <>

            <h1>Welcome, <span>{userObj?.name || "Not logged IN"}</span></h1>


        </>
    );

    // if (!userObj) {
    //     return <p>Not logged in</p>;
    // }

    // return <span>{userObj.name}</span>;

    // or {userObj ? userObj.name : "Not Logged In "}

}

export default Dashboard;