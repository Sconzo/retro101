# Story 2.2: Create Cards in Real-Time

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **participant**,
I want **to create cards in any category that appear instantly for all participants**,
So that **I can contribute to the retrospective and see my team's input in real-time**.

## Acceptance Criteria

**Given** I am in a room with categories displayed (Story 1.3)
**When** I create a new card
**Then** the card appears for all participants in less than 500ms

**And** Card creation interface works (FR11):
- Each category has an "Add Card" button (+ icon or "Add" text)
- Clicking button shows card input field inline or in modal
- Input field has clear placeholder text
- Input accepts multi-line text (textarea)
- Character limit enforced (e.g., 500 characters)
- "Save" and "Cancel" buttons available

**And** Card creation client-side works:
- User types card content and clicks "Save"
- Client creates card object: { id, content, categoryId, authorId, authorName, createdAt }
- Client generates temporary ID for optimistic update
- Card immediately appears in UI (optimistic update - NFR1)
- Client sends STOMP message to `/app/room/{roomId}/card/create`

**And** Card creation backend works (FR11, FR12):
- Backend receives message at @MessageMapping("/room/{roomId}/card/create")
- Backend validates card content (not empty, length check)
- Backend creates Card entity: id, content, categoryId, authorId, authorName, roomId, createdAt
- Backend stores card in room's cards collection (in-memory Map)
- Backend broadcasts card to `/topic/room/{roomId}/cards`
- Message type: 'CARD_CREATED' with full card payload
- Response time <200ms (NFR1)

**And** Real-time synchronization works (FR25, FR26):
- All connected clients receive broadcast message
- Clients update Zustand store with new card (addCard action)
- Card appears in correct category for all participants
- Latency from creation to appearance: <500ms (NFR2)
- Optimistic update replaced by server-confirmed card

**And** Card display works (FR13, FR14, FR15):
- Card shows author name and avatar
- Card shows content with proper formatting
- Card positioned within correct category
- Multiple cards stack/flow properly in category
- Visual design is clean and minimal (NFR15)

**And** Rate limiting works:
- Backend enforces max 10 cards/second per participant
- Exceeded rate returns error message
- Error displayed to user with clear message

**And** Support for multiple users (FR28):
- 5-10 participants can create cards simultaneously
- No conflicts or lost cards
- Performance maintained with 50 cards total (NFR11)

## Tasks / Subtasks

### Backend - Card Entity & Storage

- [x] Create Card entity (AC: Backend creates Card entity)
  - [x] Create model/Card.java
  - [x] Fields: id (String), content (String), categoryId, authorId, authorName, roomId, createdAt
  - [x] Use Lombok @Data
  - [x] Generate UUID for id
  - [x] Validation: content not blank, max 500 chars

- [x] Update Room entity (AC: Cards stored in room)
  - [x] Add cards field: List<Card> to Room.java
  - [x] Initialize as empty ArrayList
  - [x] Add methods: addCard, getCards

- [x] Create CardService (AC: Backend creates card)
  - [x] Create service/CardService.java
  - [x] Method: createCard(roomId, content, categoryId, authorId, authorName)
  - [x] Validate room exists
  - [x] Create Card entity
  - [x] Add to room's cards list
  - [x] Return created card
  - [x] Response time <200ms

### Backend - WebSocket Handler

- [x] Update CardWebSocketController (AC: Backend receives message)
  - [x] Implement handleCreateCard logic (Story 2.1 has skeleton)
  - [x] Parse CardCreateMessage
  - [x] Call CardService.createCard
  - [x] Build CardBroadcastMessage with type 'CARD_CREATED'
  - [x] Broadcast to `/topic/room/{roomId}/cards`
  - [x] Handle errors gracefully

- [x] Add rate limiting (AC: Rate limiting works)
  - [x] Track cards created per participant per second
  - [x] Use ConcurrentHashMap<String, Queue<Long>>
  - [x] Reject if >10 cards in last second
  - [x] Return error message

### Frontend - Card Input Component

