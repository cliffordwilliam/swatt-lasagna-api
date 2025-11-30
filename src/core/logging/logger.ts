import pino from "pino";

export default process.stdout.isTTY
  ? pino({
      transport: {
        target: "pino-pretty",
      },
      serializers: {
        err: pino.stdSerializers.err,
      },
    })
  : pino({
      serializers: {
        err: pino.stdSerializers.err,
      },
    });
