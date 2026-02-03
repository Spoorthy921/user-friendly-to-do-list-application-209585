const { randomUUID } = require('crypto');
const tasksRepo = require('../repositories/tasks');
const { NotFoundError } = require('../middleware/errorHandler');

// PUBLIC_INTERFACE
async function createTask(userId, { title }) {
  /** Create a new task for a user. */
  const now = new Date().toISOString();
  const task = {
    _id: randomUUID(),
    userId,
    title,
    completed: false,
    createdAt: now,
    updatedAt: now,
  };
  await tasksRepo.createTask(task);
  return task;
}

// PUBLIC_INTERFACE
async function listTasks(userId) {
  /** List tasks for a user. */
  return tasksRepo.listTasksByUser(userId);
}

// PUBLIC_INTERFACE
async function updateTask(userId, taskId, { title, completed }) {
  /** Update a task for a user, returns updated task. */
  const update = { updatedAt: new Date().toISOString() };
  if (typeof title !== 'undefined') update.title = title;
  if (typeof completed !== 'undefined') update.completed = completed;

  const updated = await tasksRepo.updateTaskForUser(taskId, userId, update);
  if (!updated) {
    throw new NotFoundError('Task not found');
  }
  return updated;
}

// PUBLIC_INTERFACE
async function deleteTask(userId, taskId) {
  /** Delete a task for a user. */
  const ok = await tasksRepo.deleteTaskForUser(taskId, userId);
  if (!ok) {
    throw new NotFoundError('Task not found');
  }
  return true;
}

module.exports = {
  createTask,
  listTasks,
  updateTask,
  deleteTask,
};