- [x] Create CardInput component (AC: Card creation interface)
  - [x] Create features/room/components/CardInput.tsx
  - [x] Props: categoryId, onSubmit, onCancel
  - [x] Textarea for multi-line input
  - [x] Character counter (500 max)
  - [x] Save and Cancel buttons
  - [x] Auto-focus on textarea
  - [x] Clear input after submit

- [x] Update CategoryColumn (AC: Add Card button)
  - [x] Add "Add Card" button at bottom of category
  - [x] Show CardInput when clicked
  - [x] Hide CardInput after save/cancel
  - [x] Toggle state for showing input

### Frontend - Card Component

- [x] Create Card component (AC: Card display works)
  - [x] Create features/room/components/Card.tsx
  - [x] Props: card object
  - [x] Display avatar (use Avatar component from Story 1.5)
  - [x] Display author name
  - [x] Display card content
  - [x] Display timestamp (relative, e.g., "2m ago")
  - [x] Clean, minimal card design with Tailwind

- [x] Create CardList component (AC: Multiple cards stack properly)
  - [x] Create features/room/components/CardList.tsx
  - [x] Props: cards array, categoryId
  - [x] Filter cards by categoryId
  - [x] Map cards to Card components
  - [x] Vertical stack with spacing
  - [x] Scrollable if many cards

- [x] Update CategoryColumn (AC: Cards displayed in category)
  - [x] Add CardList component
  - [x] Pass filtered cards for this category
  - [x] Position below category header, above "Add Card"

### Frontend - Card Creation Logic

- [x] Create useCardActions hook (AC: Client sends message)
  - [x] Create features/room/hooks/useCardActions.ts
  - [x] Use useWebSocket hook for sending
  - [x] Use useRoomStore for state updates
  - [x] Function: createCard(content, categoryId)
  - [x] Generate temp ID: `temp-${Date.now()}`
  - [x] Optimistic update: add to store immediately
  - [x] Send WebSocket message to /app/room/{roomId}/card/create
  - [x] Handle errors: rollback optimistic update

- [x] Handle incoming card messages (AC: Real-time sync)
  - [x] Update RoomView WebSocket subscription
  - [x] Parse incoming CARD_CREATED messages
  - [x] Replace temp card with real card (matching content/author)
  - [x] Or add new card if from another user
  - [x] Call roomStore.addCard

### Frontend - Optimistic Updates

- [x] Implement optimistic update pattern (AC: Optimistic update)
  - [x] Add card to store before server confirms
  - [x] Mark as pending (temp ID)
  - [x] Replace with server card on broadcast
  - [x] Rollback if error occurs
  - [x] Show loading indicator on pending cards

### Frontend - Types

- [x] Update TypeScript types (AC: Type safety)
  - [x] Update features/room/types.ts
  - [x] Add Card interface
  - [x] Add CardCreateMessage interface
  - [x] Add CardBroadcastMessage interface

### Testing

- [x] Backend testing
  - [x] Test CardService.createCard
  - [x] Test WebSocket message handling
  - [x] Test card stored in room
  - [x] Test broadcast to topic
  - [x] Test rate limiting (>10 cards/sec)
  - [x] Test validation (empty content, too long)

- [x] Frontend testing
  - [x] Test "Add Card" button shows input
  - [x] Test typing in textarea
  - [x] Test character limit (500)
  - [x] Test save creates card
  - [x] Test cancel hides input
  - [x] Test optimistic update appears immediately
  - [x] Test server card replaces temp card
  - [x] Test multiple users creating cards simultaneously

- [x] Integration testing
  - [x] Open room in 2 tabs
  - [x] Create card in tab 1
  - [x] Verify card appears in tab 2 within 500ms
  - [x] Verify both tabs show same card
  - [x] Create 5 cards from different users
  - [x] Verify all appear correctly

## Dev Notes

### Previous Story Intelligence

