const {
  createReview,
  getReviewsByProductId,
  hasUserPurchasedProduct,
} = require('../models/reviewsModel');
const apiResponse = require('../helpers/response');

// Crear una evaluación
const newReview = async (req, res) => {
  const { product_id, rating, comment } = req.body;
  console.log(req);

  const user_id = req.user.id; // Suponiendo que el usuario está autenticado

  if (!rating || rating < 1 || rating > 5) {
    return apiResponse(res, 'error', 400, 'La calificación debe estar entre 1 y 5', null);
  }

  try {
    // Verificar si el usuario compró el producto
    const hasPurchased = await hasUserPurchasedProduct(user_id, product_id);
    if (!hasPurchased) {
      return apiResponse(res, 'error', 403, 'No puedes evaluar un producto que no has comprado', null);
    }

    // Crear la evaluación
    const review = await createReview(user_id, product_id, rating, comment);
    return apiResponse(res, 'success', 201, 'Evaluación creada con éxito', review);
  } catch (error) {
    return apiResponse(res, 'error', 500, 'Error al crear la evaluación', { error: error.message });
  }
};

// Obtener evaluaciones de un producto
const getReviews = async (req, res) => {
  const { productId } = req.params;

  try {
    const reviews = await getReviewsByProductId(productId);
    return apiResponse(res, 'success', 200, 'Evaluaciones obtenidas con éxito', reviews);
  } catch (error) {
    return apiResponse(res, 'error', 500, 'Error al obtener evaluaciones', { error: error.message });
  }
};


module.exports = { newReview, getReviews };
