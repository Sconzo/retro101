import { useEffect, useState, useCallback } from 'react';
import {
  websocketService,
  type CardBroadcastMessage,
  type CardCreateMessage,
  type CardUpdateMessage,
  type CardDeleteMessage,
} from '../services/websocket';

export function useWebSocket(roomId: string) {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [reconnectInfo, setReconnectInfo] = useState<{ retryCount: number; maxRetries: number } | null>(null);

  useEffect(() => {
    // Connect to WebSocket
    websocketService.connect(roomId);

    // Subscribe to connection changes
    const unsubscribeConnection = websocketService.onConnectionChange((connected) => {
      setIsConnected(connected);
      if (connected) {
        setReconnectInfo(null); // Clear reconnect info when connected
      }
    });

    // Subscribe to errors
    const unsubscribeError = websocketService.onError((err) => {
      setError(err);
    });

    // Subscribe to reconnection attempts
    const unsubscribeReconnecting = websocketService.onReconnecting((retryCount, maxRetries) => {
      setReconnectInfo({ retryCount, maxRetries });
    });

    // Cleanup
    return () => {
      unsubscribeConnection();
      unsubscribeError();
      unsubscribeReconnecting();
      websocketService.disconnect();
    };
  }, [roomId]);

  const sendCardCreate = useCallback((message: CardCreateMessage) => {
    websocketService.sendCardCreate(message);
  }, []);

  const sendCardUpdate = useCallback((message: CardUpdateMessage) => {
    websocketService.sendCardUpdate(message);
  }, []);

  const sendCardDelete = useCallback((message: CardDeleteMessage) => {
    websocketService.sendCardDelete(message);
  }, []);

  const onMessage = useCallback((callback: (message: CardBroadcastMessage) => void) => {
    return websocketService.onMessage(callback);
  }, []);

  return {
    isConnected,
    error,
    reconnectInfo,
    sendCardCreate,
    sendCardUpdate,
    sendCardDelete,
    onMessage,
  };
}
