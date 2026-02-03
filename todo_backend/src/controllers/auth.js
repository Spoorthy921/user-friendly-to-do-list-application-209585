const authService = require('../services/auth');

class AuthController {
  /**
   * Register a new user.
   */
  async register(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.register({ email, password });
      return res.status(201).json(result);
    } catch (err) {
      return next(err);
    }
  }

  /**
   * Login an existing user.
   */
  async login(req, res, next) {
    try {
      const { email, password } = req.body;
      const result = await authService.login({ email, password });
      return res.status(200).json(result);
    } catch (err) {
      return next(err);
    }
  }

  /**
   * Logout endpoint (stateless JWT).
   * Client should delete its stored token.
   */
  logout(req, res) {
    return res.status(200).json({ status: 'ok', message: 'Logged out' });
  }

  /**
   * Get current user info.
   */
  async me(req, res, next) {
    try {
      const user = await authService.me(req.user.id);
      return res.status(200).json({ user });
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new AuthController();
