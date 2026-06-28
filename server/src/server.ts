import app from "./app";
import { createServer } from "http";
import { initSocket } from "./socket";
import { config } from "./utils/app.config";
import { initCronJobs } from "./cron/monthly-pool.cron";

const PORT = config.PORT;

initCronJobs();

const server = createServer(app);

// Initialize Socket.io
initSocket(server);

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
