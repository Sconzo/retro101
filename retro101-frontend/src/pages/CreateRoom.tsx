import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { api } from '../services/api';

const DEFAULT_CATEGORIES = [
  'What went well',
  'To improve',
  'Action items',
];

export function CreateRoom() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<string[]>([...DEFAULT_CATEGORIES]);
  const [isCreating, setIsCreating] = useState(false);
  const [showShareLink, setShowShareLink] = useState(false);
  const [shareLink, setShareLink] = useState('');
  const [roomId, setRoomId] = useState('');

  const handleCategoryChange = (index: number, value: string) => {
    const updated = [...categories];
    updated[index] = value;
    setCategories(updated);
  };

  const addCategory = () => {
    if (categories.length < 5) {
      setCategories([...categories, '']);
    }
  };

  const removeCategory = (index: number) => {
    if (categories.length > 2) {
      setCategories(categories.filter((_, i) => i !== index));
    }
  };

  const validateForm = (): boolean => {
    if (categories.length < 2 || categories.length > 5) {
      toast.error('Must have between 2 and 5 categories');
      return false;
    }

    const nonEmptyCategories = categories.filter((c) => c.trim() !== '');
    if (nonEmptyCategories.length !== categories.length) {
      toast.error('All categories must have names');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsCreating(true);

    try {
      const response = await api.createRoom({
        categories: categories.map((c) => c.trim()),
      });

      setShareLink(response.shareLink);
      setRoomId(response.roomId);
      setShowShareLink(true);
      toast.success('Room created successfully!');
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to create room'
      );
      setIsCreating(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      toast.success('Link copied to clipboard!');
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const goToRoom = () => {
    navigate(`/room/${roomId}`);
  };

  if (showShareLink) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <Toaster position="top-center" />
        <div className="max-w-2xl w-full bg-gray-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            Room Created Successfully!
          </h2>
          <p className="text-gray-600 mb-6 text-center">
            Share this link with your team:
          </p>
          <div className="flex gap-2 mb-6">
            <input
              type="text"
              readOnly
              value={shareLink}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900"
            />
            <button
              onClick={copyToClipboard}
              className="px-6 py-3 bg-gray-200 hover:bg-gray-300 rounded-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
            >
              Copy
            </button>
          </div>
          <button
            onClick={goToRoom}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Go to Room
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <Toaster position="top-center" />
      <main className="max-w-2xl w-full" role="main">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Create Retrospective Room
          </h1>
          <p className="text-gray-600">
            Define 2-5 categories for your retrospective
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6" aria-label="Create room form">
          <div className="space-y-4">
            {categories.map((category, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={category}
                  onChange={(e) => handleCategoryChange(index, e.target.value)}
                  placeholder={`Category ${index + 1}`}
                  aria-label={`Category ${index + 1} name`}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {categories.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeCategory(index)}
                    className="px-4 py-3 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                    aria-label={`Remove category ${index + 1}`}
                  >
                    ✕
                  </button>
                )}
              </div>
            ))}
          </div>

          {categories.length < 5 && (
            <button
              type="button"
              onClick={addCategory}
              className="w-full px-4 py-3 border-2 border-dashed border-gray-300 hover:border-gray-400 text-gray-600 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              + Add Category
            </button>
          )}

          <button
            type="submit"
            disabled={isCreating}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold px-8 py-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {isCreating ? 'Creating...' : 'Create Room'}
          </button>
        </form>
      </main>
    </div>
  );
}
