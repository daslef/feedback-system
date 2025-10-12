const consoleTransport = [
  {
    target: "pino-pretty",
    options: { colorize: true, translateTime: "yyyy-mm-dd HH:MM:ss" },
  },
];

export default function createTransport({
  isDevelopment,
  service,
}: {
  isDevelopment: boolean;
  service: string;
}) {
  return {
    targets: [
      {
        target: "pino-opentelemetry-transport",
        options: {
          resourceAttributes: {
            "service.name": service,
            "service.version": "1.0.0",
            "deployment.environment": isDevelopment
              ? "development"
              : "production",
          },
        },
      },
      ...(isDevelopment ? consoleTransport : []),
    ],
  };
}
