const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../models/productModel');
const apiResponse = require('../helpers/response');

// Obtener todos los productos
const getProducts = async (req, res) => {
  try {
    const products = await getAllProducts();
    apiResponse(res, 'success', 200, 'Productos obtenidos con éxito', products);
  } catch (error) {
    apiResponse(res, 'error', 500, 'Error al obtener los productos', { error: error.message });
  }
};

// Obtener un producto por ID
const getProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await getProductById(id);
    if (!product) {
      return apiResponse(res, 'error', 404, 'Producto no encontrado', null);
    }
    apiResponse(res, 'success', 200, 'Producto obtenido con éxito', product);
  } catch (error) {
    apiResponse(res, 'error', 500, 'Error al obtener el producto', { error: error.message });
  }
};

// Crear un nuevo producto
const addProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category_id } = req.body;
    const newProduct = await createProduct({ name, description, price, stock, category_id });
    apiResponse(res, 'success', 201, 'Producto creado con éxito', newProduct);
  } catch (error) {
    apiResponse(res, 'error', 500, 'Error al crear el producto', error);
  }
};

// Actualizar un producto
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category_id } = req.body;
    const updatedProduct = await updateProduct(id, { name, description, price, stock, category_id });
    if (!updatedProduct) {
      return apiResponse(res, 'error', 404, 'Producto no encontrado', null);
    }
    apiResponse(res, 'success', 200, 'Producto actualizado con éxito', updatedProduct);
  } catch (error) {
    apiResponse(res, 'error', 500, 'Error al actualizar el producto', { error: error.message });
  }
};

// Eliminar un producto
const removeProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedProduct = await deleteProduct(id);
    if (!deletedProduct) {
      return apiResponse(res, 'error', 404, 'Producto no encontrado', null);
    }
    apiResponse(res, 'success', 200, 'Producto eliminado con éxito', deletedProduct);
  } catch (error) {
    apiResponse(res, 'error', 500, 'Error al eliminar el producto', { error: error.message });
  }
};

module.exports = { getProducts, getProduct, addProduct, editProduct, removeProduct };
