const request = require('supertest');
const app = require('../index');

describe('Pruebas para rutas públicas', () => {

  it('Debe obtener todas las categorías', async () => {
    const response = await request(app).get('/categories');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(Array.isArray(response.body.data)).toBe(true);
  });



  it('Debe obtener todos los productos', async () => {
    const response = await request(app).get('/products');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(Array.isArray(response.body.data)).toBe(true);
  });


  it('Debe obtener un producto por su ID', async () => {
    const productId = 1;
    const response = await request(app).get(`/products/${productId}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data).toHaveProperty('id', productId);
  });


  it('Debe devolver un error si el producto no existe', async () => {
    const nonExistentId = 9999;
    const response = await request(app).get(`/products/${nonExistentId}`);

    expect(response.status).toBe(404);
    expect(response.body.status).toBe('error');
    expect(response.body.message).toBe('Producto no encontrado');
  });
});
