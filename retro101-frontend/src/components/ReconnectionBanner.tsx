interface ReconnectionBannerProps {
  retryCount: number;
  maxRetries: number;
}

export function ReconnectionBanner({ retryCount, maxRetries }: ReconnectionBannerProps) {
  return (
    <div
      className="fixed top-0 left-0 right-0 bg-yellow-500 text-white px-4 py-3 shadow-lg z-50 animate-slide-down"
      data-testid="reconnection-banner"
    >
      <div className="container mx-auto flex items-center justify-center gap-3">
        <div className="flex items-center gap-2">
          <svg
            className="animate-spin h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span className="font-medium">
            Reconnecting... (Attempt {retryCount}/{maxRetries})
          </span>
        </div>
      </div>
    </div>
  );
}
