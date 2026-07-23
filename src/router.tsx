import { createBrowserRouter } from 'react-router-dom';
import App from './App.tsx'
import Signup from "./Pages/signup.tsx";

export const router = createBrowserRouter([
    {
        path: '/tzzmaniafitness',
        element: <App />
    },
    {
        path: '/tzzmaniafitness/signup',
        element: <Signup />

    }

]);