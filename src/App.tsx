import Navbar from './components/Navbar.tsx';
import Index from './Pages/index.tsx'
import Footer from './components/Footer.tsx'

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">

      <Navbar />
      <main>
        <Index />
      </main>

      <Footer />
    </div>
  );
}