const winston = require("winston");
const ecsFormat = require("@elastic/ecs-winston-format");

const logger = winston.createLogger({
  level: "debug",
  format: ecsFormat({
    convertReqRes: true,
    convertErr: true,
    apmIntegration: true,
    serviceName: "my-service-name",
    serviceEnvironment: "my-environment",
  }),
  transports: [
    //new winston.transports.Console(),
    new winston.transports.File({
      //path to log file
      filename: "logs/log.json",
      level: "debug",
    }),
  ],
});

module.exports = { logger };
