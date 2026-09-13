import { useState, useEffect, createContext, useContext } from "react";

const API_URL = "http://localhost:4000";

type User = {
    id: number;
    name: string;
    email: string;
};

type UserContextType = {
    userObj: User | null;
    setUserObj: React.Dispatch<React.SetStateAction<User | null>>;
    isLoading: boolean;
};

export const UserContext = createContext<UserContextType | null>(null);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [userObj, setUserObj] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await fetch(`${API_URL}/api/auth/me`, {
                    credentials: "include",
                });
                if (response.status === 401) {
                    setUserObj(null);
                    return;
                }

                if (!response.ok) {
                    console.error("Authentication check failed:", response.status);
                    setUserObj(null);
                    return;
                }

                const data = await response.json();

                setUserObj(data.user);
            } catch (error) {
                console.error("Failed to check authentication:", error);
                setUserObj(null);
            } finally {
                setIsLoading(false);
            }
        }
        checkAuth();
    }, [])

    return (
        <UserContext.Provider value={{ userObj, setUserObj, isLoading }}>
            {children}
        </UserContext.Provider>
    );
}


//So that other components can use the Auth
export const useAuth = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}


// import React, { createContext, useContext, useState } from 'react';

// interface AuthContextType {
//     user: string | null;
//     login: (userName: string) => void;
//     logout: () => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//     const [user, setUser] = useState<string | null>(null);

//     const login = (userName: string) => setUser(userName);
//     const logout = () => setUser(null);

//     return (
//         <AuthContext.Provider value={{ user, login, logout }}>
//             {children}
//         </AuthContext.Provider>
//     );
// };

// // Custom hook for clean access inside components
// export const useAuth = () => {
//     const context = useContext(AuthContext);
//     if (!context) {
//         throw new Error("useAuth must be used within an AuthProvider");
//     }
//     return context;
// };