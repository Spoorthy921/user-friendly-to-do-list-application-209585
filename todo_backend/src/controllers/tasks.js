const tasksService = require('../services/tasks');

class TasksController {
  async create(req, res, next) {
    try {
      const task = await tasksService.createTask(req.user.id, req.body);
      return res.status(201).json({ task });
    } catch (err) {
      return next(err);
    }
  }

  async list(req, res, next) {
    try {
      const tasks = await tasksService.listTasks(req.user.id);
      return res.status(200).json({ tasks });
    } catch (err) {
      return next(err);
    }
  }

  async update(req, res, next) {
    try {
      const { id } = req.params;
      const task = await tasksService.updateTask(req.user.id, id, req.body);
      return res.status(200).json({ task });
    } catch (err) {
      return next(err);
    }
  }

  async remove(req, res, next) {
    try {
      const { id } = req.params;
      await tasksService.deleteTask(req.user.id, id);
      return res.status(204).send();
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new TasksController();
