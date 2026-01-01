import { Avatar } from '../../../components/Avatar';
import type { Card as CardType } from '../../../types/room';

interface CardProps {
  card: CardType;
}

export function Card({ card }: CardProps) {
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
            <span className="text-xs text-gray-500">
              {getRelativeTime(card.createdAt)}
            </span>
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
