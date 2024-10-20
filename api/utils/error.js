//error and message defined by my own, so (statusCode, message)
export const errorHandler = (statusCode, message) => {
  //js error constructor
  const error = new Error();
  error.statusCode = statusCode;
  error.message = message;
  return error;
}