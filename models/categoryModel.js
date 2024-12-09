const { pool } = require('../config/config');

// Crear una nueva categoría
const createCategory = async (name) => {
  const query = 'INSERT INTO categories (name) VALUES ($1) RETURNING *';
  const result = await pool.query(query, [name]);
  return result.rows[0];
};

// Obtener todas las categorías
const getAllCategories = async () => {
  const query = 'SELECT * FROM categories';
  const result = await pool.query(query);
  return result.rows;
};

// Obtener una categoría por su ID
const getCategoryById = async (id) => {
  const query = 'SELECT * FROM categories WHERE id = $1';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// Actualizar una categoría
const updateCategory = async (id, name) => {
  const query = 'UPDATE categories SET name = $1 WHERE id = $2 RETURNING *';
  const result = await pool.query(query, [name, id]);
  return result.rows[0];
};

// Eliminar una categoría
const deleteCategory = async (id) => {
  const query = 'DELETE FROM categories WHERE id = $1 RETURNING *';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

module.exports = {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
