import { createContext, useState, useContext } from "react";

type User = {
    id: number;
    name: string;
    email: string;
};

type UserContextType = {
    userObj: User | null;
    setUserObj: React.Dispatch<React.SetStateAction<User | null>>;
};

export const UserContext = createContext<UserContextType | null>(null);

export default function AuthProvider({ children }: { children: React.ReactNode }) {

    const [userObj, setUserObj] = useState<User | null>(null);

    return (
        <UserContext.Provider value={{ userObj, setUserObj }}>
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