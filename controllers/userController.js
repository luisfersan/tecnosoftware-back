
const jwt = require('jsonwebtoken');  // Módulo para la creación y verificación de tokens JWT
const bcrypt = require('bcrypt');     // Módulo para comparar contraseñas encriptadas
const { registerUser, getUserByEmail } = require('../models/userModel'); // Importo las funciones de usuario
const { JWT_SECRET } = require('../config/config'); // Importo la llave secreta para los tokens

// Controlador para registrar un usuario
const register = async (req, res) => {
  try {
    const { email, password, rol, lenguage } = req.body;
    const newUser = await registerUser(email, password, rol, lenguage);
    res.status(201).json({ message: 'Usuario registrado con éxito', user: newUser });
  } catch (error) {
    res.status(500).json({ message: 'Error en el registro', error: error.message });
  }
};

// Controlador para iniciar sesión
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await getUserByEmail(email); // Busco al usuario en la base de datos

    // Verifico si el usuario existe y la contraseña es correcta
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // Genero el token JWT con el email del usuario
    const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    res.status(500).json({ message: 'Error en el inicio de sesión', error: error.message });
  }
};

// Controlador para obtener datos del usuario autenticado
const getUser = async (req, res) => {
  try {
    const { email } = req.user; // Obtengo el email del token decodificado en el middleware
    const user = await getUserByEmail(email);
    if (user) res.json(user); // Si el usuario existe, retorno los datos
    else res.status(404).json({ message: 'Usuario no encontrado' });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuario', error: error.message });
  }
};

module.exports = { register, login, getUser }; // Exporto los controladores para usarlos en las rutas
