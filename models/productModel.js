const { pool } = require('../config/config');

// Obtener todos los productos
const getAllProducts = async () => {
  const result = await pool.query('SELECT * FROM products');
  return result.rows;
};

// Obtener un producto por ID
const getProductById = async (id) => {
  const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
  return result.rows[0];
};

// Crear un producto
const createProduct = async ({ name, description, price, stock, category_id }) => {
  const query = `
    INSERT INTO products (name, description, price, stock, category_id)
    VALUES ($1, $2, $3, $4, $5) RETURNING *`;
  const values = [name, description, price, stock, category_id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// Actualizar un producto
const updateProduct = async (id, { name, description, price, stock, category_id }) => {
  const query = `
    UPDATE products
    SET name = $1, description = $2, price = $3, stock = $4, category_id = $5, updated_at = NOW()
    WHERE id = $6 RETURNING *`;
  const values = [name, description, price, stock, category_id, id];
  const result = await pool.query(query, values);
  return result.rows[0];
};

// Eliminar un producto
const deleteProduct = async (id) => {
  const query = 'DELETE FROM products WHERE id = $1 RETURNING *';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct };
