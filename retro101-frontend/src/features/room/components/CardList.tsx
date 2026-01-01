import { Card } from './Card';
import type { Card as CardType } from '../../../types/room';

interface CardListProps {
  cards: CardType[];
  categoryId: string;
}

export function CardList({ cards, categoryId }: CardListProps) {
  // Filter cards by category
  const categoryCards = cards.filter((card) => card.categoryId === categoryId);

  if (categoryCards.length === 0) {
    return (
      <div className="text-center py-8 text-gray-400 text-sm italic">
        No cards yet - be the first to add one!
      </div>
    );
  }

  return (
    <div className="space-y-3" data-testid="card-list">
      {categoryCards.map((card) => (
        <Card key={card.id} card={card} />
      ))}
    </div>
  );
}
