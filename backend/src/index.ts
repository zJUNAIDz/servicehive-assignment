import { app } from "./app";
import { PORT } from "./lib/constants";
import { connectDB } from "./models";

function start() {
  try {
    connectDB();
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();
