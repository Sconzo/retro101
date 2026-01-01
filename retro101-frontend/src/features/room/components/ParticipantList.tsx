import { useEffect, useState } from 'react';
import { api } from '../../../services/api';
import { Avatar } from '../../../components/Avatar';
import { useWebSocket } from '../../../hooks/useWebSocket';
import type { Participant } from '../../../types/room';

interface ParticipantListProps {
  roomId: string;
}

export function ParticipantList({ roomId }: ParticipantListProps) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentParticipantId, setCurrentParticipantId] = useState<string | null>(null);

  // WebSocket connection for real-time updates
  const { onMessage } = useWebSocket(roomId);

  useEffect(() => {
    // Load current participant from localStorage
    const participantKey = `participant_${roomId}`;
    const stored = localStorage.getItem(participantKey);
    if (stored) {
      try {
        const participant = JSON.parse(stored);
        setCurrentParticipantId(participant.id);
      } catch (err) {
        console.error('[ParticipantList] Failed to parse participant from localStorage:', err);
      }
    }
  }, [roomId]);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.getParticipants(roomId);
        setParticipants(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load participants';
        setError(errorMessage);
        console.error('[ParticipantList] Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [roomId]);

  // Listen for participant updates via WebSocket
  useEffect(() => {
    const unsubscribe = onMessage((message: any) => {
      if (message.action === 'participant_joined' && message.participant) {
        setParticipants((prev) => {
          // Check if participant already exists
          const exists = prev.some((p) => p.id === message.participant.id);
          if (exists) return prev;
          // Add new participant
          return [...prev, message.participant];
        });
      }
    });

    return unsubscribe;
  }, [onMessage]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <p className="text-gray-500 text-sm">Loading participants...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-900">
        Participants ({participants.length})
      </h3>

      <ul className="space-y-2 max-h-96 overflow-y-auto" role="list" aria-label="Room participants">
        {participants.map((participant) => {
          const isCurrentUser = participant.id === currentParticipantId;

          return (
            <li
              key={participant.id}
              className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                isCurrentUser ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50'
              }`}
            >
              <Avatar name={participant.name} size={32} />
              <span className="text-sm font-medium text-gray-900">
                {participant.name}
                {isCurrentUser && (
                  <span className="ml-2 text-xs text-blue-600 font-semibold">(You)</span>
                )}
              </span>
            </li>
          );
        })}
      </ul>

      {participants.length === 0 && (
        <p className="text-gray-400 text-sm text-center py-4">
          No participants yet
        </p>
      )}
    </div>
  );
}
