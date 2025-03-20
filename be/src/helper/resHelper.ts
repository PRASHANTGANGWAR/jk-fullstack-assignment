export function getResponseMessage(success: boolean, message: string, data: object | object[]) {
  return {
    success,
    message,
    data,
  };
}

export function errorResponse(success: boolean, message: string) {
  return {
    success,
    message,
  };
}
