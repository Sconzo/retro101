import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import type { Room as RoomType } from '../types/room';
import { OnboardingModal } from '../features/room/components/OnboardingModal';
import { ParticipantList } from '../features/room/components/ParticipantList';
import { CategoryColumn } from '../features/room/components/CategoryColumn';
import { useWebSocket } from '../hooks/useWebSocket';
import { useRoomStore } from '../stores/roomStore';
import { ConnectionStatus } from '../components/ConnectionStatus';

export function Room() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<RoomType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFirstVisit, setIsFirstVisit] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  // WebSocket connection
  const { isConnected, error: wsError, onMessage } = useWebSocket(roomId || '');
  const { handleCardMessage, setConnectionStatus, setError: setWsError, clearCards } = useRoomStore();

  // Update connection status based on WebSocket state
  useEffect(() => {
    if (isConnected) {
      setConnectionStatus('connected');
    } else {
      setConnectionStatus('disconnected');
    }
  }, [isConnected, setConnectionStatus]);

  // Handle WebSocket errors
  useEffect(() => {
    if (wsError) {
      setWsError(wsError);
      console.error('WebSocket error:', wsError);
    }
  }, [wsError, setWsError]);

  // Subscribe to WebSocket messages
  useEffect(() => {
    if (!roomId) return;

    const unsubscribe = onMessage((message) => {
      handleCardMessage(message);
    });

    return () => {
      unsubscribe();
      clearCards();
    };
  }, [roomId, onMessage, handleCardMessage, clearCards]);

  useEffect(() => {
    if (!roomId) {
      navigate('/');
      return;
    }

    const fetchRoom = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await api.getRoomById(roomId);
        setRoom(data);

        // Check if participant already exists for this room
        const participantKey = `participant_${roomId}`;
        const existingParticipant = localStorage.getItem(participantKey);

        // Show modal if: first visit AND no existing participant
        const visitedKey = `visited_room_${roomId}`;
        const hasVisited = localStorage.getItem(visitedKey);

        if (!hasVisited && !existingParticipant) {
          setIsFirstVisit(true);
          setShowModal(true);
          localStorage.setItem(visitedKey, 'true');
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load room';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId, navigate]);

  const handleJoinRoom = async (name: string) => {
    if (!roomId) return;

    try {
      setJoinLoading(true);
      setJoinError(null);

      const participant = await api.addParticipant(roomId, name);

      // Save participant to localStorage
      const participantKey = `participant_${roomId}`;
      localStorage.setItem(participantKey, JSON.stringify(participant));

      // Close modal
      setShowModal(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to join room. Please try again.';
      setJoinError(errorMessage);
    } finally {
      setJoinLoading(false);
    }
  };

  const handleRetry = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-lg text-gray-600">Loading room...</p>
        </div>
      </div>
    );
  }

  if (error) {
    const isRoomNotFound = error.includes('not found') || error.includes('NOT_FOUND');

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-4">{isRoomNotFound ? '🔍' : '⚠️'}</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {isRoomNotFound ? 'Room Not Found' : 'Failed to Load Room'}
          </h2>
          <p className="text-gray-600 mb-6">
            {isRoomNotFound
              ? 'This room doesn\'t exist or may have been deleted.'
              : 'There was a problem loading the room. Please try again.'}
          </p>
          <div className="flex gap-3 justify-center">
            {!isRoomNotFound && (
              <button
                onClick={handleRetry}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
              >
                Retry
              </button>
            )}
            <button
              onClick={handleGoHome}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold rounded-lg transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!room) {
    return null;
  }

  return (
    <>
      <OnboardingModal
        isOpen={showModal}
        onSubmit={handleJoinRoom}
        isLoading={joinLoading}
        error={joinError}
      />

      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-3xl font-bold text-gray-900">
                Retrospective Room
              </h1>
              <ConnectionStatus />
            </div>
            <p className="text-gray-600">
              {isFirstVisit && <span className="text-blue-600 font-semibold">Welcome! </span>}
              Share this room with your team to collaborate
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main content: Categories */}
            <div className="lg:col-span-3">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {room.categories.map((category) => (
                  <CategoryColumn key={category.id} category={category} />
                ))}
              </div>
            </div>

            {/* Sidebar: Participant List */}
            <div className="lg:col-span-1">
              <ParticipantList roomId={roomId!} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
