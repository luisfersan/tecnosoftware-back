
const { pool } = require('../config/config');   // Importo la configuración de la base de datos
const bcrypt = require('bcrypt');               // Módulo para encriptación de contraseñas

// Función para registrar un usuario nuevo en la base de datos
const registerUser = async (email, password, rol, lenguage) => {
  // Encripto la contraseña antes de guardarla
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = 'INSERT INTO usuarios (email, password, rol, lenguage) VALUES ($1, $2, $3, $4) RETURNING *';
  const values = [email, hashedPassword, rol, lenguage];
  // Ejecuto la consulta y retorna el usuario registrado
  const result = await pool.query(query, values);
  return result.rows[0];
};

// Función para obtener un usuario a través de su email
const getUserByEmail = async (email) => {
  const query = 'SELECT * FROM usuarios WHERE email = $1';
  const result = await pool.query(query, [email]); // Busco en la BDD el usuario por email
  return result.rows[0];
};

module.exports = { registerUser, getUserByEmail }; // Exporto las funciones
