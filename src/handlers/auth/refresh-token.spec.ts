import { MockCollection, MockDb, MockDbManager } from '../../mock/db.mock.js';
import { MongoDbManager } from '../../utils/mongo-db-manager.js';
import { MockAuthManager } from '../../mock/auth.mock.js';
import { refreshToken } from './refresh-token.js';

describe('refreshToken', () => {
  let db: MockDb;
  let collection: MockCollection;
  let dbManager: MockDbManager;
  let authManager: MockAuthManager;

  beforeEach(() => {
    process.env.JWT_SECRET = 'secret';
    process.env.TOKEN_EXPIRY = '7';
    db = new MockDb();
    collection = new MockCollection();
    dbManager = new MockDbManager(db, collection);
    authManager = new MockAuthManager();
    db.collection.and.returnValue(collection);
  });

  it('should return a new access token if the current one is valid', async () => {
    authManager.authenticateUser.and.resolveTo({ email: 'test@test.com', id: '123' });
    const response = await refreshToken(
      { method: 'POST' } as Request,
      dbManager as unknown as MongoDbManager,
      authManager
    );
    expect(response.status).toEqual(200);
    const data = await response.json();
    expect(typeof data.token).toBe('string');
    expect(typeof data.expiresAt).toBe('string');
  });

  it('should return unauthorized error if authorization fails', async () => {
    authManager.authenticateUser.and.resolveTo(null);
    const response = await refreshToken(
      { method: 'POST' } as Request,
      dbManager as unknown as MongoDbManager,
      authManager
    );
    expect(response.status).toEqual(401);
  });

  ['GET', 'PUT', 'DELETE', 'PATCH'].forEach(method => {
    it(`should not allow ${method} requests`, async () => {
      const response = await refreshToken({ method } as Request, dbManager as unknown as MongoDbManager, authManager);
      expect(response.status).toEqual(405);
    });
  });
});
