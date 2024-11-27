import React, { useState } from 'react';
import { Sidebar } from 'primereact/sidebar';
import { Button } from 'primereact/button';
import { Outlet } from 'react-router-dom';
import { Menu } from 'primereact/menu';

const items = [
    { label: 'Eventos', icon: 'pi pi-calendar-clock', url: '/' },
    { label: 'Reservas', icon: 'pi pi-calendar-plus', url: '/pagina2' }
];

const Layout = () => {
  const [visible, setVisible] = useState(false);

    return (
        <div className="layout">
            {/* Sidebar */}
            <Sidebar visible={visible} cl onHide={() => setVisible(false)} style={{ width: '13rem' }}>
                <Menu style={{ width: "100%" }} model={items} />
            </Sidebar>

            {/* Botón para abrir el menú */}
            <Button
                icon="pi pi-bars"
                className="p-button-rounded p-button-text p-button-lg"
                style={{ position: 'fixed', top: '1rem', left: '1rem', zIndex: 1000 }}
                onClick={() => setVisible(true)}
            />

            {/* Contenido de la página */}
            <div style={{ padding: '2rem', marginLeft: visible ? '18rem' : '0' }}>
                <Outlet />
            </div>
        </div>
    );
};

export default Layout;
