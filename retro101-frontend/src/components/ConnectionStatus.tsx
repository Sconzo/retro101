import { useRoomStore } from '../stores/roomStore';

export function ConnectionStatus() {
  const connectionStatus = useRoomStore((state) => state.connectionStatus);

  const statusConfig = {
    connected: {
      icon: '🟢',
      text: 'Connected',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    connecting: {
      icon: '🟡',
      text: 'Connecting...',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
    },
    disconnected: {
      icon: '🔴',
      text: 'Disconnected',
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
    },
  };

  const config = statusConfig[connectionStatus];

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border ${config.bgColor} ${config.borderColor}`}
      role="status"
      aria-live="polite"
      aria-label={`WebSocket connection status: ${config.text}`}
    >
      <span className="text-sm" aria-hidden="true">
        {config.icon}
      </span>
      <span className={`text-sm font-medium ${config.color}`}>{config.text}</span>
    </div>
  );
}
