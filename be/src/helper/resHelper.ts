export function getResponseMessage(success, message, data) {
  return {
    success,
    message,
    data,
  };
}

export function errorResponse(success, message) {
  return {
    success,
    message,
  };
}
