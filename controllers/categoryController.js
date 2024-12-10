const { pool } = require('../config/config');
const apiResponse = require('../helpers/response');
const {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} = require('../models/categoryModel');


// Obtener todas las categorías
const getCategories = async (req, res) => {
  try {
    const category = await getAllCategories();
    return apiResponse(res, 'success', 200, 'Categorías obtenidas con éxito', category);
  } catch (error) {
    return apiResponse(res, 'error', 500, 'Error al obtener categorías', { error: error.message });
  }
};

// Crear una categoría (admin)
const newCategory = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return apiResponse(res, 'error', 400, 'Nombre de la categoría es obligatorio', null);
  }

  try {
    const category = await createCategory(name);

    return apiResponse(res, 'success', 201, 'Categoría creada con éxito', category);
  } catch (error) {
    return apiResponse(res, 'error', 500, 'Error al crear la categoría', { error: error.message });
  }
};

// Modificar una categoría (admin)
const updateCategoryById = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) {
    return apiResponse(res, 'error', 400, 'Nombre de la categoría es obligatorio', null);
  }

  try {
    const category = await updateCategory(id, name);

    if (category.rowCount === 0) {
      return apiResponse(res, 'error', 404, 'Categoría no encontrada', null);
    }

    return apiResponse(res, 'success', 200, 'Categoría actualizada con éxito', category);
  } catch (error) {
    return apiResponse(res, 'error', 500, 'Error al actualizar la categoría', { error: error.message });
  }
};

// Eliminar una categoría (admin)
const deleteCategoryById = async (req, res) => {
  const { id } = req.params;

  try {
    const category = await deleteCategory(id);

    if (category.rowCount === 0) {
      return apiResponse(res, 'error', 404, 'Categoría no encontrada', null);
    }

    return apiResponse(res, 'success', 200, 'Categoría eliminada con éxito', category);
  } catch (error) {
    return apiResponse(res, 'error', 500, 'Error al eliminar la categoría', { error: error.message });
  }
};

module.exports = { getCategories, newCategory, updateCategoryById, deleteCategoryById };
