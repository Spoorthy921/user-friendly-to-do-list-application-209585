const { getDb } = require('../db/mongodb');

const TASKS_COLLECTION = 'tasks';

// PUBLIC_INTERFACE
async function ensureTasksIndexes() {
  /** Ensure required indexes exist for tasks collection. */
  const db = getDb();
  await db.collection(TASKS_COLLECTION).createIndex({ userId: 1, createdAt: -1 });
}

// PUBLIC_INTERFACE
async function createTask(taskDoc) {
  /** Create a task document. Expects {_id, userId, title, completed, createdAt, updatedAt}. */
  const db = getDb();
  await db.collection(TASKS_COLLECTION).insertOne(taskDoc);
  return taskDoc;
}

// PUBLIC_INTERFACE
async function listTasksByUser(userId) {
  /** List tasks for a user ordered by createdAt desc. */
  const db = getDb();
  return db
    .collection(TASKS_COLLECTION)
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray();
}

// PUBLIC_INTERFACE
async function findTaskByIdForUser(taskId, userId) {
  /** Find a task by id and userId (ownership). */
  const db = getDb();
  return db.collection(TASKS_COLLECTION).findOne({ _id: taskId, userId });
}

// PUBLIC_INTERFACE
async function updateTaskForUser(taskId, userId, update) {
  /** Update a task by id for a user and return updated doc, or null if not found. */
  const db = getDb();
  const result = await db.collection(TASKS_COLLECTION).findOneAndUpdate(
    { _id: taskId, userId },
    { $set: update },
    { returnDocument: 'after' }
  );
  return result.value;
}

// PUBLIC_INTERFACE
async function deleteTaskForUser(taskId, userId) {
  /** Delete a task by id for a user; returns boolean. */
  const db = getDb();
  const result = await db.collection(TASKS_COLLECTION).deleteOne({ _id: taskId, userId });
  return result.deletedCount === 1;
}

module.exports = {
  ensureTasksIndexes,
  createTask,
  listTasksByUser,
  findTaskByIdForUser,
  updateTaskForUser,
  deleteTaskForUser,
};
