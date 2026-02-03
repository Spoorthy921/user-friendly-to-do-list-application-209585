const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'To-Do Backend API',
      version: '1.0.0',
      description: 'Express API for a beginner-friendly to-do app (JWT auth + user-scoped tasks).',
    },
  },
  apis: ['./src/routes/*.js'], // swagger-jsdoc reads JSDoc @swagger blocks from route files
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
