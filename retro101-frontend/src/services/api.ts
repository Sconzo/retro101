import type { CreateRoomRequest, CreateRoomResponse, Room } from '../types/room';

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
};
