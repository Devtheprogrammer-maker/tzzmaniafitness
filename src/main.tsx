import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom';
import { router } from './router.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* React Router, take control of routing for this application and use this router configuration. */}
    <RouterProvider router={router} />

  </StrictMode>,
)