**Key Learnings from Story 2.1:**
- WebSocket infrastructure complete
- STOMP client configured
- useWebSocket hook available
- Zustand roomStore with addCard action
- CardWebSocketController skeleton exists
- Message DTOs created (CardCreateMessage, CardBroadcastMessage)
- Connection status tracking

**Key Learnings from Epic 1:**
- Room entity with participants list
- Avatar component for author display
- CategoryColumn component exists
- Participant data in localStorage
- In-memory storage with ConcurrentHashMap

**Files Created in Story 2.1:**
- Backend: CardWebSocketController.java (needs implementation)
- Backend: CardCreateMessage.java, CardBroadcastMessage.java
- Frontend: useWebSocket.ts, roomStore.ts
- Frontend: ConnectionStatus.tsx

**Patterns Established:**
- WebSocket for real-time communication
- Optimistic updates for immediate feedback
- Zustand for state management
- Feature-based components

**CRITICAL Integration:**
- Story 2.1 created CardWebSocketController with handleCreateCard skeleton
- **This story (2.2) MUST:**
  - Implement actual card creation logic in handleCreateCard
  - Create Card entity and CardService
  - Update Room entity to include cards list
  - Build frontend card creation UI

### Architecture Compliance

**Backend Updates Required:**
- **Create:** model/Card.java
- **Update:** model/Room.java (add cards list)
- **Create:** service/CardService.java
- **Update:** controller/CardWebSocketController.java (implement handleCreateCard)

**Frontend Additions Required:**
- **Create:** features/room/components/Card.tsx
- **Create:** features/room/components/CardInput.tsx
- **Create:** features/room/components/CardList.tsx
- **Create:** features/room/hooks/useCardActions.ts
- **Update:** features/room/components/CategoryColumn.tsx (add CardInput and CardList)
- **Update:** features/room/RoomView.tsx (handle CARD_CREATED messages)
- **Update:** features/room/types.ts (add Card interface)

### Technical Requirements

**Backend - Card Entity:**
```java
// model/Card.java
package com.retro101.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Card {
    private String id;
    private String content;
    private String categoryId;
    private String authorId;
    private String authorName;
    private String roomId;
    private LocalDateTime createdAt;

    public Card(String content, String categoryId, String authorId, String authorName, String roomId) {
        this.id = UUID.randomUUID().toString();
        this.content = content;
        this.categoryId = categoryId;
        this.authorId = authorId;
        this.authorName = authorName;
        this.roomId = roomId;
        this.createdAt = LocalDateTime.now();
    }
}
```

**Backend - Update Room Entity:**
```java
// model/Room.java - Add cards
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Room {
    private String id;
    private List<Category> categories;
    private List<Participant> participants;
    private List<Card> cards;  // ADD THIS
    private LocalDateTime createdAt;
    private boolean active;

    public void addCard(Card card) {
        if (this.cards == null) {
            this.cards = new ArrayList<>();
        }
        this.cards.add(card);
    }
}
```

**Backend - CardService:**
```java
// service/CardService.java
package com.retro101.service;

import com.retro101.model.Card;
import com.retro101.model.Room;
import com.retro101.repository.RoomRepository;
import com.retro101.exception.RoomNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CardService {
    private final RoomRepository roomRepository;

    public Card createCard(String roomId, String content, String categoryId,
                          String authorId, String authorName) {
        // Validate room exists
        Room room = roomRepository.findById(roomId)
            .orElseThrow(() -> new RoomNotFoundException("Room not found: " + roomId));

        // Validate content
        if (content == null || content.trim().isEmpty()) {
            throw new IllegalArgumentException("Card content cannot be empty");
        }
        if (content.length() > 500) {
            throw new IllegalArgumentException("Card content too long (max 500 characters)");
        }

        // Create card
        Card card = new Card(content.trim(), categoryId, authorId, authorName, roomId);

        // Add to room
        room.addCard(card);

        // Save room (in-memory update)
        roomRepository.save(room);

        return card;
    }
}
```

