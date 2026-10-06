import { Outlet } from "react-router-dom"
import AuthProvider from './context/AuthContext.tsx';


export default function NoNav() {
    // const location = useLocation();

    // const hideNav = ["/login", "/signup", "/dashboard"].includes(location.pathname);
    return (
        <AuthProvider>
            <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
                {/* {!hideNav && <Navbar />} */}

                <main>
                    {/* Active child routes (Index, Signup, Login) will render here */}
                    <Outlet />

                </main>
            </div>
        </AuthProvider>
    );
}