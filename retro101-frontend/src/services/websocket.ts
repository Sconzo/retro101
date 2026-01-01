import { Client, type IMessage, StompConfig } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

export type CardBroadcastMessage = {
  action: 'created' | 'updated' | 'deleted';
  cardId: string;
  categoryId?: string;
  content?: string;
  participantId: string;
  participantName?: string;
  timestamp: string;
};

export type CardCreateMessage = {
  roomId: string;
  categoryId: string;
  content: string;
  participantId: string;
};

export type CardUpdateMessage = {
  roomId: string;
  cardId: string;
  content: string;
  participantId: string;
};

export type CardDeleteMessage = {
  roomId: string;
  cardId: string;
  participantId: string;
};

type MessageCallback = (message: CardBroadcastMessage) => void;
type ConnectionCallback = (connected: boolean) => void;
type ErrorCallback = (error: Error) => void;
type ReconnectionCallback = (retryCount: number, maxRetries: number) => void;

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8080';
const MAX_RECONNECT_ATTEMPTS = 10;
const INITIAL_RECONNECT_DELAY = 1000; // 1 second
const MAX_RECONNECT_DELAY = 30000; // 30 seconds

export class WebSocketService {
  private client: Client | null = null;
  private messageCallbacks: MessageCallback[] = [];
  private connectionCallbacks: ConnectionCallback[] = [];
  private errorCallbacks: ErrorCallback[] = [];
  private reconnectionCallbacks: ReconnectionCallback[] = [];
  private currentRoomId: string | null = null;
  private isConnecting = false;
  private reconnectAttempts = 0;
  private reconnectTimeout: number | null = null;

  connect(roomId: string): void {
    if (this.client?.connected && this.currentRoomId === roomId) {
      console.log('Already connected to room:', roomId);
      return;
    }

    if (this.isConnecting) {
      console.log('Connection already in progress');
      return;
    }

    this.isConnecting = true;
    this.currentRoomId = roomId;

    const stompConfig: StompConfig = {
      webSocketFactory: () => new SockJS(`${WS_URL}/ws`),
      debug: (str: string) => {
        console.log('[STOMP]', str);
      },
      reconnectDelay: 0, // We'll handle reconnection manually
      heartbeatIncoming: 10000,
      heartbeatOutgoing: 10000,
      onConnect: () => {
        console.log('WebSocket connected to room:', roomId);
        this.isConnecting = false;
        this.reconnectAttempts = 0; // Reset on successful connection
        this.notifyConnectionChange(true);
        this.subscribeToRoom(roomId);
        this.reconcileState(roomId); // Fetch latest state after reconnect
      },
      onDisconnect: () => {
        console.log('WebSocket disconnected');
        this.isConnecting = false;
        this.notifyConnectionChange(false);
        this.scheduleReconnect(roomId);
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame);
        this.isConnecting = false;
        this.notifyError(new Error(`STOMP error: ${frame.headers['message']}`));
        this.scheduleReconnect(roomId);
      },
      onWebSocketError: (event) => {
        console.error('WebSocket error:', event);
        this.isConnecting = false;
        this.notifyError(new Error('WebSocket connection error'));
      },
    };

