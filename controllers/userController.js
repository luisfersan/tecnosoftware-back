const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { JWT_SECRET } = require('../config/config');
const {
  registerUser,
  getUserByEmail,
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById
} = require('../models/userModel');
const apiResponse = require('../helpers/response');

// Crear un nuevo usuario (registro)
const register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return apiResponse(res, 'error', 400, 'Faltan datos obligatorios', null);
    }

    const newUser = await registerUser(email, password);
    apiResponse(res, 'success', 201, 'Usuario creado con éxito', { user: newUser });
  } catch (error) {
    apiResponse(res, 'error', 500, 'Error al registrar usuario', { error: error.message });
  }
};

// Iniciar sesión
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return apiResponse(res, 'error', 400, 'Credenciales faltantes', null);
    }

    const user = await getUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return apiResponse(res, 'error', 401, 'Credenciales incorrectas', null);
    }

    const token = jwt.sign({ email: user.email, admin: user.admin }, JWT_SECRET, { expiresIn: '1h' });
    apiResponse(res, 'success', 200, 'Inicio de sesión exitoso', { token });
  } catch (error) {
    apiResponse(res, 'error', 500, 'Error al iniciar sesión', { error: error.message });
  }
};

// Función para cerrar sesión
const logout = (req, res) => {
  try {
    res.status(200).json({ message: 'Sesión cerrada con éxito. Elimine el token del cliente.' });
  } catch (error) {
    res.status(500).json({ message: 'Error al cerrar sesión', error: error.message });
  }
};

// Obtener todos los usuarios (solo admin)
const getUsers = async (req, res) => {
  try {
    if (!req.user.admin) {
      return apiResponse(res, 'error', 403, 'Acceso no autorizado', null);
    }

    const users = await getAllUsers();
    apiResponse(res, 'success', 200, 'Usuarios obtenidos con éxito', { users });
  } catch (error) {
    apiResponse(res, 'error', 500, 'Error al obtener usuarios', { error: error.message });
  }
};

// Obtener un usuario por ID (solo admin)
const getUser = async (req, res) => {
  try {
    if (!req.user.admin) {
      return apiResponse(res, 'error', 403, 'Acceso no autorizado', null);
    }

    const { id } = req.params;
    const user = await getUserById(id);

    if (!user) {
      return apiResponse(res, 'error', 404, 'Usuario no encontrado', null);
    }

    apiResponse(res, 'success', 200, 'Usuario obtenido con éxito', { user });
  } catch (error) {
    apiResponse(res, 'error', 500, 'Error al obtener usuario', { error: error.message });
  }
};

// Modificar un usuario por ID (solo admin)
const updateUser = async (req, res) => {
  try {
    if (!req.user.admin) {
      return apiResponse(res, 'error', 403, 'Acceso no autorizado', null);
    }

    const { id } = req.params;
    const updatedUser = await updateUserById(id, req.body);

    if (!updatedUser) {
      return apiResponse(res, 'error', 404, 'Usuario no encontrado', null);
    }

    apiResponse(res, 'success', 200, 'Usuario actualizado con éxito', { user: updatedUser });
  } catch (error) {
    apiResponse(res, 'error', 500, 'Error al actualizar usuario', { error: error.message });
  }
};

// Eliminar un usuario por ID (solo admin)
const deleteUser = async (req, res) => {
  try {
    if (!req.user.admin) {
      return apiResponse(res, 'error', 403, 'Acceso no autorizado', null);
    }

    const { id } = req.params;
    const deleted = await deleteUserById(id);

    if (!deleted) {
      return apiResponse(res, 'error', 404, 'Usuario no encontrado', null);
    }

    apiResponse(res, 'success', 200, 'Usuario eliminado con éxito', null);
  } catch (error) {
    apiResponse(res, 'error', 500, 'Error al eliminar usuario', { error: error.message });
  }
};

module.exports = {
  register,
  login,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  logout
};
