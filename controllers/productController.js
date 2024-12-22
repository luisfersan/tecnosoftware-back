const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductsByCategory,
  getTopRatedProducts,
  purchasedProducts
} = require('../models/productModel');
const apiResponse = require('../helpers/response');

// Obtener todos los productos
const getProducts = async (req, res) => {
  try {
    const products = await getAllProducts()
    apiResponse(res, 'success', 200, 'Productos obtenidos con éxito', {products})
  } catch (error) {
    apiResponse(res, 'error', 500, 'Error al obtener los productos', {
      error: error.message,
    })
  }
}

// Obtener un producto por ID
const getProduct = async (req, res) => {
  try {
    const { id } = req.params
    const product = await getProductById(id)
    if (!product) {
      return apiResponse(res, 'error', 404, 'Producto no encontrado', null)
    }
    apiResponse(res, 'success', 200, 'Producto obtenido con éxito', product)
  } catch (error) {
    apiResponse(res, 'error', 500, 'Error al obtener el producto', {
      error: error.message,
    })
  }
}

// Crear un nuevo producto
const addProduct = async (req, res) => {
  console.log(req.body)
  try {
    const { name, image, description, price, stock, category_id } = req.body
    const newProduct = await createProduct({
      name,
      image,
      description,
      price,
      stock,
      category_id,
    })
    apiResponse(
      res,
      'success',
      201,
      'Producto creado con éxito',
      newProduct.rows
    )
  } catch (error) {
    console.log(error.message)
    apiResponse(res, 'error', 500, 'Error al crear el producto', {
      error: error.message,
    })

}
}

// Actualizar un producto
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category_id } = req.body;

    // Recuperar el producto original
    const originalProduct = await getProductById(id);
    if (!originalProduct) {
      return apiResponse(res, 'error', 404, 'Producto no encontrado', null);
    }

    // Rellenar los datos faltantes con los valores originales
    const updatedData = {
      name: name || originalProduct.name,
      description: description || originalProduct.description,
      price: price !== undefined ? price : originalProduct.price, // Permite que el precio sea 0
      stock: stock !== undefined ? stock : originalProduct.stock, // Permite que el stock sea 0
      category_id: category_id || originalProduct.category_id,
    };

    // Actualizar el producto
    const updatedProduct = await updateProduct(id, updatedData);
    if (!updatedProduct) {
      console.log('No encontrado');
      return apiResponse(res, 'error', 404, 'Producto no encontrado', null);
    }

    // Respuesta exitosa
    apiResponse(res, 'success', 200, 'Producto actualizado con éxito', updatedProduct);
  } catch (error) {
    console.error(error.message);
    apiResponse(res, 'error', 500, 'Error al actualizar el producto', {
      error: error.message,
    });
  }
};

// Eliminar un producto
const removeProduct = async (req, res) => {
  try {
    const { id } = req.params
    const deletedProduct = await deleteProduct(id)
    if (!deletedProduct) {
      return apiResponse(res, 'error', 404, 'Producto no encontrado', null)
    }
    apiResponse(
      res,
      'success',
      200,
      'Producto eliminado con éxito',
      deletedProduct
    )
  } catch (error) {
    apiResponse(res, 'error', 500, 'Error al eliminar el producto', {
      error: error.message,
    })
  }
}

const getProductsByCategoryController = async (req, res) => {
  const { categoryName } = req.params; // Obtiene el nombre de la categoría de los parámetros de la URL
  try {
      const products = await getProductsByCategory(categoryName); // Llama a la función del modelo
      if (products.length === 0) {
          return res.status(404).json({ message: 'No se encontraron productos para esta categoría' });
      }
      res.status(200).json(products); // Devuelve los productos en la respuesta
  } catch (error) {
      console.error('Error al obtener productos:', error);
      res.status(500).json({ message: 'Hubo un error al obtener los productos' }); // Error en el servidor
  }
};

// Controlador para obtener productos mejor evaluados
const getTopRatedProductsController = async (req, res) => {
  try {
      const topRatedProducts = await getTopRatedProducts(); // Llama a la función del modelo
      if (topRatedProducts.length === 0) {
          return res.status(404).json({ message: 'No se encontraron productos mejor evaluados' });
      }
      res.status(200).json(topRatedProducts); // Devuelve los productos mejor evaluados
  } catch (error) {
      console.error('Error al obtener productos mejor evaluados:', error);
      res.status(500).json({ message: 'Hubo un error al obtener los productos mejor evaluados' });
  }
};

const getpurchasedProducts = async (req, res) => {
  try {
    const { id } = req.params;
    const products = await purchasedProducts(id);
    apiResponse(res, 'success', 200, 'Productos comprados con éxito', {products});
  } catch (error) {
    apiResponse(res, 'error', 500, 'Error al obtener los productos comprados', {
      error: error.message,
    });
  }
};

module.exports = {
  getProducts,
  getProduct,
  addProduct,
  editProduct,
  removeProduct,
  getProductsByCategoryController,
  getTopRatedProductsController,
  getpurchasedProducts
}
