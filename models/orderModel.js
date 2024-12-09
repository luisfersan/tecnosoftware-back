const { pool } = require('../config/config');

// Crear una nueva orden
const createOrder = async (userId, products) => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    // Crear la orden
    const orderQuery = 'INSERT INTO orders (user_id) VALUES ($1) RETURNING *';
    const orderResult = await client.query(orderQuery, [userId]);
    const order = orderResult.rows[0];

    // Insertar los productos asociados
    const orderProductQuery = `
      INSERT INTO order_product (order_id, product_id, quantity, price) 
      VALUES ($1, $2, $3, $4)
    `;
    for (const product of products) {
      const { product_id, quantity, price } = product;
      await client.query(orderProductQuery, [order.id, product_id, quantity, price]);
    }

    await client.query('COMMIT');
    return order;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Obtener todas las órdenes
const getAllOrders = async () => {
  const query = `
    SELECT o.id AS order_id, o.user_id, o.status, o.created_at,
           json_agg(
             json_build_object(
               'product_id', op.product_id,
               'quantity', op.quantity,
               'price', op.price
             )
           ) AS products
    FROM orders o
    LEFT JOIN order_product op ON o.id = op.order_id
    GROUP BY o.id
  `;
  const result = await pool.query(query);
  return result.rows;
};

// Obtener una orden por ID
const getOrderById = async (id) => {
  const query = `
    SELECT o.id AS order_id, o.user_id, o.status, o.created_at,
           json_agg(
             json_build_object(
               'product_id', op.product_id,
               'quantity', op.quantity,
               'price', op.price
             )
           ) AS products
    FROM orders o
    LEFT JOIN order_product op ON o.id = op.order_id
    WHERE o.id = $1
    GROUP BY o.id
  `;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

// Actualizar el estado de una orden
const updateOrderStatus = async (id, status) => {
  const query = 'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *';
  const result = await pool.query(query, [status, id]);
  return result.rows[0];
};

// Eliminar una orden
const deleteOrder = async (id) => {
  const query = 'DELETE FROM orders WHERE id = $1 RETURNING *';
  const result = await pool.query(query, [id]);
  return result.rows[0];
};

module.exports = {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
};
