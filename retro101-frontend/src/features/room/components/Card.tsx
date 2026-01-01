import { useState } from 'react';
import { Avatar } from '../../../components/Avatar';
import { CardEditInput } from './CardEditInput';
import { useCardActions } from '../hooks/useCardActions';
import type { Card as CardType } from '../../../types/room';

interface CardProps {
  card: CardType;
}

export function Card({ card }: CardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { updateCard } = useCardActions();
  const getRelativeTime = (timestamp: string) => {
    const now = new Date();
    const created = new Date(timestamp);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / 60000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const isPending = card.id.startsWith('temp-');

  const handleEdit = (newContent: string) => {
    updateCard(card.id, newContent);
    setIsEditing(false);
  };

  // Show edit input if editing
  if (isEditing) {
    return (
      <div className="bg-white rounded-lg shadow p-4" data-testid="card">
        <CardEditInput
          initialContent={card.content}
          onSubmit={handleEdit}
          onCancel={() => setIsEditing(false)}
        />
      </div>
    );
  }

  return (
    <div
      className={`bg-white rounded-lg shadow p-4 transition-opacity ${
        isPending ? 'opacity-60' : ''
      }`}
      data-testid="card"
    >
      <div className="flex items-start gap-3 mb-2">
        <Avatar name={card.authorName} size={24} />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-medium text-sm text-gray-900">
              {card.authorName}
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
                {getRelativeTime(card.createdAt)}
              </span>
              {!isPending && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                  aria-label="Edit card"
                  data-testid="card-edit-button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-800 whitespace-pre-wrap break-words">
        {card.content}
      </p>

      {isPending && (
        <div className="mt-2 text-xs text-gray-400 italic">Sending...</div>
      )}
    </div>
  );
}
