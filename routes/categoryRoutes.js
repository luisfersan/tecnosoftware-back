const express = require('express');
const {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');
const { authenticateToken, checkAdmin, logRequest } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', logRequest, getCategories); // Obtener todas las categorías
router.post('/', logRequest, authenticateToken, checkAdmin, createCategory); // Crear categoría
router.put('/:id', logRequest, authenticateToken, checkAdmin, updateCategory); // Modificar categoría
router.delete('/:id', logRequest, authenticateToken, checkAdmin, deleteCategory); // Eliminar categoría

module.exports = router;
