import { useEffect, useState } from 'react';
import { useRoomStore } from '../stores/roomStore';

export function LiveAnnouncer() {
  const [announcement, setAnnouncement] = useState('');
  const cards = useRoomStore((state) => state.cards);
  const connectionStatus = useRoomStore((state) => state.connectionStatus);

  // Announce connection status changes
  useEffect(() => {
    if (connectionStatus === 'connected') {
      setAnnouncement('Connected to room');
    } else if (connectionStatus === 'disconnected') {
      setAnnouncement('Disconnected from room');
    }
  }, [connectionStatus]);

  // Announce card updates
  useEffect(() => {
    const previousCount = useRoomStore.getState().cards.length;
    const currentCount = cards.length;

    if (currentCount > previousCount) {
      setAnnouncement('New card added');
    } else if (currentCount < previousCount) {
      setAnnouncement('Card removed');
    }
  }, [cards.length]);

  // Clear announcement after it's been read
  useEffect(() => {
    if (announcement) {
      const timer = setTimeout(() => setAnnouncement(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [announcement]);

  return (
    <>
      {/* Polite announcements for card updates */}
      <div
        role="status"
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement && !announcement.includes('Disconnected') && announcement}
      </div>

      {/* Assertive announcements for connection changes */}
      <div
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="sr-only"
      >
        {announcement && announcement.includes('Disconnected') && announcement}
      </div>
    </>
  );
}
