import type { CreateRoomRequest, CreateRoomResponse, Room, Participant } from '../types/room';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export const api = {
  async createRoom(request: CreateRoomRequest): Promise<CreateRoomResponse> {
    const response = await fetch(`${API_URL}/api/rooms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({
        message: 'Failed to create room',
      }));
      throw new Error(error.message || 'Failed to create room');
    }

    return response.json();
  },

  async getRoomById(roomId: string): Promise<Room> {
    const response = await fetch(`${API_URL}/api/rooms/${roomId}`);

    if (!response.ok) {
      throw new Error('Room not found');
    }

    return response.json();
  },

  async addParticipant(roomId: string, name: string): Promise<Participant> {
    const response = await fetch(`${API_URL}/api/rooms/${roomId}/participants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name }),
    });

    if (response.status === 404) {
      throw new Error('ROOM_NOT_FOUND');
    }

    if (response.status === 400) {
      const error = await response.json().catch(() => ({
        message: 'Invalid name',
      }));
      throw new Error(error.message || 'Invalid name');
    }

    if (!response.ok) {
      throw new Error('Failed to join room');
    }

    return response.json();
  },

  async getParticipants(roomId: string): Promise<Participant[]> {
    const response = await fetch(`${API_URL}/api/rooms/${roomId}/participants`);

    if (response.status === 404) {
      throw new Error('ROOM_NOT_FOUND');
    }

    if (!response.ok) {
      throw new Error('Failed to fetch participants');
    }

    return response.json();
  },
};
