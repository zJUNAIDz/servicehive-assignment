import { createServer } from "http";
import { app } from "./app";
import { PORT } from "./lib/constants";
import { wsManager } from "./lib/websocket";
import { connectDB } from "./models";

function start() {
  try {
    connectDB();
    
    // Create HTTP server
    const server = createServer(app);
    
    // Initialize WebSocket server
    wsManager.initialize(server);
    
    server.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`WebSocket server is ready`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

start();
