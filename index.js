const express = require('express');
const app = express();
const cors = require('cors');
const routes = require('./routes');
const { initializeAdmin } = require('./models/userModel');

app.use(cors());
app.use(express.json());
app.use('/', routes);

const isTestEnvironment = process.env.NODE_ENV === 'test';

// Script para crear el administrador por defecto
if (!isTestEnvironment) {
  app.listen(3000, async () => {
    console.log('Servidor iniciado en http://localhost:3000');
    await initializeAdmin(); // Ejecuta la creación del administrador solo si no está en el entorno de pruebas
  });
}

module.exports = app;