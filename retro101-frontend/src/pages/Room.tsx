import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../services/api';
import type { Room as RoomType } from '../types/room';

export function Room() {
  const { roomId } = useParams<{ roomId: string }>();
  const [room, setRoom] = useState<RoomType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!roomId) return;

    api
      .getRoomById(roomId)
      .then((data) => {
        setRoom(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || 'Failed to load room');
        setLoading(false);
      });
  }, [roomId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">Loading room...</p>
      </div>
    );
  }

  if (error || !room) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Room not found'}</p>
          <a href="/" className="text-blue-600 hover:underline">
            Go back to home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Retrospective Room
          </h1>
          <p className="text-gray-600">Room ID: {room.id}</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {room.categories.map((category) => (
            <div
              key={category.id}
              className="border-2 border-gray-200 rounded-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {category.name}
              </h2>
              <p className="text-gray-500 text-sm">
                Cards will appear here (Story 2.2)
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
