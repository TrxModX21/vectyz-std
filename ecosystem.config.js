module.exports = {
  apps: [
    {
      name: "server-api",
      script: "./server/dist/server.js",
      cwd: "./server",
      env: {
        NODE_ENV: "production",
        PORT: 3021,
      },
    },
    {
      name: "client-web",
      script: "pnpm",
      args: "start",
      cwd: "./client",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
    {
      name: "admin-dashboard",
      script: "pnpm",
      args: "start",
      cwd: "./admin",
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
    },
  ],
};
