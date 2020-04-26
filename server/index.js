if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();

// Set up swagger for api documentation
const expressSwagger = require("express-swagger-generator")(app);
let options = {
  swaggerDefinition: {
    info: {
      description: "Server for flat-app",
      title: "API for flat-app",
      version: "1.0.0",
    },
    host: "localhost:3000",
    basePath: "/",
    produces: ["application/json"],
    schemes: ["http"],
  },
  basedir: __dirname,
  files: ["./routes/**/*.js"],
};

expressSwagger(options);

app.get("/", (req, res) => {
  // Default forward to swagger docs page
  req.url = "/api-docs/";
  app.handle(req, res);
});

const port = process.env.PORT || 4000;
app.listen(port, () => console.log(`App listening on port: ${port}`));