import { MongoDbManager } from '../../utils/mongo-db-manager.js';
import { AuthManager } from '../../utils/auth-manager.js';
import {
  ErrorResponse,
  UnauthorizedInvalidAccessTokenErrorResponse,
  MethodNotAllowedResponse,
  OkResponse,
} from '../../utils/response.js';
import { VisitDocument } from '../../types/visits.js';
import { omitIds } from '../../utils/omit-ids.js';

export async function getAllVisits(
  req: Request,
  dbManager: MongoDbManager,
  authManager: AuthManager
): Promise<Response> {
  try {
    if (req.method !== 'GET') return new MethodNotAllowedResponse(req.method);

    const { db } = await dbManager.getMongoDb();
    const user = await authManager.authenticateUser(req, db);
    if (!user) return new UnauthorizedInvalidAccessTokenErrorResponse();

    const collection = db.collection<VisitDocument>('visits');
    const cursor = collection.find({ userId: user.id });
    const results = await cursor.toArray();

    return new OkResponse(omitIds(results));
  } catch (e) {
    return new ErrorResponse('Something went wrong', 500, e);
  } finally {
    await dbManager.closeMongoClient();
  }
}
