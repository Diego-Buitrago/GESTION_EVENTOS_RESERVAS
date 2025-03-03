const morgan = require('morgan');
const express = require('express');
require('dotenv').confi
const cors = require('cors');
const path = require("path");
const app = express();

app.set('port', process.env.PORT || 5000);

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());


// Sirve archivos estáticos de React
app.use("/", express.static(path.join(__dirname, "../frontend/dist")));

// Maneja todas las rutas restantes devolviendo el index.html
app.get('*', (_req, res) => {
   res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// Importar rutas
app.use("/api", require('./src/routes/eventos.Route'));
app.use("/api", require('./src/routes/reservas.Route'));

app.listen(app.get('port'), () => {
   console.log(`Servidor conectado en el puerto ${app.get('port')}`);
})

module.exports = app