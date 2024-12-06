const jwt = require('jsonwebtoken') // Importo el módulo de tokens JWT
const { JWT_SECRET } = require('../config/config') // Importo la llave secreta

// Middleware para autenticar el token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'] // Obtengo el token del header de la solicitud
  const token = authHeader && authHeader.split(' ')[1]
  if (!token) return res.status(403).json({ message: 'Token requerido' })

  // Verifico y decodifico el token usando la llave secreta
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'Token inválido' })
    req.user = user // Guardo los datos del token decodificado en la solicitud
    next()
  })
}

// Middleware para verificar que las credenciales estén presentes
const checkCredentials = (req, res, next) => {
  const { email, password } = req.body
  if (!email || !password)
    return res.status(400).json({ message: 'Credenciales faltantes' })
  next()
}

// Middleware para reportar las consultas recibidas en el servidor
const logRequest = (req, res, next) => {
  console.log(`Consulta recibida: ${req.method} ${req.url}`)
  next()
}

module.exports = { authenticateToken, checkCredentials, logRequest } // Exporto los middlewares