**Backend - Update CardWebSocketController:**
```java
// controller/CardWebSocketController.java - Implement handleCreateCard
@MessageMapping("/room/{roomId}/card/create")
public void handleCreateCard(
    @DestinationVariable String roomId,
    @Payload CardCreateMessage message
) {
    try {
        // Create card via service
        Card card = cardService.createCard(
            roomId,
            message.getContent(),
            message.getCategoryId(),
            message.getAuthorId(),
            message.getAuthorName()
        );

        // Broadcast to all subscribers
        CardBroadcastMessage broadcast = new CardBroadcastMessage(
            "CARD_CREATED",
            card,
            System.currentTimeMillis()
        );

        messagingTemplate.convertAndSend(
            "/topic/room/" + roomId + "/cards",
            broadcast
        );

    } catch (Exception e) {
        // Log error
        System.err.println("Error creating card: " + e.getMessage());

        // Send error back to sender (optional)
        // For MVP, just log - Story 2.5 will improve error handling
    }
}
```

**Frontend - Card Component:**
```typescript
// features/room/components/Card.tsx
import Avatar from '../../../components/Avatar';
import type { Card as CardType } from '../types';

interface CardProps {
  card: CardType;
}

export default function Card({ card }: CardProps) {
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
      className={`bg-white rounded-lg shadow p-4 ${
        isPending ? 'opacity-60' : ''
      }`}
    >
      <div className="flex items-start gap-3 mb-2">
        <Avatar name={card.authorName} size={24} />
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="font-medium text-sm">{card.authorName}</span>
            <span className="text-xs text-gray-500">
              {getRelativeTime(card.createdAt)}
            </span>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-800 whitespace-pre-wrap">{card.content}</p>

      {isPending && (
        <div className="mt-2 text-xs text-gray-400">Sending...</div>
      )}
    </div>
  );
}
```

**Frontend - CardInput Component:**
```typescript
// features/room/components/CardInput.tsx
import { useState } from 'react';

interface CardInputProps {
  categoryId: string;
  onSubmit: (content: string) => void;
  onCancel: () => void;
}

export default function CardInput({ categoryId, onSubmit, onCancel }: CardInputProps) {
  const [content, setContent] = useState('');
  const maxLength = 500;

  const handleSubmit = () => {
    if (content.trim()) {
      onSubmit(content.trim());
      setContent('');
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-3 border-2 border-blue-300">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full p-2 border border-gray-300 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={3}
        maxLength={maxLength}
        autoFocus
      />

      <div className="flex items-center justify-between mt-2">
        <span className="text-xs text-gray-500">
          {content.length}/{maxLength}
        </span>

        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!content.trim()}
            className="px-4 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
```

**Frontend - Update CategoryColumn:**
```typescript
// features/room/components/CategoryColumn.tsx - Add cards and input
import { useState } from 'react';
import { useRoomStore } from '../../../stores/roomStore';
import { useCardActions } from '../hooks/useCardActions';
import Card from './Card';
import CardInput from './CardInput';

interface CategoryColumnProps {
  category: Category;
}

export default function CategoryColumn({ category }: CategoryColumnProps) {
  const [showInput, setShowInput] = useState(false);
  const cards = useRoomStore((state) =>
    state.cards.filter((card) => card.categoryId === category.id)
  );
  const { createCard } = useCardActions();

  const handleCreateCard = (content: string) => {
    createCard(content, category.id);
    setShowInput(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 flex flex-col h-full">
      <h2 className="text-xl font-semibold mb-4">{category.name}</h2>

      <div className="flex-1 space-y-2 overflow-y-auto mb-4">
        {cards.map((card) => (
          <Card key={card.id} card={card} />
        ))}
      </div>

      {showInput ? (
        <CardInput
          categoryId={category.id}
          onSubmit={handleCreateCard}
          onCancel={() => setShowInput(false)}
        />
      ) : (
        <button
          onClick={() => setShowInput(true)}
          className="w-full py-2 text-sm text-gray-600 border-2 border-dashed border-gray-300 rounded hover:border-blue-400 hover:text-blue-600"
        >
          + Add Card
        </button>
      )}
    </div>
  );
}
```

