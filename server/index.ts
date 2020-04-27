import express = require("express");
import mongoose = require("mongoose");
import bodyParser = require("body-parser");

if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const MONGODB_DB = process.env.MONGODB_DB || "flat-app";
const PORT = process.env.PORT || 4000;

main();

async function main() {
  await mongoose.connect(MONGODB_URI, { useNewUrlParser: true });

  const app = express();

  // Set up swagger for api documentation
  const expressSwagger = require("express-swagger-generator")(app);
  const options = {
    swaggerDefinition: {
      info: {
        description: "Server for flat-app",
        title: "API for flat-app",
        version: "1.0.0",
      },
      host: "localhost:4000",
      basePath: "/",
      produces: ["application/json"],
      schemes: ["http"],
    },
    basedir: __dirname,
    files: ["./routes/**/*.js", "./models/**/*.js"],
  };

  expressSwagger(options);

  // Set up request body to be parsed nicely
  app.use(bodyParser.json())

  // Default forward to swagger docs page
  app.get("/", (req, res) => {
    req.url = "/api-docs/";
    app.handle(req, res);
  });

  // Users route
  const users = require("./routes/users");
  app.use("/users", users);

  app.listen(PORT, (err) => {
    if (err) {
      throw err;
    }
    // eslint-disable-next-line no-console
    console.log(`api-server listening on port ${PORT}`);
  });
}
