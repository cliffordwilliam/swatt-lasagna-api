import { pinoHttp } from "pino-http";
import logger from "../core/logging/logger";

export default pinoHttp({
  logger,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  customLogLevel: function (_req, res, err) {
    if (res.statusCode >= 400 && res.statusCode < 500) {
      return "warn";
    }
    if (res.statusCode >= 500 || err) {
      return "error";
    }
    return "info";
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  customSuccessMessage: function (req, _res) {
    return `${req.method} ${req.url} completed`;
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  customErrorMessage: function (req, _res, err) {
    return `${req.method} ${req.url} failed: ${err.message}`;
  },
});
