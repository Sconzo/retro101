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

const WS_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8080';

export class WebSocketService {
  private client: Client | null = null;
  private messageCallbacks: MessageCallback[] = [];
  private connectionCallbacks: ConnectionCallback[] = [];
  private errorCallbacks: ErrorCallback[] = [];
  private currentRoomId: string | null = null;
  private isConnecting = false;

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
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        console.log('WebSocket connected to room:', roomId);
        this.isConnecting = false;
        this.notifyConnectionChange(true);
        this.subscribeToRoom(roomId);
      },
      onDisconnect: () => {
        console.log('WebSocket disconnected');
        this.isConnecting = false;
        this.notifyConnectionChange(false);
      },
      onStompError: (frame) => {
        console.error('STOMP error:', frame);
        this.isConnecting = false;
        this.notifyError(new Error(`STOMP error: ${frame.headers['message']}`));
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
    if (this.client) {
      this.client.deactivate();
      this.client = null;
      this.currentRoomId = null;
      this.isConnecting = false;
      this.notifyConnectionChange(false);
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

  private notifyMessage(message: CardBroadcastMessage): void {
    this.messageCallbacks.forEach((callback) => callback(message));
  }

  private notifyConnectionChange(connected: boolean): void {
    this.connectionCallbacks.forEach((callback) => callback(connected));
  }

  private notifyError(error: Error): void {
    this.errorCallbacks.forEach((callback) => callback(error));
  }

  isConnected(): boolean {
    return this.client?.connected ?? false;
  }
}

// Singleton instance
export const websocketService = new WebSocketService();
