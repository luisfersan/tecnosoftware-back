const express = require('express');
const {
  getProducts,
  getProduct,
  addProduct,
  editProduct,
  removeProduct,
  getProductsByCategoryController,
  getTopRatedProductsController
} = require('../controllers/productController');
const { logRequest, authenticateToken, checkAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', logRequest, getProducts); // Listar productos
router.get('/top', logRequest, getTopRatedProductsController);
router.get('/:id', logRequest, getProduct); // Obtener producto por ID
router.get('/category/:categoryName', logRequest, getProductsByCategoryController);
router.post('/', logRequest, authenticateToken, checkAdmin, addProduct); // Crear producto
router.put('/:id', logRequest, authenticateToken, checkAdmin, editProduct); // Editar producto
router.delete('/:id', logRequest, authenticateToken, checkAdmin, removeProduct); // Eliminar producto

module.exports = router;