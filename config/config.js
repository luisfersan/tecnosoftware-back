require('dotenv').config() // Crago las variables de entorno desde el archivo .env
const { Pool } = require('pg') // Importo el módulo de conexión a PostgreSQL

// Configuración de conexión a PostgreSQL

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
})

// Llave secreta para la generación de tokens JWT
const JWT_SECRET = process.env.JWT_SECRET || 'secret_key'

module.exports = { pool, JWT_SECRET } // Exporto la configuración para su uso en otros módulos
