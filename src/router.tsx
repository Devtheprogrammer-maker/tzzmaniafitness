import { createBrowserRouter } from 'react-router-dom';
import App from './App.tsx'
import Signup from "./Pages/signup.tsx";
import NotFound from './Pages/NotFound.tsx';

export const router = createBrowserRouter([
    {
        path: '/',
        element: <App />
    },
    {
        path: 'signup',
        element: <Signup />
    }, 
    {
        path: "*", 
        element: <NotFound />
    }

]);