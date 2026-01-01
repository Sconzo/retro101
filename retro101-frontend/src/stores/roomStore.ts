import { create } from 'zustand';
import type { CardBroadcastMessage } from '../services/websocket';

export type Card = {
  id: string;
  categoryId: string;
  content: string;
  participantId: string;
  participantName?: string;
  createdAt: string;
  updatedAt?: string;
};

type RoomState = {
  cards: Card[];
  connectionStatus: 'disconnected' | 'connecting' | 'connected';
  error: Error | null;
};

type RoomActions = {
  handleCardMessage: (message: CardBroadcastMessage) => void;
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
          // Check if card already exists (duplicate prevention)
          const exists = state.cards.some((card) => card.id === message.cardId);
          if (exists) {
            console.warn('Card already exists, skipping:', message.cardId);
            return state;
          }

          const newCard: Card = {
            id: message.cardId,
            categoryId: message.categoryId!,
            content: message.content!,
            participantId: message.participantId,
            participantName: message.participantName,
            createdAt: message.timestamp,
          };

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
