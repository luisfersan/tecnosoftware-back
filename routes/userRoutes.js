const express = require('express');
const { register, login, getUsers, getUser, updateUser, deleteUser, logout, getMyProfile } = require('../controllers/userController');
const { authenticateToken, checkCredentials, logRequest, checkAdmin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Rutas para autenticación
router.post('/auth/register', logRequest, checkCredentials, register); // Crear usuario
router.post('/auth/login', logRequest, checkCredentials, login);       // Iniciar sesión
router.post('/auth/logout', logRequest, authenticateToken, logout);     // Cerrar sesión

// Rutas de usuarios (admin)
router.get('', logRequest, authenticateToken, checkAdmin, getUsers);          // Obtener todos los usuarios
router.get('/profile', logRequest, authenticateToken, getMyProfile);          // Obtener todos los usuarios
router.get('/:id', logRequest, authenticateToken, checkAdmin, getUser);       // Obtener usuario por ID
router.put('/:id', logRequest, authenticateToken, checkAdmin, updateUser);    // Modificar usuario por ID
router.delete('/:id', logRequest, authenticateToken, checkAdmin, deleteUser); // Eliminar usuario por ID

module.exports = router;
