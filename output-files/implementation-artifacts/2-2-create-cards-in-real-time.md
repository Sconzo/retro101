# Story 2.2: Create Cards in Real-Time

Status: ready-for-dev

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

- [ ] Create Card entity (AC: Backend creates Card entity)
  - [ ] Create model/Card.java
  - [ ] Fields: id (String), content (String), categoryId, authorId, authorName, roomId, createdAt
  - [ ] Use Lombok @Data
  - [ ] Generate UUID for id
  - [ ] Validation: content not blank, max 500 chars

- [ ] Update Room entity (AC: Cards stored in room)
  - [ ] Add cards field: List<Card> to Room.java
  - [ ] Initialize as empty ArrayList
  - [ ] Add methods: addCard, getCards

- [ ] Create CardService (AC: Backend creates card)
  - [ ] Create service/CardService.java
  - [ ] Method: createCard(roomId, content, categoryId, authorId, authorName)
  - [ ] Validate room exists
  - [ ] Create Card entity
  - [ ] Add to room's cards list
  - [ ] Return created card
  - [ ] Response time <200ms

### Backend - WebSocket Handler

- [ ] Update CardWebSocketController (AC: Backend receives message)
  - [ ] Implement handleCreateCard logic (Story 2.1 has skeleton)
  - [ ] Parse CardCreateMessage
  - [ ] Call CardService.createCard
  - [ ] Build CardBroadcastMessage with type 'CARD_CREATED'
  - [ ] Broadcast to `/topic/room/{roomId}/cards`
  - [ ] Handle errors gracefully

- [ ] Add rate limiting (AC: Rate limiting works)
  - [ ] Track cards created per participant per second
  - [ ] Use ConcurrentHashMap<String, Queue<Long>>
  - [ ] Reject if >10 cards in last second
  - [ ] Return error message

### Frontend - Card Input Component

- [ ] Create CardInput component (AC: Card creation interface)
  - [ ] Create features/room/components/CardInput.tsx
  - [ ] Props: categoryId, onSubmit, onCancel
  - [ ] Textarea for multi-line input
  - [ ] Character counter (500 max)
  - [ ] Save and Cancel buttons
  - [ ] Auto-focus on textarea
  - [ ] Clear input after submit

- [ ] Update CategoryColumn (AC: Add Card button)
  - [ ] Add "Add Card" button at bottom of category
  - [ ] Show CardInput when clicked
  - [ ] Hide CardInput after save/cancel
  - [ ] Toggle state for showing input

### Frontend - Card Component

- [ ] Create Card component (AC: Card display works)
  - [ ] Create features/room/components/Card.tsx
  - [ ] Props: card object
  - [ ] Display avatar (use Avatar component from Story 1.5)
  - [ ] Display author name
  - [ ] Display card content
  - [ ] Display timestamp (relative, e.g., "2m ago")
  - [ ] Clean, minimal card design with Tailwind

- [ ] Create CardList component (AC: Multiple cards stack properly)
  - [ ] Create features/room/components/CardList.tsx
  - [ ] Props: cards array, categoryId
  - [ ] Filter cards by categoryId
  - [ ] Map cards to Card components
  - [ ] Vertical stack with spacing
  - [ ] Scrollable if many cards

- [ ] Update CategoryColumn (AC: Cards displayed in category)
  - [ ] Add CardList component
  - [ ] Pass filtered cards for this category
  - [ ] Position below category header, above "Add Card"

### Frontend - Card Creation Logic

- [ ] Create useCardActions hook (AC: Client sends message)
  - [ ] Create features/room/hooks/useCardActions.ts
  - [ ] Use useWebSocket hook for sending
  - [ ] Use useRoomStore for state updates
  - [ ] Function: createCard(content, categoryId)
  - [ ] Generate temp ID: `temp-${Date.now()}`
  - [ ] Optimistic update: add to store immediately
  - [ ] Send WebSocket message to /app/room/{roomId}/card/create
  - [ ] Handle errors: rollback optimistic update

- [ ] Handle incoming card messages (AC: Real-time sync)
  - [ ] Update RoomView WebSocket subscription
  - [ ] Parse incoming CARD_CREATED messages
  - [ ] Replace temp card with real card (matching content/author)
  - [ ] Or add new card if from another user
  - [ ] Call roomStore.addCard

### Frontend - Optimistic Updates

- [ ] Implement optimistic update pattern (AC: Optimistic update)
  - [ ] Add card to store before server confirms
  - [ ] Mark as pending (temp ID)
  - [ ] Replace with server card on broadcast
  - [ ] Rollback if error occurs
  - [ ] Show loading indicator on pending cards

### Frontend - Types

- [ ] Update TypeScript types (AC: Type safety)
  - [ ] Update features/room/types.ts
  - [ ] Add Card interface
  - [ ] Add CardCreateMessage interface
  - [ ] Add CardBroadcastMessage interface

### Testing

- [ ] Backend testing
  - [ ] Test CardService.createCard
  - [ ] Test WebSocket message handling
  - [ ] Test card stored in room
  - [ ] Test broadcast to topic
  - [ ] Test rate limiting (>10 cards/sec)
  - [ ] Test validation (empty content, too long)

- [ ] Frontend testing
  - [ ] Test "Add Card" button shows input
  - [ ] Test typing in textarea
  - [ ] Test character limit (500)
  - [ ] Test save creates card
  - [ ] Test cancel hides input
  - [ ] Test optimistic update appears immediately
  - [ ] Test server card replaces temp card
  - [ ] Test multiple users creating cards simultaneously

- [ ] Integration testing
  - [ ] Open room in 2 tabs
  - [ ] Create card in tab 1
  - [ ] Verify card appears in tab 2 within 500ms
  - [ ] Verify both tabs show same card
  - [ ] Create 5 cards from different users
  - [ ] Verify all appear correctly

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

_To be filled by dev agent_

### Debug Log References

_To be filled by dev agent_

### Completion Notes List

_To be filled by dev agent_

### File List

_To be filled by dev agent during implementation_