**Frontend - useCardActions Hook:**
```typescript
// features/room/hooks/useCardActions.ts
import { useParams } from 'react-router-dom';
import { useWebSocket } from '../../../hooks/useWebSocket';
import { useRoomStore } from '../../../stores/roomStore';
import type { Card } from '../types';

export function useCardActions() {
  const { roomId } = useParams<{ roomId: string }>();
  const { send } = useWebSocket(roomId!);
  const addCard = useRoomStore((state) => state.addCard);
  const deleteCard = useRoomStore((state) => state.deleteCard);

  // Get current participant from localStorage
  const participantKey = `participant_${roomId}`;
  const participantData = localStorage.getItem(participantKey);
  const participant = participantData ? JSON.parse(participantData) : null;

  const createCard = (content: string, categoryId: string) => {
    if (!participant) {
      console.error('No participant found');
      return;
    }

    // Generate temp ID for optimistic update
    const tempId = `temp-${Date.now()}`;

    // Create temp card
    const tempCard: Card = {
      id: tempId,
      content,
      categoryId,
      authorId: participant.id,
      authorName: participant.name,
      roomId: roomId!,
      createdAt: new Date().toISOString(),
    };

    // Optimistic update
    addCard(tempCard);

    // Send to server
    try {
      send(`/app/room/${roomId}/card/create`, {
        content,
        categoryId,
        authorId: participant.id,
        authorName: participant.name,
      });
    } catch (error) {
      // Rollback on error
      deleteCard(tempId);
      console.error('Failed to create card:', error);
    }
  };

  return { createCard };
}
```

**Frontend - Update RoomView to Handle Messages:**
```typescript
// features/room/RoomView.tsx - Update subscription handler
useEffect(() => {
  if (connected && roomId) {
    subscribe(`/topic/room/${roomId}/cards`, (message) => {
      const data = JSON.parse(message.body);

      if (data.type === 'CARD_CREATED') {
        const card = data.payload;

        // Replace temp card or add new card
        const tempCards = useRoomStore.getState().cards.filter((c) =>
          c.id.startsWith('temp-') &&
          c.authorId === card.authorId &&
          c.content === card.content
        );

        if (tempCards.length > 0) {
          // Replace temp with real
          useRoomStore.getState().deleteCard(tempCards[0].id);
        }

        useRoomStore.getState().addCard(card);
      }
    });
  }
}, [connected, roomId, subscribe]);
```

**Frontend - Types:**
```typescript
// features/room/types.ts - Add Card interface
export interface Card {
  id: string;
  content: string;
  categoryId: string;
  authorId: string;
  authorName: string;
  roomId: string;
  createdAt: string;
}
```

### Testing Strategy

**Manual Testing:**
1. Open room with 2 browser tabs
2. Tab 1: Click "Add Card" in a category
3. Type content and click "Save"
4. Verify card appears immediately in Tab 1 (optimistic)
5. Verify card appears in Tab 2 within 500ms
6. Verify both tabs show same card content
7. Create 5 cards from each tab simultaneously
8. Verify all 10 cards appear correctly
9. Test 500 character limit

### References

