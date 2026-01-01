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
      className="bg-white rounded-lg shadow p-6 min-h-[300px] flex flex-col"
      data-testid="category-column"
    >
      {/* Category Header */}
      <h2 className="text-xl font-semibold text-gray-900 mb-4 border-b pb-2">
        {category.name}
      </h2>

      {/* Cards List */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-3">
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
      {showInput ? (
        <CardInput
          onSubmit={handleCreateCard}
          onCancel={() => setShowInput(false)}
        />
      ) : (
        <button
          onClick={() => setShowInput(true)}
          className="w-full py-2 text-sm text-gray-600 border-2 border-dashed border-gray-300 rounded hover:border-blue-400 hover:text-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          data-testid="add-card-button"
        >
          + Add Card
        </button>
      )}
    </div>
  );
}
