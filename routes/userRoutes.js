const express = require('express') // Importo Express
const { register, login, getUser } = require('../controllers/userController') // Importo controladores de usuario
const {
  authenticateToken,
  checkCredentials,
  logRequest,
} = require('../middlewares/authMiddleware') // Importo middlewares

const router = express.Router()

// Ruta para registrar usuario - verifico credenciales y registro en la base de datos
router.post('/usuarios', logRequest, checkCredentials, register)

// Ruta para iniciar sesión - verifica credenciales y devuelve un token si son correctas
router.post('/login', logRequest, checkCredentials, login)

// Ruta para obtener datos de usuario - requiere autenticación con token
router.get('/usuarios', logRequest, authenticateToken, getUser)

module.exports = router // Exporto el enrutador
