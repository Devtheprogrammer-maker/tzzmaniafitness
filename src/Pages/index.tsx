import Hero from '../Landingpage/Hero.tsx';
import About from '../Landingpage/About.tsx';
import Schedule from '../Landingpage/Schedule.tsx';
import Pricing from '../Landingpage/Pricing.tsx';
import Contact from '../Landingpage/Contact.tsx';

const Index: React.FC = () => {
    return (
        <>
            <Hero />
            <About />
            <Schedule />
            <Pricing />
            <Contact />
        </>
    );
}

export default Index; 