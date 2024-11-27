import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom';
import { router } from './router/router';
import { ToastProvider } from './context/toast/ToastContext';

// Importar los estilos de PrimeReact
import 'primereact/resources/themes/saga-blue/theme.css'; // O el tema que estés usando
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css'; 
import 'primereact/resources/primereact.css';

// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'bootstrap/dist/js/bootstrap.bundle.min.js';

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <ToastProvider>
        <RouterProvider router={ router } />
      </ToastProvider>
  </StrictMode>,
)
