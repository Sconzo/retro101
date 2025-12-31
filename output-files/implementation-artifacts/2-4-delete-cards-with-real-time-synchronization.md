# Story 2.4: Delete Cards with Real-Time Synchronization

Status: ready-for-dev

## Story

As a **participant**,
I want **to delete any card with removal appearing instantly for all participants**,
So that **we can remove duplicates, mistakes, or irrelevant feedback during the retrospective**.

## Acceptance Criteria

**Given** cards exist in the room (Story 2.2)
**When** I delete a card
**Then** the card disappears for all participants in less than 500ms

**And** Card delete interface works (FR17):
- Each card has "Delete" button/icon (X or trash)
- Clicking shows confirmation dialog
- "Delete" and "Cancel" in confirmation

**And** Card delete client-side works:
- Optimistic remove from store (NFR1)
- Send STOMP message to `/app/room/{roomId}/card/delete`
- Include cardId

**And** Card delete backend works (FR17, FR19):
- Validate card exists
- Remove from storage
- Broadcast CARD_DELETED to topic
- Response time <200ms

**And** Real-time synchronization works (FR19):
- All clients receive broadcast
- Remove card from UI
- Latency <500ms

**And** Visual feedback:
- Card fades out (200ms animation)

## Tasks / Subtasks

### Backend

- [ ] Update CardService with deleteCard method
- [ ] Implement handleDeleteCard in CardWebSocketController
- [ ] Validate card exists before delete

### Frontend

- [ ] Add delete button to Card component
- [ ] Create confirmation dialog component
- [ ] Create useCardActions.deleteCard function
- [ ] Handle CARD_DELETED messages in RoomView
- [ ] Add fade-out animation

### Testing

- [ ] Test delete in 2 browser tabs
- [ ] Verify delete syncs <500ms
- [ ] Test confirmation dialog
- [ ] Test optimistic delete

## Dev Notes

Build upon Stories 2.2 and 2.3. Use similar patterns for real-time sync.

**Key Implementation:**
```typescript
// useCardActions.ts - Add deleteCard
const deleteCard = (cardId: string) => {
  // Optimistic delete
  useRoomStore.getState().deleteCard(cardId);

  // Send to server
  send(`/app/room/${roomId}/card/delete`, { cardId });
};
```

```java
// CardService.java - Add deleteCard
public void deleteCard(String roomId, String cardId) {
    Room room = findRoom(roomId);
    room.getCards().removeIf(card -> card.getId().equals(cardId));
    roomRepository.save(room);
}
```

## Dev Agent Record

### File List
_To be filled by dev agent_
