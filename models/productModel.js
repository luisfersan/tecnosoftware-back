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
const createProduct = async ({ name, image, description, price, stock, category_id }) => {
  const query = `
    INSERT INTO products (name, image, description, price, stock, category_id)
    VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
  const values = [name, image, description, price, stock, category_id];
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
const getProductsByCategory = async (categoryName) => {
  const query = `
      SELECT 
          p.id AS product_id,
          p.name AS product_name,
          p.price AS product_price,
          c.name AS category_name
      FROM 
          products p
      JOIN 
          categories c
      ON 
          p.category_id = c.id
      WHERE 
          c.name = $1
  `;
  const values = [categoryName]; // Nombre de la categoría

  try {
    const  result = await pool.query(query, values); // Ejecuta la consulta
    console.log(result.rows, '<---- prueba')
    return result.rows; // Devuelve los productos encontrados
  } catch (error) {
    console.error('Error al obtener productos por categoría:', error);
    throw error; // Lanza el error para manejarlo en el controlador
  }
};

const getTopRatedProducts = async () => {
  const query = `
      SELECT 
          p.id AS product_id,
          p.name AS product_name,
          p.price AS product_price,
          AVG(r.rating) AS average_rating
      FROM 
          products p
      JOIN 
          reviews r ON p.id = r.product_id
      WHERE 
          r.rating >= 4
      GROUP BY 
          p.id
      HAVING 
          AVG(r.rating) >= 4
      ORDER BY 
          average_rating DESC;
  `;

  try {
    const { rows } = await pool.query(query); // Ejecuta la consulta
    return rows; // Devuelve los productos mejor evaluados
  } catch (error) {
    console.error('Error al obtener productos mejor evaluados:', error);
    throw error; // Lanza el error para manejarlo en el controlador
  }
};

const purchasedProducts = async (id) => {
  try {
    const query = `
SELECT
    p.id AS product_id,
    p.name AS product_name,
    p.image AS product_image,
    op.quantity AS quantity,
    op.price AS unit_price,
    (op.quantity * op.price) AS total_price,
    o.created_at AS purchase_date
FROM
    orders o
LEFT JOIN
    order_product op ON o.id = op.order_id
LEFT JOIN
    products p ON op.product_id = p.id
WHERE
    o.user_id = $1
    AND op.id IS NOT NULL
    AND p.id IS NOT NULL
ORDER BY
    o.created_at DESC;

  `;
    const result = await pool.query(query, [id]);
    return result.rows;
  } catch (error) {
    console.error(error.message);
    throw error;
  }
};

module.exports = { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct, getProductsByCategory, getTopRatedProducts, purchasedProducts };
