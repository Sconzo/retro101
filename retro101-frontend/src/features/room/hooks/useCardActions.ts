import { useParams } from 'react-router-dom';
import { useWebSocket } from '../../../hooks/useWebSocket';
import { useRoomStore } from '../../../stores/roomStore';
import type { Card } from '../../../types/room';

export function useCardActions() {
  const { roomId } = useParams<{ roomId: string }>();
  const { sendCardCreate, isConnected } = useWebSocket(roomId || '');

  const createCard = (content: string, categoryId: string) => {
    if (!roomId) {
      console.error('No room ID available');
      return;
    }

    if (!isConnected) {
      console.error('WebSocket not connected');
      return;
    }

    // Get current participant from localStorage
    const participantKey = `participant_${roomId}`;
    const participantData = localStorage.getItem(participantKey);

    if (!participantData) {
      console.error('No participant found in localStorage');
      return;
    }

    const participant = JSON.parse(participantData);

    // Generate temp ID for optimistic update
    const tempId = `temp-${Date.now()}-${Math.random()}`;

    // Create temp card
    const tempCard: Card = {
      id: tempId,
      content,
      categoryId,
      authorId: participant.id,
      authorName: participant.name,
      roomId: roomId,
      createdAt: new Date().toISOString(),
    };

    // Optimistic update - add to store immediately
    const currentCards = useRoomStore.getState().cards;
    useRoomStore.setState({ cards: [...currentCards, tempCard] });

    // Send to server
    try {
      sendCardCreate({
        roomId,
        categoryId,
        content,
        participantId: participant.id,
      });
    } catch (error) {
      // Rollback on error
      const updatedCards = useRoomStore.getState().cards.filter((c) => c.id !== tempId);
      useRoomStore.setState({ cards: updatedCards });
      console.error('Failed to create card:', error);
    }
  };

  return { createCard };
}
