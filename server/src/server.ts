import app from "./app";
import { config } from "./utils/app.config";
import { initCronJobs } from "./cron/monthly-pool.cron";

const PORT = config.PORT;

initCronJobs();
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
