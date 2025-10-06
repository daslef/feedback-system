const consoleTransport = [
  {
    target: "pino-pretty",
    options: { colorize: true, translateTime: "yyyy-mm-dd HH:MM:ss" },
  },
];

const otlTransport = {
  target: "pino-opentelemetry-transport",
  options: {
    resourceAttributes: {
      "service.name": "nodejs-api",
      "service.version": process.env.APP_VERSION || "1.0.0",
      "deployment.environment": process.env.NODE_ENV || "development",
    },
  },
};

export default function createTransport({
  isDevelopment,
}: {
  isDevelopment: boolean;
}) {
  return {
    targets: [otlTransport, ...(isDevelopment ? consoleTransport : [])],
  };
}
