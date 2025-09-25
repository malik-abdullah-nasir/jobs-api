const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')

const errorHandlerMiddleware = (err, req, res, next) => {

  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong. Try again later.'
  }

  // Validation Error
  if (err.name === "ValidationError") {
    const errors = Object.keys(err.errors)
    customError.msg = `Unable to validate ${[...errors]}. Please try again.`
    customError.statusCode = StatusCodes.BAD_REQUEST
  }

  // Handling Duplicate Error
  if (err.code && err.code === 11000) {
    customError.msg =  `Duplicate value entered for ${Object.keys(err.keyValue)} field. Please choose another value.`
    customError.statusCode = StatusCodes.BAD_REQUEST
  }

  // Case Error
  if (err.name === "CastError") {
    customError.msg = `No item found with ID: (${err.value})`;
    customError.statusCode = StatusCodes.NOT_FOUND
  }

  return res.status(customError.statusCode).json({ msg: customError.msg });
}

module.exports = errorHandlerMiddleware