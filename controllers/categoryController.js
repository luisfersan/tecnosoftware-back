const { pool } = require('../config/config');
const apiResponse = require('../helpers/response');

// Obtener todas las categorías
const getCategories = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM categories');
    return apiResponse(res, 'success', 200, 'Categorías obtenidas con éxito', result.rows);
  } catch (error) {
    return apiResponse(res, 'error', 500, 'Error al obtener categorías', { error: error.message });
  }
};

// Crear una categoría (admin)
const createCategory = async (req, res) => {
  const { name } = req.body;
  if (!name) {
    return apiResponse(res, 'error', 400, 'Nombre de la categoría es obligatorio', null);
  }

  try {
    const result = await pool.query('INSERT INTO categories (name) VALUES ($1) RETURNING *', [name]);
    return apiResponse(res, 'success', 201, 'Categoría creada con éxito', result.rows[0]);
  } catch (error) {
    return apiResponse(res, 'error', 500, 'Error al crear la categoría', { error: error.message });
  }
};

// Modificar una categoría (admin)
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  if (!name) {
    return apiResponse(res, 'error', 400, 'Nombre de la categoría es obligatorio', null);
  }

  try {
    const result = await pool.query(
      'UPDATE categories SET name = $1 WHERE id = $2 RETURNING *',
      [name, id]
    );

    if (result.rowCount === 0) {
      return apiResponse(res, 'error', 404, 'Categoría no encontrada', null);
    }

    return apiResponse(res, 'success', 200, 'Categoría actualizada con éxito', result.rows[0]);
  } catch (error) {
    return apiResponse(res, 'error', 500, 'Error al actualizar la categoría', { error: error.message });
  }
};

// Eliminar una categoría (admin)
const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query('DELETE FROM categories WHERE id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return apiResponse(res, 'error', 404, 'Categoría no encontrada', null);
    }

    return apiResponse(res, 'success', 200, 'Categoría eliminada con éxito', result.rows[0]);
  } catch (error) {
    return apiResponse(res, 'error', 500, 'Error al eliminar la categoría', { error: error.message });
  }
};

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
