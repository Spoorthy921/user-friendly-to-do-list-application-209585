const { MongoClient } = require('mongodb');

let _client;
let _db;

/**
 * Connect to MongoDB and cache the connection for reuse.
 *
 * Note: Uses env vars provided by the database container contract:
 * - MONGODB_URL
 * - MONGODB_DB
 */

// PUBLIC_INTERFACE
async function connectToMongo() {
  /** Connect to MongoDB and return { client, db }. */
  if (_client && _db) {
    return { client: _client, db: _db };
  }

  const mongoUrl = process.env.MONGODB_URL;
  const dbName = process.env.MONGODB_DB;

  if (!mongoUrl) {
    throw new Error('Missing required env var MONGODB_URL');
  }
  if (!dbName) {
    throw new Error('Missing required env var MONGODB_DB');
  }

  const client = new MongoClient(mongoUrl, {
    // Keep defaults; mongo driver handles pooling.
  });

  await client.connect();
  const db = client.db(dbName);

  _client = client;
  _db = db;

  return { client, db };
}

// PUBLIC_INTERFACE
function getDb() {
  /** Get cached db instance (connectToMongo must have been awaited at least once). */
  if (!_db) {
    throw new Error('MongoDB not initialized. Call connectToMongo() first.');
  }
  return _db;
}

// PUBLIC_INTERFACE
async function closeMongo() {
  /** Close the cached MongoDB client. */
  if (_client) {
    await _client.close();
  }
  _client = undefined;
  _db = undefined;
}

module.exports = {
  connectToMongo,
  getDb,
  closeMongo,
};
