class WebSocketClient {
  private ws: WebSocket | null;
  private uri: string;
  private connectionCallbacks: Array<() => void>;
  private messageCallbacks: { [key: string]: Array<(message: any) => void> };
  private closeCallbacks: Array<() => void>;
  private requestId: number;

  constructor() {
    this.uri = "";
    this.ws = null;

    this.connectionCallbacks = [];
    this.messageCallbacks = {};
    this.closeCallbacks = [];
    this.requestId = 0;
  }

  public reconnect(uri: string) {
    if (this.uri === uri && this.ws && this.ws.readyState === WebSocket.OPEN) {
      return;
    }
    this.uri = uri;
    if (this.ws && this.ws.readyState !== WebSocket.CONNECTING) {
      this.ws.close();
    }
    try {
      this.ws = new WebSocket(uri);
    } catch (e) {
      this.closeCallbacks.forEach(callback => callback());
      for (const callback of this.closeCallbacks) {
        callback();
      }
      return;
    }
    this.setCallbacks();
  }

  private setCallbacks = () => {
    if (!this.ws) {
      return;
    }
    this.ws.onopen = () => {
      this.connectionCallbacks.forEach(callback => callback());
    };

    this.ws.onmessage = (event) => {
      const message = event.data;
      const data = JSON.parse(message);
      console.log('Got message', data);
      if (this.messageCallbacks[data.type]) {
        this.messageCallbacks[data.type].forEach(callback => callback(data.data));
      }
    };

    this.ws.onclose = () => {
      this.closeCallbacks.forEach(callback => callback());
      setTimeout(() => {
        this.reconnect(this.uri);
      }, 1000);
    };
  }

  public send(message: string) {
    if (!this.ws) {
      return;
    }
    this.ws.send(message);
  }

  public request(request_type: string, data: any, callback: (data: any) => void) {
    const requestId = (this.requestId++).toString();
    this.onMessage(
      requestId,
      (msg) => {
        callback(msg);
        delete this.messageCallbacks[requestId];
      }
    );
    this.send(JSON.stringify({
      "type": request_type,
      "request_id": requestId,
      "data": data
    }));
  }

  public onConnected(callback: () => void) {
    this.connectionCallbacks.push(callback);
  }

  public onMessage(message_type: string, callback: (message: any) => void) {
    if (!this.messageCallbacks[message_type]) {
      this.messageCallbacks[message_type] = [];
    }
    this.messageCallbacks[message_type].push(callback);
  }

  public onDisconnected(callback: () => void) {
    this.closeCallbacks.push(callback);
  }
}

const api = new WebSocketClient();
export default api;