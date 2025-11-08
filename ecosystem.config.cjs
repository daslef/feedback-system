module.exports = {
  apps: [
    {
      name: "web",
      script: "serve",
      env: {
        PM2_SERVE_PATH: "./apps/web/dist",
        PM2_SERVE_PORT: 5173,
      },
    },
    {
      name: "admin",
      script: "serve",
      env: {
        PM2_SERVE_PATH: "/root/feedback-system/apps/admin/dist/",
        PM2_SERVE_PORT: 5174,
        PM2_SERVE_SPA: "true",
      },
    },
    {
      name: "server",
      script: "tsx",
      interpreter: "none",
      args: "watch ./apps/server/src/index.ts",
    },
    {
      name: "workers",
      script: "tsx",
      interpreter: "none",
      args: "./shared/queue/src/run.ts",
    },
    {
      name: "telegram-bot",
      script: "uv",
      args: ["run", "./.venv/bin/fastapi", "run"],
      cwd: "./apps/telegram-bot/",
    },
  ],
};
