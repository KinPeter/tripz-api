import { MongoDbManager } from '../../utils/mongo-db-manager.js';
import { AuthManager } from '../../utils/auth-manager.js';
import {
  ErrorResponse,
  UnauthorizedInvalidAccessTokenErrorResponse,
  MethodNotAllowedResponse,
  OkResponse,
} from '../../utils/response.js';
import { getAccessToken } from '../../utils/crypt-jwt.js';

export async function refreshToken(
  req: Request,
  dbManager: MongoDbManager,
  authManager: AuthManager
): Promise<Response> {
  try {
    if (req.method !== 'POST') return new MethodNotAllowedResponse(req.method);

    const { db } = await dbManager.getMongoDb();
    const user = await authManager.authenticateUser(req, db);
    if (!user) return new UnauthorizedInvalidAccessTokenErrorResponse();

    const { email, id } = user;
    const { token, expiresAt } = getAccessToken(email, id);
    return new OkResponse({ id, email, token, expiresAt });
  } catch (e) {
    return new ErrorResponse('Something went wrong', 500, e);
  } finally {
    await dbManager.closeMongoClient();
  }
}
