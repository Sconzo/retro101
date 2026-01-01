import { create } from 'zustand';
import type { CardBroadcastMessage } from '../services/websocket';
import type { Card } from '../types/room';

type RoomState = {
  cards: Card[];
  connectionStatus: 'disconnected' | 'connecting' | 'connected';
  error: Error | null;
};

type RoomActions = {
  handleCardMessage: (message: CardBroadcastMessage) => void;
  setCards: (cards: Card[]) => void;
  setConnectionStatus: (status: RoomState['connectionStatus']) => void;
  setError: (error: Error | null) => void;
  clearCards: () => void;
};

export const useRoomStore = create<RoomState & RoomActions>((set) => ({
  // State
  cards: [],
  connectionStatus: 'disconnected',
  error: null,

  // Actions
  handleCardMessage: (message: CardBroadcastMessage) => {
    set((state) => {
      switch (message.action) {
        case 'created': {
          // Check if this is a replacement for a temp card (optimistic update)
          const tempCardIndex = state.cards.findIndex(
            (card) =>
              card.id.startsWith('temp-') &&
              card.authorId === message.participantId &&
              card.content === message.content &&
              card.categoryId === message.categoryId
          );

          const newCard: Card = {
            id: message.cardId,
            categoryId: message.categoryId!,
            content: message.content!,
            authorId: message.participantId,
            authorName: message.participantName || message.participantId,
            roomId: '', // Will be set from context
            createdAt: message.timestamp,
          };

          if (tempCardIndex !== -1) {
            // Replace temp card with real card
            const updatedCards = [...state.cards];
            updatedCards[tempCardIndex] = newCard;
            return { cards: updatedCards };
          }

          // Check if card already exists (duplicate prevention)
          const exists = state.cards.some((card) => card.id === message.cardId);
          if (exists) {
            console.warn('Card already exists, skipping:', message.cardId);
            return state;
          }

          // Add new card
          return {
            cards: [...state.cards, newCard],
          };
        }

        case 'updated': {
          return {
            cards: state.cards.map((card) =>
              card.id === message.cardId
                ? {
                    ...card,
                    content: message.content!,
                    updatedAt: message.timestamp,
                  }
                : card
            ),
          };
        }

        case 'deleted': {
          return {
            cards: state.cards.filter((card) => card.id !== message.cardId),
          };
        }

        default:
          console.warn('Unknown action:', message.action);
          return state;
      }
    });
  },

  setCards: (cards) => {
    set({ cards });
  },

  setConnectionStatus: (status) => {
    set({ connectionStatus: status });
  },

  setError: (error) => {
    set({ error });
  },

  clearCards: () => {
    set({ cards: [], error: null });
  },
}));
