const express = require('express');
const {
  getProducts,
  getProduct,
  addProduct,
  editProduct,
  removeProduct,
  getProductsByCategoryController,
  getTopRatedProductsController,
  getpurchasedProducts
} = require('../controllers/productController');
const { logRequest, authenticateToken, checkAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', logRequest, getProducts);
router.get('/top', logRequest, getTopRatedProductsController);
router.get('/:id', logRequest, getProduct);
router.get('/purchased/:id', logRequest, authenticateToken, getpurchasedProducts);
router.get('/category/:categoryName', logRequest, getProductsByCategoryController);
router.post('/', logRequest, authenticateToken, checkAdmin, addProduct);
router.put('/:id', logRequest, authenticateToken, checkAdmin, editProduct);
router.delete('/:id', logRequest, authenticateToken, checkAdmin, removeProduct);

module.exports = router;