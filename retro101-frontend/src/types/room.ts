export interface Category {
  id: string;
  name: string;
  roomId: string;
}

export interface Room {
  id: string;
  categories: Category[];
  createdAt: string;
  active: boolean;
}

export interface CreateRoomRequest {
  categories: string[];
}

export interface CreateRoomResponse {
  roomId: string;
  shareLink: string;
  room: Room;
}
