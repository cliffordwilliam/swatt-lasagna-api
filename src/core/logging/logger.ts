import pino from "pino";

export default process.stdout.isTTY
  ? pino({
      transport: {
        target: "pino-pretty",
      },
    })
  : pino();
