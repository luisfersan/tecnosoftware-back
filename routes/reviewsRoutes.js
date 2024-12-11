const express = require('express');
const { newReview, getReviews } = require('../controllers/reviewsController');
const {authenticateToken} = require('../middlewares/authMiddleware'); // Middleware para autenticar usuarios

const router = express.Router();

router.post('/', authenticateToken, newReview); // Crear evaluación
router.get('/:productId', getReviews); // Obtener evaluaciones de un producto

module.exports = router;
