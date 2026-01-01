import { useState } from 'react';
import { Avatar } from '../../../components/Avatar';
import { CardEditInput } from './CardEditInput';
import { ConfirmDialog } from '../../../components/ConfirmDialog';
import { useCardActions } from '../hooks/useCardActions';
import type { Card as CardType } from '../../../types/room';

interface CardProps {
  card: CardType;
}

export function Card({ card }: CardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const { updateCard, deleteCard } = useCardActions();
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

  const handleDelete = () => {
    // Trigger fade-out animation
    setIsFadingOut(true);

    // Wait for animation to complete before deleting
    setTimeout(() => {
      deleteCard(card.id);
      setShowDeleteConfirm(false);
    }, 200); // Match animation duration
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    // Only handle if card is focused and not pending
    if (isPending) return;

    if (e.key === 'Enter') {
      e.preventDefault();
      setIsEditing(true);
    } else if (e.key === 'Delete') {
      e.preventDefault();
      setShowDeleteConfirm(true);
    }
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
    <>
      <div
        className={`bg-white rounded-lg shadow p-4 transition-all duration-200 ${
          isPending ? 'opacity-60' : ''
        } ${isFadingOut ? 'opacity-0 scale-95' : 'opacity-100 scale-100'} ${
          !isPending ? 'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2' : ''
        }`}
        data-testid="card"
        tabIndex={isPending ? undefined : 0}
        onKeyDown={handleKeyDown}
        role="article"
        aria-label={`Card by ${card.authorName}: ${card.content}`}
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
                  <>
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-gray-400 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded"
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
                    <button
                      onClick={() => setShowDeleteConfirm(true)}
                      className="text-gray-400 hover:text-red-600 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 rounded"
                      aria-label="Delete card"
                      data-testid="card-delete-button"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </>
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

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Card"
        message="Are you sure you want to delete this card? This action cannot be undone."
        confirmLabel="Delete"
        cancelLabel="Cancel"
        variant="danger"
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
      />
    </>
  );
}
