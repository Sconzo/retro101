import { useState, useEffect, useRef } from 'react';

interface OnboardingModalProps {
  isOpen: boolean;
  onSubmit: (name: string) => void;
  isLoading: boolean;
  error: string | null;
}

export function OnboardingModal({
  isOpen,
  onSubmit,
  isLoading,
  error
}: OnboardingModalProps) {
  const [name, setName] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const validateName = (value: string): boolean => {
    const trimmed = value.trim();
    if (!trimmed) {
      setValidationError('Name is required');
      return false;
    }
    if (trimmed.length > 50) {
      setValidationError('Name must be 50 characters or less');
      return false;
    }
    setValidationError(null);
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (validateName(trimmed)) {
      onSubmit(trimmed);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Focus trap - keep Tab within modal
    if (e.key === 'Tab') {
      e.preventDefault();
      inputRef.current?.focus();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-labelledby="modal-title"
      onKeyDown={handleKeyDown}
    >
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <h2 id="modal-title" className="text-2xl font-bold mb-4 text-gray-900">
          Enter your name to join
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="participant-name" className="block text-sm font-medium mb-2 text-gray-700">
              Your name
            </label>
            <input
              id="participant-name"
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setValidationError(null);
              }}
              placeholder="Your name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-describedby={validationError ? "name-error" : undefined}
              disabled={isLoading}
            />
            {validationError && (
              <p id="name-error" className="text-red-600 text-sm mt-1">
                {validationError}
              </p>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !name.trim()}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Joining...' : 'Join Room'}
          </button>
        </form>
      </div>
    </div>
  );
}
