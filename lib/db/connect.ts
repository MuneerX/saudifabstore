import mongoose from 'mongoose';

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

let cached: MongooseCache = global.mongooseCache || { conn: null, promise: null };

if (!global.mongooseCache) {
  global.mongooseCache = cached;
}

const DEFAULT_MONGODB_URI = 'mongodb+srv://armuneermalik_db_user:6w3LQtAGWnKSTR0m@cluster0.gwlzl8y.mongodb.net/saudifabstore?retryWrites=true&w=majority';

async function connectToDatabase() {
  const uri = process.env.MONGODB_URI || process.env.MONGODB_URL || process.env.DATABASE_URL || process.env.MONGO_URI || DEFAULT_MONGODB_URI;

  if (!uri) {
    console.warn('MONGODB_URI / DATABASE_URL environment variable is missing.');
    return null;
  }

  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose.connect(uri, opts).then((m) => {
      console.log('Successfully connected to MongoDB Atlas database:', m.connection.name);
      return m;
    }).catch((err) => {
      console.warn('MongoDB Atlas connection failed (IP Whitelist check required in Atlas):', err.message);
      cached.promise = null;
      throw err;
    });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    return null;
  }
}

export default connectToDatabase;