import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@/index.css';
import { RouterProvider } from 'react-router-dom';
import App from '@/App.tsx';
import { router } from '@/routes/index.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App>
      <RouterProvider router={router} />
    </App>
  </StrictMode>,
);
