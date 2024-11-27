const morgan = require('morgan');
const express = require('express');
require('dotenv').confi
const cors = require('cors');
const app = express();

app.set('port', process.env.PORT || 5000);

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());

// Importar rutas

app.listen(app.get('port'), () => {
   console.log(`Servidor conectado en el puerto ${app.get('port')}`);
})

module.exports = app