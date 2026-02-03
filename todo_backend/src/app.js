const cors = require('cors');
const express = require('express');
const routes = require('./routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger');
const { connectToMongo } = require('./db/mongodb');
const usersRepo = require('./repositories/users');
const tasksRepo = require('./repositories/tasks');
const { errorHandler } = require('./middleware/errorHandler');

// Initialize express app
const app = express();

function parseCsvEnv(name, fallback) {
  const value = process.env[name];
  if (!value) return fallback;
  return value.split(',').map((s) => s.trim()).filter(Boolean);
}

const allowedOrigins = parseCsvEnv('ALLOWED_ORIGINS', ['*']);
const allowedMethods = parseCsvEnv('ALLOWED_METHODS', ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS']);
const allowedHeaders = parseCsvEnv('ALLOWED_HEADERS', ['Content-Type', 'Authorization']);
const corsMaxAge = Number.parseInt(process.env.CORS_MAX_AGE || '0', 10);

app.use(
  cors({
    origin: allowedOrigins.includes('*') ? '*' : allowedOrigins,
    methods: allowedMethods,
    allowedHeaders,
    maxAge: Number.isNaN(corsMaxAge) ? undefined : corsMaxAge,
  })
);

const trustProxy = (process.env.TRUST_PROXY || '').toLowerCase() === 'true';
app.set('trust proxy', trustProxy);

app.use('/docs', swaggerUi.serve, (req, res, next) => {
  const host = req.get('host'); // may or may not include port
  let protocol = req.protocol; // http or https

  const actualPort = req.socket.localPort;
  const hasPort = host.includes(':');

  const needsPort =
    !hasPort &&
    ((protocol === 'http' && actualPort !== 80) ||
      (protocol === 'https' && actualPort !== 443));
  const fullHost = needsPort ? `${host}:${actualPort}` : host;
  protocol = req.secure ? 'https' : protocol;

  const dynamicSpec = {
    ...swaggerSpec,
    servers: [
      {
        url: `${protocol}://${fullHost}`,
      },
    ],
  };
  swaggerUi.setup(dynamicSpec)(req, res, next);
});

// Parse JSON request body
app.use(express.json());

/**
 * Initialize DB connection and indexes.
 * This starts immediately at module load so server startup will fail fast on bad DB config.
 */
(async () => {
  try {
    await connectToMongo();
    await Promise.all([usersRepo.ensureUsersIndexes(), tasksRepo.ensureTasksIndexes()]);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Failed to initialize MongoDB', err);
  }
})();

// Mount routes
app.use('/', routes);

// Error handling middleware (must be last)
app.use(errorHandler);

module.exports = app;
