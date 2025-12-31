# Story 2.3: Edit Cards with Real-Time Synchronization

Status: ready-for-dev

## Story

As a **participant**,
I want **to edit any card's content with changes appearing instantly for all participants**,
So that **I can refine feedback and correct mistakes collaboratively**.

## Acceptance Criteria

**Given** cards exist in the room (Story 2.2)
**When** I edit a card
**Then** the edited content appears for all participants in less than 500ms

**And** Card edit interface works (FR16):
- Each card has an "Edit" button/icon (pencil icon)
- Clicking edit makes card content editable inline
- Current content pre-filled
- Character limit enforced (500 chars)
- "Save" and "Cancel" buttons

**And** Card edit client-side works:
- Optimistic update in Zustand store (NFR1)
- Send STOMP message to `/app/room/{roomId}/card/update`
- Include cardId, newContent

**And** Card edit backend works (FR16, FR18):
- Validate card exists, content valid
- Update card in storage
- Broadcast CARD_UPDATED to topic
- Response time <200ms

**And** Real-time synchronization works (FR18):
- All clients receive broadcast
- Update card in UI
- Latency <500ms

## Tasks / Subtasks

### Backend

- [ ] Update CardService with updateCard method
- [ ] Implement handleUpdateCard in CardWebSocketController
- [ ] Add updatedAt and updatedBy to Card entity
- [ ] Validate card exists before update

### Frontend

- [ ] Add edit mode to Card component
- [ ] Create useCardActions.updateCard function
- [ ] Handle CARD_UPDATED messages in RoomView
- [ ] Add edit button to Card component

### Testing

- [ ] Test edit in 2 browser tabs
- [ ] Verify updates sync <500ms
- [ ] Test optimistic update

## Dev Notes

Build upon Story 2.2 card infrastructure. Use same patterns for optimistic updates and WebSocket messaging.

**Key Implementation:**
```typescript
// useCardActions.ts - Add updateCard
const updateCard = (cardId: string, content: string) => {
  // Optimistic update
  useRoomStore.getState().updateCard(cardId, content);

  // Send to server
  send(`/app/room/${roomId}/card/update`, {
    cardId,
    content,
  });
};
```

```java
// CardService.java - Add updateCard
public Card updateCard(String roomId, String cardId, String newContent) {
    Room room = findRoom(roomId);
    Card card = room.getCards().stream()
        .filter(c -> c.getId().equals(cardId))
        .findFirst()
        .orElseThrow(() -> new CardNotFoundException("Card not found"));

    card.setContent(newContent);
    card.setUpdatedAt(LocalDateTime.now());
    return card;
}
```

## Dev Agent Record

### File List
_To be filled by dev agent_
