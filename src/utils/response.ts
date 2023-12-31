import { ValidationError } from 'yup';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS, GET, POST, PUT, PATCH, DELETE',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json',
};

export class OkResponse extends Response {
  constructor(data: unknown, status = 200) {
    super(JSON.stringify(data), { status, headers });
  }
}

export class CorsOkResponse extends Response {
  constructor() {
    super('ok', { headers });
  }
}

export class ErrorResponse extends Response {
  constructor(message: string, status: number, details?: any) {
    super(JSON.stringify({ error: message, details }), { status, headers });
  }
}

export class ValidationErrorResponse extends ErrorResponse {
  constructor(error: ValidationError) {
    super('Request validation error', 400, error.errors);
  }
}

export class UnauthorizedErrorResponse extends ErrorResponse {
  constructor(message?: string) {
    super(message ? `Unauthorized: ${message}` : 'Unauthorized', 401);
  }
}

export class NotFoundErrorResponse extends ErrorResponse {
  constructor(item: string) {
    super(`${item} not found`, 404);
  }
}

export class MethodNotAllowedResponse extends ErrorResponse {
  constructor(method: string) {
    super(`Method not allowed: ${method}`, 405);
  }
}

export class UnauthorizedInvalidAccessTokenErrorResponse extends UnauthorizedErrorResponse {
  constructor() {
    super('Authorization failed: Access token is invalid');
  }
}
