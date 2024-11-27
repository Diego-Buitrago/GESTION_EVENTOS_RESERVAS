import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './Layout';

function App() {

  const Pagina1 = () => <h1>Página 1</h1>;
  const Pagina2 = () => <h1>Página 2</h1>;

  return (
    <BrowserRouter>
      <Routes>
        {/* Rutas con el Layout */}
          <Route path="/" element={<Layout />}>
          <Route index path="" element={<Pagina1 />} />
          <Route path="pagina2" element={<Pagina2 />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
