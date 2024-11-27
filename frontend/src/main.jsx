import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App';
import './index.css'

// Importar los estilos de PrimeReact
import 'primereact/resources/themes/lara-light-blue/theme.css'; // Tema (puedes cambiarlo)
import 'primereact/resources/primereact.min.css'; // Componentes base
import 'primeicons/primeicons.css'; // Iconos

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
