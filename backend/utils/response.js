/**
 * Send standard success response
 * @param {object} res Express response object
 * @param {string} message Custom message
 * @param {any} data Response data payload
 * @param {number} statusCode HTTP Status code
 */
export const sendSuccess = (res, message, data = null, statusCode = 200) => {
  const response = {
    success: true,
    message
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

/**
 * Send standard error response
 * @param {object} res Express response object
 * @param {string} message Error message
 * @param {number} statusCode HTTP Status code
 * @param {array} errors Detailed validation or subsystem errors
 */
export const sendError = (res, message, statusCode = 500, errors = null) => {
  const response = {
    success: false,
    message
  };

  if (errors !== null) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};
