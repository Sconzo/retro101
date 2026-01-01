export interface Category {
  id: string;
  name: string;
  roomId: string;
}

export interface Participant {
  id: string;
  name: string;
  roomId: string;
  joinedAt: string;
}

export interface Card {
  id: string;
  content: string;
  categoryId: string;
  authorId: string;
  authorName: string;
  roomId: string;
  createdAt: string;
}

export interface Room {
  id: string;
  categories: Category[];
  participants: Participant[];
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
