const { pool } = require('../config/config');
const bcrypt = require('bcrypt');

// Registrar un nuevo usuario
const registerUser = async (email, password) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  const query = `
    INSERT INTO users (email, password, admin)
    VALUES ($1, $2, $3)
    RETURNING id, email, admin;
  `;
  const values = [email, hashedPassword, false]; // Admin por defecto es `false`
  const result = await pool.query(query, values);
  return result.rows[0];
};

const getUserByEmail = async (email) => {
  const query = 'SELECT * FROM users WHERE email = $1';
  const result = await pool.query(query, [email]);
  return result.rows[0]; // Devuelve el usuario si existe
};

// Obtener todos los usuarios
const getAllUsers = async () => {
  const query = `SELECT id, email, admin FROM users`;
  const result = await pool.query(query);
  return result.rows;
};

// Obtener un usuario por ID
const getUserById = async (id) => {
  const query = `SELECT id, email, admin FROM users WHERE id = $1`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// Actualizar un usuario por ID
const updateUserById = async (id, userData) => {
  const { email, password, admin } = userData;
  const updates = [];
  const values = [];
  let query = `UPDATE users SET `;

  if (email) {
    updates.push(`email = $${updates.length + 1}`);
    values.push(email);
  }

  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    updates.push(`password = $${updates.length + 1}`);
    values.push(hashedPassword);
  }

  if (admin !== undefined) {
    updates.push(`admin = $${updates.length + 1}`);
    values.push(admin);
  }

  if (updates.length === 0) {
    throw new Error('No hay datos para actualizar');
  }

  query += updates.join(', ') + ` WHERE id = $${updates.length + 1} RETURNING id, email, admin`;
  values.push(id);

  const result = await pool.query(query, values);
  return result.rows[0];
};

// Eliminar un usuario por ID
const deleteUserById = async (id) => {
  const query = `DELETE FROM users WHERE id = $1 RETURNING id`;
  const result = await pool.query(query, [id]);
  return result.rowCount > 0;
};

// Verificar si ya existe un administrador
const createAdminUser = async (email, password, username = 'admin') => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const query = `
    INSERT INTO users (email, password, username, admin)
    VALUES ($1, $2, $3, $4)
    RETURNING id, email, username, admin;
  `;
  const values = [email, hashedPassword, username, true];

  try {
    const result = await pool.query(query, values);
    return result.rows[0];
  } catch (error) {
    throw new Error('Error al crear el usuario administrador: ' + error.message);
  }
};

const hasAdmin = async () => {
  const query = 'SELECT 1 FROM users WHERE admin = true LIMIT 1';
  try {
    const result = await pool.query(query);
    return result.rowCount > 0;
  } catch (error) {
    throw new Error('Error al verificar si existe un administrador: ' + error.message);
  }
};

const initializeAdmin = async () => {
  try {
    const adminExists = await hasAdmin();
    if (!adminExists) {
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@domain.com';
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
      await createAdminUser(adminEmail, adminPassword);
      console.log(`Administrador creado con éxito: ${adminEmail}`);
    } else {
      console.log('Ya existe un administrador en la base de datos.');
    }
  } catch (error) {
    console.error('Error al inicializar el administrador:', error.message);
  }
};

module.exports = {
  registerUser,
  getUserByEmail,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  hasAdmin,
  createAdminUser,
  initializeAdmin
};
