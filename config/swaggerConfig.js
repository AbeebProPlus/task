const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Authntication API",
      version: "1.0.0",
      description: "An authentication API",
    },
    servers: [
      {
        url: "http://localhost:8080",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./routes/*.js"],
  security: [
    {
      bearerAuth: [],
    },
  ],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
