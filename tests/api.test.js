const request = require('supertest');
const app = require('../index'); // Ahora importa la app exportada desde index.js
const { pool } = require('../config/config');

// Datos iniciales para las pruebas
const adminCredentials = {
  email: 'admin@admin.com',
  password: 'admin123',
  username: 'AdminUser',
};
let adminToken = '';
let categoryId = '';
let productId = '';

beforeAll(async () => {
  // Limpiar y reiniciar la base de datos
  await pool.query('TRUNCATE TABLE users, categories, products, orders RESTART IDENTITY CASCADE;');
});

beforeEach(async () => {
  // Crear el administrador antes de cada prueba
  const adminEmail = 'admin@admin.com';
  const adminPassword = 'admin123';
  const adminUsername = 'Admin';

  await pool.query(`
    INSERT INTO users (email, password, username, admin)
    VALUES ($1, $2, $3, $4) ON CONFLICT (email) DO NOTHING;
  `, [adminEmail, adminPassword, adminUsername, true]);

  // Autenticación del admin y obtención del token (esto puede variar dependiendo de tu sistema de autenticación)
  const response = await request(app)
    .post('/users/auth/login')
    .send(adminCredentials);

  adminToken = response.body.token;
  console.log('Token obtenido:', response.body); // Suponiendo que el token se devuelve en esta respuesta
});

afterAll(async () => {
  await pool.end(); // Cierra la conexión a la base de datos después de todas las pruebas
});

describe('API REST Tests', () => {
  // Ruta: Crear Categoría (POST /categories)
  it('Debe crear una nueva categoría (Admin)', async () => {
    const response = await request(app)
      .post('/categories')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: 'Electrónica', description: 'Productos electrónicos' });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe('success');
    categoryId = response.body.data.id; // Guarda el ID de la categoría creada
  });

  // Ruta: Crear Producto (POST /products)
  it('Debe crear un nuevo producto (Admin)', async () => {
    const response = await request(app)
      .post('/products')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Laptop',
        description: 'Laptop de alta gama',
        price: 1500.99,
        stock: 10,
        categoryId: categoryId,
      });

    expect(response.status).toBe(201);
    expect(response.body.status).toBe('success');
    productId = response.body.data.id; // Guarda el ID del producto creado
  });

  // Ruta: Obtener Producto (GET /products/:id)
  it('Debe obtener un producto por su ID', async () => {
    const response = await request(app)
      .get(`/products/${productId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data.name).toBe('Laptop');
  });

  // Ruta: Intentar eliminar categoría sin token (DELETE /categories/:id)
  it('Debe rechazar la eliminación de una categoría sin token', async () => {
    const response = await request(app).delete(`/categories/${categoryId}`);

    expect(response.status).toBe(403); // Código de acceso denegado
    expect(response.body.message).toBe(
      'Acceso denegado: Token requerido para esta acción'
    );
  });
});
