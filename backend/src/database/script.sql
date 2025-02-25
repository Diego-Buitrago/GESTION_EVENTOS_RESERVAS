-- Crear base de datos
CREATE DATABASE IF NOT EXISTS EventosDB;
USE bdgestioneventosyreservas;

-- Crear tabla Eventos
CREATE TABLE Eventos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    fecha DATE NOT NULL,
    cupo INT NOT NULL
);

-- Crear tabla Reservas
CREATE TABLE Reservas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    evento_id INT NOT NULL,
    nombre_usuario VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    numero_plazas INT NOT NULL,
    estado ENUM('pendiente', 'confirmada', 'cancelada') NOT NULL,
    FOREIGN KEY (evento_id) REFERENCES Eventos(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

-- POSTGRES
-- Verificación de tablas creadas
SHOW TABLES;

-- Crear base de datos
CREATE DATABASE EventosDB;

-- Conectar a la base de datos recién creada
\c EventosDB;

-- Crear tabla Eventos
CREATE TABLE Eventos (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    fecha DATE NOT NULL,
    cupo INT NOT NULL
);

-- Crear tabla Reservas
CREATE TABLE Reservas (
    id SERIAL PRIMARY KEY,
    evento_id INT NOT NULL,
    nombre_usuario VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    numero_plazas INT NOT NULL,
    estado VARCHAR(20) NOT NULL CHECK (estado IN ('pendiente', 'confirmada', 'cancelada')),
    FOREIGN KEY (evento_id) REFERENCES Eventos(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);