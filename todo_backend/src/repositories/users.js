const { getDb } = require('../db/mongodb');

const USERS_COLLECTION = 'users';

// PUBLIC_INTERFACE
async function ensureUsersIndexes() {
  /** Ensure required indexes exist for users collection. */
  const db = getDb();
  await db.collection(USERS_COLLECTION).createIndex({ email: 1 }, { unique: true });
}

// PUBLIC_INTERFACE
async function findUserByEmail(email) {
  /** Find a user document by email (lowercased). */
  const db = getDb();
  return db.collection(USERS_COLLECTION).findOne({ email: email.toLowerCase() });
}

// PUBLIC_INTERFACE
async function findUserById(id) {
  /** Find a user document by string _id. */
  const db = getDb();
  return db.collection(USERS_COLLECTION).findOne({ _id: id });
}

// PUBLIC_INTERFACE
async function createUser(userDoc) {
  /** Insert a new user document. Expects {_id, email, passwordHash, createdAt}. */
  const db = getDb();
  await db.collection(USERS_COLLECTION).insertOne(userDoc);
  return userDoc;
}

module.exports = {
  ensureUsersIndexes,
  findUserByEmail,
  findUserById,
  createUser,
};
