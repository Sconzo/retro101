import { useParams } from 'react-router-dom';
import { websocketService } from '../../../services/websocket';
import { useRoomStore } from '../../../stores/roomStore';
import type { Card } from '../../../types/room';

export function useCardActions() {
  const { roomId } = useParams<{ roomId: string }>();

  const createCard = (content: string, categoryId: string) => {
    if (!roomId) {
      console.error('No room ID available');
      return;
    }

    if (!websocketService.isConnected()) {
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
      websocketService.sendCardCreate({
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

  const updateCard = (cardId: string, content: string) => {
    if (!roomId) {
      console.error('No room ID available');
      return;
    }

    if (!websocketService.isConnected()) {
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

    // Store original content for rollback
    const originalCards = useRoomStore.getState().cards;
    const originalCard = originalCards.find((c) => c.id === cardId);

    if (!originalCard) {
      console.error('Card not found:', cardId);
      return;
    }

    // Optimistic update - update in store immediately
    const updatedCards = originalCards.map((card) =>
      card.id === cardId
        ? { ...card, content, updatedAt: new Date().toISOString() }
        : card
    );
    useRoomStore.setState({ cards: updatedCards });

    // Send to server
    try {
      websocketService.sendCardUpdate({
        roomId,
        cardId,
        content,
        participantId: participant.id,
      });
    } catch (error) {
      // Rollback on error
      useRoomStore.setState({ cards: originalCards });
      console.error('Failed to update card:', error);
    }
  };

  const deleteCard = (cardId: string) => {
    if (!roomId) {
      console.error('No room ID available');
      return;
    }

    if (!websocketService.isConnected()) {
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

    // Store original cards for rollback
    const originalCards = useRoomStore.getState().cards;

    // Optimistic delete - remove from store immediately
    const updatedCards = originalCards.filter((card) => card.id !== cardId);
    useRoomStore.setState({ cards: updatedCards });

    // Send to server
    try {
      websocketService.sendCardDelete({
        roomId,
        cardId,
        participantId: participant.id,
      });
    } catch (error) {
      // Rollback on error
      useRoomStore.setState({ cards: originalCards });
      console.error('Failed to delete card:', error);
    }
  };

  return { createCard, updateCard, deleteCard };
}
