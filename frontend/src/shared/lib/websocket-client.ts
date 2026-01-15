type Notification = {
  id: number;
  type: string;
  message: string;
  gigId?: string;
  gigTitle?: string;
  timestamp: string;
};

type Listener = (notifications: Notification[]) => void;

const WS_URL = import.meta.env.VITE_WS_URL || "ws://localhost:4000";

class NotificationSocket {
  private ws: WebSocket | null = null;
  private userId: string | null = null;
  private notifications: Notification[] = [];
  private listeners = new Set<Listener>();
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private dismissTimers = new Map<number, ReturnType<typeof setTimeout>>();

  connect(userId: string) {
    this.userId = userId;
    this.open();
  }

  disconnect() {
    this.userId = null;
    this.cleanup();
  }

  subscribe(listener: Listener) {
    this.listeners.add(listener);
    listener(this.notifications); // initial sync

    return () => {
      this.listeners.delete(listener);
    };
  }

  clearNotification(id: number) {
    const timer = this.dismissTimers.get(id);
    if (timer) clearTimeout(timer);

    this.dismissTimers.delete(id);
    this.notifications = this.notifications.filter((n) => n.id !== id);
    this.emit();
  }

  clearAll() {
    this.dismissTimers.forEach(clearTimeout);
    this.dismissTimers.clear();
    this.notifications = [];
    this.emit();
  }

  private open() {
    if (!this.userId) return;

    const ws = new WebSocket(WS_URL);
    this.ws = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "auth", userId: this.userId }));
    };

    ws.onmessage = (e) => this.handleMessage(e.data);
    ws.onerror = console.error;

    ws.onclose = () => {
      this.ws = null;
      this.scheduleReconnect();
    };
  }

  private handleMessage(raw: string) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let data: any;
    try {
      data = JSON.parse(raw);
    } catch {
      return;
    }

    if (data.type !== "hired") return;

    const id = Date.now();
    const notification = { ...data, id };

    this.notifications.push(notification);
    this.emit();

    const timer = setTimeout(() => {
      this.clearNotification(id);
    }, 8000);

    this.dismissTimers.set(id, timer);
  }

  private emit() {
    for (const listener of this.listeners) {
      listener(this.notifications);
    }
  }

  private scheduleReconnect() {
    if (!this.userId) return;

    this.reconnectTimer = setTimeout(() => {
      if (!this.userId) return;
      this.open();
    }, 3000);
  }

  private cleanup() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    this.ws?.close();
    this.ws = null;

    this.dismissTimers.forEach(clearTimeout);
    this.dismissTimers.clear();
  }
}

export const notificationSocket = new NotificationSocket();
