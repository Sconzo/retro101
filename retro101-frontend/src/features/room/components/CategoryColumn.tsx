import { useState } from 'react';
import { useRoomStore } from '../../../stores/roomStore';
import { useCardActions } from '../hooks/useCardActions';
import { Card } from './Card';
import { CardInput } from './CardInput';
import type { Category } from '../../../types/room';

interface CategoryColumnProps {
  category: Category;
}

export function CategoryColumn({ category }: CategoryColumnProps) {
  const [showInput, setShowInput] = useState(false);
  const cards = useRoomStore((state) => state.cards);
  const { createCard } = useCardActions();

  // Filter cards for this category
  const categoryCards = cards.filter((card) => card.categoryId === category.id);

  const handleCreateCard = (content: string) => {
    createCard(content, category.id);
    setShowInput(false);
  };

  return (
    <div
      className="category-column bg-white rounded-md min-h-[300px] flex flex-col"
      data-testid="category-column"
    >
      {/* Category Header */}
      <h2 className="category-header text-sm font-semibold text-white px-4 py-3 uppercase tracking-wide">
        {category.name}
      </h2>

      {/* Cards List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {categoryCards.length === 0 && !showInput && (
          <p className="text-center py-8 text-gray-400 text-sm italic">
            No cards yet - be the first to add one!
          </p>
        )}
        {categoryCards.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </div>

      {/* Card Input or Add Button */}
      <div className="p-4 pt-0">
        {showInput ? (
          <CardInput
            onSubmit={handleCreateCard}
            onCancel={() => setShowInput(false)}
          />
        ) : (
          <button
            onClick={() => setShowInput(true)}
            className="add-card-btn w-full min-h-[48px] py-3 text-sm border-2 border-dashed rounded hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
            data-testid="add-card-button"
          >
            + Add Card
          </button>
        )}
      </div>
    </div>
  );
}
