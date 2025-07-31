export const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'My Next.js API',
      version: '1.0.0',
      description: 'API documentation for my Next.js application',
    },
  },
  apis: ['./src/swagger-docs/**/*.ts'],
};

