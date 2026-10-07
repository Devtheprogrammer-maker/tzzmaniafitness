import { createBrowserRouter } from 'react-router-dom';
import App from './App.tsx';
import NoNav from './NoNav.tsx';
import Index from './Pages/index.tsx';
import Signup from "./Pages/signup.tsx";
import Login from "./Pages/login.tsx";
import NotFound from './Pages/NotFound.tsx';
import Dashboard from './Pages/dashboard.tsx';
import ResetPasswordPageEmail from './Pages/passwordResetEmail.tsx';
import ResetPasswordPage from './Pages/passwordReset.tsx';
//import Upcoming from "./Pages/upcoming.tsx";

export const router = createBrowserRouter([

    {
        element: <App />,
        children: [
            {
                path: '/',
                //index: true, // Matches path '/'
                element: <Index />
            },
            {
                path: '/signup',
                element: <Signup />
            },
            {
                path: '/login',
                element: <Login />
            },
            {
                path: '/reset-password-email',
                element: <ResetPasswordPageEmail />
            },
            {
                path: '/reset-password/:token',
                element: <ResetPasswordPage />
            },
            {
                path: "*",
                element: <NotFound />
            }
        ]
    },
    {
        element: <NoNav />,
        children: [

            {
                path: '/dashboard',
                element: <Dashboard />
            }
        ]
    }

]);

// { basename: "/tzzmaniafitness", }