const express = require('express');
const {
  addOrder,
  getOrders,
  getOrder,
  updateOrder,
  removeOrder,
} = require('../controllers/orderController');
const { logRequest, authenticateToken, checkAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Rutas CRUD para órdenes
router.post('/', logRequest, addOrder); // Crear una nueva orden
router.get('/', logRequest, authenticateToken, getOrders); // Obtener todas las órdenes
router.get('/:id', logRequest,authenticateToken, getOrder); // Obtener una orden por ID
router.put('/:id', logRequest, authenticateToken, checkAdmin, updateOrder); // Actualizar estado de una orden
router.delete('/:id', logRequest, authenticateToken, checkAdmin, removeOrder); // Eliminar una orden

module.exports = router;
