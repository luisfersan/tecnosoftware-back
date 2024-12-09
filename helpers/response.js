const apiResponse = (res, status, code, message, data = null) => {
  const response = {
    status: status,
    code: code,
    message: message,
    data: data,
  };
  return res.status(code).json(response);
};

module.exports = apiResponse; // Exportación correcta
