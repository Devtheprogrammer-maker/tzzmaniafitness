import Navbar from './components/Navbar.tsx';
import Footer from './components/Footer.tsx'
import { Outlet } from "react-router-dom"
import AuthProvider from './context/AuthContext.tsx';


export default function App() {

  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
        <Navbar />
        <main>
          {/* Active child routes (Index, Signup, Login) will render here */}
          <Outlet />

        </main>
        <Footer />
      </div>
    </AuthProvider>
  );
}