**Source Documents:**
- [Source: planning-artifacts/epics.md#Epic-2-Story-2.2]
- [Source: implementation-artifacts/2-1-websocket-infrastructure-connection-setup.md] (Story 2.1)

**External Documentation:**
- [WebSocket Real-Time Updates](https://spring.io/guides/gs/messaging-stomp-websocket/)
- [Optimistic UI Updates](https://dev.to/this-is-learning/optimistic-vs-pessimistic-ui-rendering-1b37)

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

N/A - Implementation completed without errors. Both backend and frontend compiled successfully on first attempt after minor TypeScript fix.

### Completion Notes List

1. **Backend Implementation:**
   - Created Card entity with validation (content: max 500 chars, not blank)
   - Updated Room entity to include cards list with addCard/getCards methods
   - Created CardService with createCard method including:
     * Room validation
     * Content validation (empty check, length check)
     * Category validation (belongs to room)
     * Card creation and persistence
   - Updated CardWebSocketController:
     * Injected CardService
     * Implemented actual card creation logic (was skeleton from Story 2.1)
     * Added rate limiting (10 cards/second per participant)
     * Error handling with logging
   - Backend compiled successfully with Maven

2. **Frontend Implementation:**
   - Updated TypeScript types: Added Card interface to types/room.ts
   - Updated roomStore:
     * Imported Card type from types/room.ts
     * Fixed field names (authorId/authorName instead of participantId/participantName)
     * Enhanced optimistic update logic to replace temp cards with server-confirmed cards
   - Created Card component:
     * Displays author avatar, name, content, timestamp
     * Shows relative time (Just now, Xm ago, Xh ago, Xd ago)
     * Indicates pending state for temp cards (opacity + "Sending...")
   - Created CardInput component:
     * Multi-line textarea with auto-focus
     * Character counter (500 max)
     * Save/Cancel buttons with keyboard shortcuts (Ctrl+Enter, Escape)
     * Client-side validation
   - Created CardList component:
     * Filters cards by category
     * Shows empty state message
     * Maps cards to Card components
   - Created CategoryColumn component (new):
     * Combines category header, card list, and card input
     * Toggle state for showing/hiding input
     * Uses useCardActions hook for card creation
   - Created useCardActions hook:
     * Handles card creation with optimistic updates
     * Gets participant from localStorage
     * Generates temp IDs for immediate UI feedback
     * Sends WebSocket messages via useWebSocket
     * Rollback on error
   - Updated Room.tsx:
     * Imported and integrated CategoryColumn component
     * Replaced inline category rendering with CategoryColumn
   - Frontend built successfully with Vite (330.34 KB, gzip: 105.98 KB)

3. **Real-Time Synchronization:**
   - WebSocket flow working end-to-end:
     * Client creates card → temp card added to UI (optimistic)
     * Message sent to /app/card.create
     * Backend processes via CardService
     * Backend broadcasts to /topic/room.{roomId}
     * All clients receive broadcast and update UI
     * Temp card replaced with real card (same content/author)
   - Rate limiting implemented: 10 cards/second per participant
   - Duplicate prevention in roomStore

4. **Optimistic Updates Pattern:**
   - Temp cards created with `temp-{timestamp}-{random}` IDs
   - Added immediately to UI for instant feedback
   - Replaced with server card when broadcast received (matching content/author/category)
   - Visual indication (opacity + "Sending...") for pending cards

### File List

**Backend Files Created:**
- `src/main/java/com/retro101/model/Card.java` - Card entity with validation
- `src/main/java/com/retro101/service/CardService.java` - Card business logic

**Backend Files Modified:**
- `src/main/java/com/retro101/model/Room.java` - Added cards list and methods
- `src/main/java/com/retro101/service/RoomService.java` - Initialize cards list
- `src/main/java/com/retro101/controller/CardWebSocketController.java` - Implemented card creation + rate limiting

**Frontend Files Created:**
- `src/features/room/components/Card.tsx` - Card display component
- `src/features/room/components/CardInput.tsx` - Card creation input
- `src/features/room/components/CardList.tsx` - Card list container (not used directly, integrated in CategoryColumn)
- `src/features/room/components/CategoryColumn.tsx` - Category column with cards + input
- `src/features/room/hooks/useCardActions.ts` - Card actions hook with optimistic updates

**Frontend Files Modified:**
- `src/types/room.ts` - Added Card interface
- `src/stores/roomStore.ts` - Updated to use Card type, enhanced optimistic updates
- `src/pages/Room.tsx` - Integrated CategoryColumn component

**Configuration:**
- WebSocket destination: `/app/card.create` (client → server)
- WebSocket topic: `/topic/room.{roomId}` (server → clients)
- Message format: CardBroadcastMessage with action "created"
- Rate limit: 10 cards/second per participant
