const { pool } = require('../config/config');

// Crear una evaluación
const createReview = async (userId, productId, rating, comment) => {
  const query = `
    INSERT INTO reviews (user_id, product_id, rating, comment) 
    VALUES ($1, $2, $3, $4) 
    RETURNING *;
  `;
  const result = await pool.query(query, [userId, productId, rating, comment]);
  return result.rows[0];
};

// Obtener evaluaciones de un producto
const getReviewsByProductId = async (productId) => {
  const query = `
    SELECT r.id, r.rating, r.comment, r.created_at, u.username 
    FROM reviews r
    JOIN users u ON r.user_id = u.id
    WHERE r.product_id = $1;
  `;
  const result = await pool.query(query, [productId]);
  return result.rows;
};

// Verificar si un usuario compró un producto
const hasUserPurchasedProduct = async (user_id, product_id) => {
  const query = `
    SELECT 1
    FROM orders o
    JOIN order_product op ON o.id = op.order_id
    WHERE o.user_id = $1 AND op.product_id = $2;
  `;
  const result = await pool.query(query, [user_id, product_id]);
  return result.rowCount > 0;
};

module.exports = { createReview, getReviewsByProductId, hasUserPurchasedProduct };