    this.client = new Client(stompConfig);
    this.client.activate();
  }

  disconnect(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.client) {
      this.client.deactivate();
      this.client = null;
      this.currentRoomId = null;
      this.isConnecting = false;
      this.reconnectAttempts = 0;
      this.notifyConnectionChange(false);
    }
  }

  private scheduleReconnect(_roomId: string): void {
    if (this.reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.error('Max reconnection attempts reached');
      this.notifyError(new Error('Failed to reconnect after maximum attempts'));
      return;
    }

    this.reconnectAttempts++;

    // Calculate exponential backoff delay: 1s, 2s, 4s, 8s, 16s, 30s (max)
    const delay = Math.min(
      INITIAL_RECONNECT_DELAY * Math.pow(2, this.reconnectAttempts - 1),
      MAX_RECONNECT_DELAY
    );

    console.log(
      `Scheduling reconnect attempt ${this.reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS} in ${delay}ms`
    );

    this.notifyReconnecting(this.reconnectAttempts, MAX_RECONNECT_ATTEMPTS);

    this.reconnectTimeout = setTimeout(() => {
      console.log(`Reconnect attempt ${this.reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}`);
      this.client?.activate();
    }, delay);
  }

  private async reconcileState(roomId: string): Promise<void> {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';
      const response = await fetch(`${API_URL}/api/rooms/${roomId}/cards`);

      if (!response.ok) {
        throw new Error(`Failed to fetch cards: ${response.statusText}`);
      }

      const cards = await response.json();
      console.log('State reconciliation: fetched', cards.length, 'cards');

      // Import roomStore dynamically to avoid circular dependency
      const { useRoomStore } = await import('../stores/roomStore');
      useRoomStore.setState({ cards });
    } catch (error) {
      console.error('Failed to reconcile state after reconnect:', error);
      this.notifyError(new Error('Failed to sync state after reconnection'));
    }
  }

  private subscribeToRoom(roomId: string): void {
    if (!this.client?.connected) {
      console.error('Cannot subscribe: client not connected');
      return;
    }

    this.client.subscribe(`/topic/room.${roomId}`, (message: IMessage) => {
      try {
        const broadcast: CardBroadcastMessage = JSON.parse(message.body);
        console.log('Received broadcast:', broadcast);
        this.notifyMessage(broadcast);
      } catch (error) {
        console.error('Failed to parse message:', error);
        this.notifyError(new Error('Failed to parse WebSocket message'));
      }
    });

    console.log('Subscribed to room:', roomId);
  }

  sendCardCreate(message: CardCreateMessage): void {
    if (!this.client?.connected) {
      console.error('Cannot send message: client not connected');
      this.notifyError(new Error('WebSocket not connected'));
      return;
    }

    this.client.publish({
      destination: '/app/card.create',
      body: JSON.stringify(message),
    });
  }

  sendCardUpdate(message: CardUpdateMessage): void {
    if (!this.client?.connected) {
      console.error('Cannot send message: client not connected');
      this.notifyError(new Error('WebSocket not connected'));
      return;
    }

    this.client.publish({
      destination: '/app/card.update',
      body: JSON.stringify(message),
    });
  }

  sendCardDelete(message: CardDeleteMessage): void {
    if (!this.client?.connected) {
      console.error('Cannot send message: client not connected');
      this.notifyError(new Error('WebSocket not connected'));
      return;
    }

    this.client.publish({
      destination: '/app/card.delete',
      body: JSON.stringify(message),
    });
  }

  onMessage(callback: MessageCallback): () => void {
    this.messageCallbacks.push(callback);
    return () => {
      this.messageCallbacks = this.messageCallbacks.filter((cb) => cb !== callback);
    };
  }

  onConnectionChange(callback: ConnectionCallback): () => void {
    this.connectionCallbacks.push(callback);
    // Immediately notify current state
    if (this.client?.connected) {
      callback(true);
    }
    return () => {
      this.connectionCallbacks = this.connectionCallbacks.filter((cb) => cb !== callback);
    };
  }

  onError(callback: ErrorCallback): () => void {
    this.errorCallbacks.push(callback);
    return () => {
      this.errorCallbacks = this.errorCallbacks.filter((cb) => cb !== callback);
    };
  }

  onReconnecting(callback: ReconnectionCallback): () => void {
    this.reconnectionCallbacks.push(callback);
    return () => {
      this.reconnectionCallbacks = this.reconnectionCallbacks.filter((cb) => cb !== callback);
    };
  }

  private notifyMessage(message: CardBroadcastMessage): void {
    this.messageCallbacks.forEach((callback) => callback(message));
  }

  private notifyConnectionChange(connected: boolean): void {
    this.connectionCallbacks.forEach((callback) => callback(connected));
  }

  private notifyError(error: Error): void {
    this.errorCallbacks.forEach((callback) => callback(error));
  }

  private notifyReconnecting(retryCount: number, maxRetries: number): void {
    this.reconnectionCallbacks.forEach((callback) => callback(retryCount, maxRetries));
  }

  isConnected(): boolean {
    return this.client?.connected ?? false;
  }

  getReconnectAttempts(): number {
    return this.reconnectAttempts;
  }
}

// Singleton instance
export const websocketService = new WebSocketService();
