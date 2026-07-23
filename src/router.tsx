import { createBrowserRouter } from 'react-router-dom';
import App from './App.tsx'
import Signup from "./Pages/signup.tsx";
import NotFound from './Pages/NotFound.tsx';

export const router = createBrowserRouter([
    {
        path: '/tzzmaniafitness',
        element: <App />
    },
    {
        path: '/tzzmaniafitness/signup',
        element: <Signup />
    }, 
    {
        path: "/tzzmaniafitness/*", 
        element: <NotFound />
    }

]);