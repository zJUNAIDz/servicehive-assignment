import type { IncomingMessage } from "http";
import { WebSocketServer, WebSocket } from "ws";

interface ClientSocket extends WebSocket {
  userId?: string;
  isAlive: boolean;
}

type AuthMessage = {
  type: "auth";
  userId: string;
};

class WebSocketManager {
  private wss?: WebSocketServer;
  private clients = new Map<string, ClientSocket>();
  private heartbeatInterval?: NodeJS.Timeout;

  initialize(server: any) {
    this.wss = new WebSocketServer({ server });
    this.wss.on("connection", this.handleConnection);

    this.startHeartbeat();

    this.wss.on("close", () => this.stopHeartbeat());
    console.log("WebSocket server initialized");
  }

  // Connection lifecycle
  private handleConnection = (ws: ClientSocket, _req: IncomingMessage) => {
    console.log("New WebSocket connection");

    ws.isAlive = true;

    ws.on("pong", () => (ws.isAlive = true));
    ws.on("message", (msg) => this.handleMessage(ws, msg));
    ws.on("close", () => this.handleClose(ws));
    ws.on("error", console.error);
  };

  private handleMessage(ws: ClientSocket, raw: WebSocket.RawData) {
    const message = this.safeParse(raw);
    if (!message) return;

    if (message.type === "auth") {
      this.authenticate(ws, message);
    }
  }

  private handleClose(ws: ClientSocket) {
    if (!ws.userId) return;

    this.clients.delete(ws.userId);
    console.log(`User ${ws.userId} disconnected`);
  }

  // Protocol handling
  private authenticate(ws: ClientSocket, msg: AuthMessage) {
    ws.userId = msg.userId;
    this.clients.set(msg.userId, ws);

    ws.send(
      JSON.stringify({
        type: "auth_success",
        message: "Connected to notifications",
      })
    );

    console.log(`User ${msg.userId} authenticated`);
  }

  private safeParse(raw: WebSocket.RawData): any | null {
    try {
      return JSON.parse(raw.toString());
    } catch {
      console.error("Invalid WebSocket message");
      return null;
    }
  }

  // Heartbeat (ping - pong) to detect dead connections
  private startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      this.wss?.clients.forEach((ws) => {
        const client = ws as ClientSocket;
        if (!client.isAlive) {
          client.terminate();
          return;
        }

        client.isAlive = false;
        client.ping();
      });
    }, 30_000);
  }

  private stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
    }
  }

  sendNotificationToUser(userId: string, payload: unknown): boolean {
    const client = this.clients.get(userId);

    if (!client || client.readyState !== WebSocket.OPEN) {
      return false;
    }

    client.send(JSON.stringify(payload));
    return true;
  }

  getConnectedClients(): string[] {
    return [...this.clients.keys()];
  }
}

export const wsManager = new WebSocketManager();
