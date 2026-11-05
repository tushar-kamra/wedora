import 'server-only';
import mongoose from 'mongoose';
import { getServerEnv } from '@/server/config/env';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var __wedoraMongooseCache: MongooseCache | undefined;
}

const globalCache: MongooseCache = globalThis.__wedoraMongooseCache ?? {
  conn: null,
  promise: null,
};

if (!globalThis.__wedoraMongooseCache) {
  globalThis.__wedoraMongooseCache = globalCache;
}

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (globalCache.conn && mongoose.connection.readyState === 1) {
    return globalCache.conn;
  }

  if (!globalCache.promise) {
    const { MONGODB_URI } = getServerEnv();

    globalCache.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 8000,
      })
      .catch((error) => {
        globalCache.promise = null;
        throw error;
      });
  }

  globalCache.conn = await globalCache.promise;
  return globalCache.conn;
}

