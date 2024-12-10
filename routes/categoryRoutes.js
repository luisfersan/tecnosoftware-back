const express = require('express');
const {
  getCategories,
  newCategory,
  updateCategoryById,
  deleteCategoryById,
} = require('../controllers/categoryController');
const { authenticateToken, checkAdmin, logRequest } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', logRequest, getCategories); // Obtener todas las categorías
router.post('/', logRequest, authenticateToken, checkAdmin, newCategory); // Crear categoría
router.put('/:id', logRequest, authenticateToken, checkAdmin, updateCategoryById); // Modificar categoría
router.delete('/:id', logRequest, authenticateToken, checkAdmin, deleteCategoryById); // Eliminar categoría

module.exports = router;
