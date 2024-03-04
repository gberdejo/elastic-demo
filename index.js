const { logger } = require("./logger");
const express = require("express");
const { Sequelize, DataTypes, DATE } = require("sequelize");

const sequelize = new Sequelize("balancer", "root", "123456", {
  host: "localhost",
  port: 3307,
  logging: false,
  dialect: "mysql",
});

const ReglasCall = sequelize.define(
  "reglas_call",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre_call: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    c2c: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
    },
    role_id_2: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: "reglas_call",
  }
);

const app = express();
const apm = require("elastic-apm-node").start({
  // Override service name from package.json
  // Allowed characters: a-z, A-Z, 0-9, -, _, and space
  serviceName: "my-service-name",

  // Use if APM Server requires a token
  secretToken: "SMBbgbBZcTWGlhuonK",

  // Use if APM Server uses API keys for authentication
  //   apiKey:
  //     "https://ebd9eceaa14d4deba92544bb9d9aa70f.apm.us-central1.gcp.cloud.es.io:443",

  // Set custom APM Server URL (default: http://127.0.0.1:8200)
  serverUrl:
    "https://ebd9eceaa14d4deba92544bb9d9aa70f.apm.us-central1.gcp.cloud.es.io:443",
  environment: "my-environment",
  captureHeaders: true,
});

app.use(express.json());
app.use((req, res, next) => {
  logger.info("handled request", { req, res });

  req.apm = apm;

  next();
});

app.get("/", function (req, res) {
  res.send("Hello World!");
});

app.post("/", async (req, res) => {
  try {
    logger.info("ControllerPost", req.body);

    if (req.body?.id === 1) {
      throw new Error("Error 1 de prueba");
    }

    const response = (
      await ReglasCall.create({
        nombre_call: "llamada_de_ejemplo",
        c2c: "c2c_ejemplo",
        role_id: "id_de_rol_ejemplo",
        role_id_2: "id_de_rol_2_ejemplo",
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    ).get({ plain: true });

    logger.info("results", response);
    logger.info(response);

    res.status(200).json(response);
  } catch (error) {
    apm.captureError(error);
    res.status(500).json({ message: error.message });
  }
});

app.listen(3000);
