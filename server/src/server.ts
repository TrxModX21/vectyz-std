import app from "./app";
import { config } from "./utils/app.config";

const PORT = config.PORT;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
