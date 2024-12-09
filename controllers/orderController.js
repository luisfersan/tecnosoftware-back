const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} = require('../models/orderModel');
const { apiResponse } = require('../helpers/response');

// Crear una nueva orden
const addOrder = async (req, res) => {
  try {
    const { user_id, products } = req.body;
    const newOrder = await createOrder(user_id, products);
    return apiResponse(res, 'success', 201, 'Orden creada con éxito', newOrder);
  } catch (error) {
    return apiResponse(res, 'error', 500, 'Error al crear la orden', error.message);
  }
};

// Obtener todas las órdenes
const getOrders = async (req, res) => {
  try {
    const orders = await getAllOrders();
    return apiResponse(res, 'success', 200, 'Órdenes obtenidas con éxito', orders);
  } catch (error) {
    return apiResponse(res, 'error', 500, 'Error al obtener las órdenes', error.message);
  }
};

// Obtener una orden por ID
const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await getOrderById(id);
    if (!order) {
      return apiResponse(res, 'error', 404, 'Orden no encontrada');
    }
    return apiResponse(res, 'success', 200, 'Orden obtenida con éxito', order);
  } catch (error) {
    return apiResponse(res, 'error', 500, 'Error al obtener la orden', error.message);
  }
};

// Actualizar el estado de una orden
const updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedOrder = await updateOrderStatus(id, status);
    if (!updatedOrder) {
      return apiResponse(res, 'error', 404, 'Orden no encontrada');
    }
    return apiResponse(res, 'success', 200, 'Orden actualizada con éxito', updatedOrder);
  } catch (error) {
    return apiResponse(res, 'error', 500, 'Error al actualizar la orden', error.message);
  }
};

// Eliminar una orden
const removeOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedOrder = await deleteOrder(id);
    if (!deletedOrder) {
      return apiResponse(res, 'error', 404, 'Orden no encontrada');
    }
    return apiResponse(res, 'success', 200, 'Orden eliminada con éxito', deletedOrder);
  } catch (error) {
    return apiResponse(res, 'error', 500, 'Error al eliminar la orden', error.message);
  }
};

module.exports = {
  addOrder,
  getOrders,
  getOrder,
  updateOrder,
  removeOrder,
};

