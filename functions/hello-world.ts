import type { Context } from '@netlify/functions';
import { withMongoDb } from '../src/mongo-hof.js';
import { Db } from 'mongodb';
import { ErrorResponse } from '../src/response.js';
import { User, withAuthentication } from '../src/auth-hof.js';

export default async (req: Request, context: Context) => {
  return await withMongoDb(await withAuthentication(run), req, context);
};

async function run(req: Request, context: Context, db: Db, user: User): Promise<Response> {
  try {
    console.log(req.url, context.requestId);
    // Send a ping to confirm a successful connection
    await db.command({ ping: 1 });
    return new Response(
      'Pinged your deployment. You successfully connected to MongoDB! User id is: ' + user.id
    );
  } catch (e) {
    return new ErrorResponse('Something went wrong in run()', 500, e);
  }
}
