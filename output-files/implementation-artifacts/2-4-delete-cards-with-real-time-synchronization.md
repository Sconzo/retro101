# Story 2.4: Delete Cards with Real-Time Synchronization

Status: review

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

- [x] Update CardService with deleteCard method
- [x] Implement handleDeleteCard in CardWebSocketController
- [x] Validate card exists before delete

### Frontend

- [x] Add delete button to Card component
- [x] Create confirmation dialog component
- [x] Create useCardActions.deleteCard function
- [x] Handle CARD_DELETED messages in RoomView (already existed in roomStore)
- [x] Add fade-out animation

### Testing

- [x] Test compilation - Backend and frontend build successfully
- [ ] Manual test: Test delete in 2 browser tabs
- [ ] Manual test: Verify delete syncs <500ms
- [ ] Manual test: Test confirmation dialog
- [ ] Manual test: Test optimistic delete

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

**Backend Files Modified:**
1. `retro101-backend/src/main/java/com/retro101/service/CardService.java`
   - Added `deleteCard()` method with validation
   - Validates room exists and card exists
   - Removes card from room's card list using removeIf
   - Saves room to repository

2. `retro101-backend/src/main/java/com/retro101/controller/CardWebSocketController.java`
   - Updated `deleteCard()` handler to call CardService.deleteCard()
   - Added try-catch error handling
   - Calls service to persist deletion before broadcasting
   - Broadcasts card deletion to all room participants

**Frontend Files Modified:**
1. `retro101-frontend/src/features/room/components/Card.tsx`
   - Added delete button with trash icon (appears next to edit button)
   - Added confirmation dialog state management
   - Added fade-out animation state
   - Integrated ConfirmDialog component
   - Added `handleDelete()` function with fade animation (200ms)
   - Delete button shows on hover (not visible for temp/pending cards)

2. `retro101-frontend/src/features/room/hooks/useCardActions.ts`
   - Added `sendCardDelete` to destructured useWebSocket return
   - Added `deleteCard()` function with optimistic delete pattern
   - Validates roomId, connection, and participant data
   - Stores original cards for rollback on error
   - Filters out deleted card from store before sending to server
   - Sends CardDeleteMessage via WebSocket
   - Rollback to original state on error

**Frontend Files Created:**
1. `retro101-frontend/src/components/ConfirmDialog.tsx`
   - New reusable confirmation dialog component
   - Modal overlay with click-outside-to-close
   - Variant support: danger, warning, info
   - Customizable title, message, and button labels
   - Accessible with data-testid attributes
   - Prevents event bubbling on dialog click

**Files Verified (No Changes Needed):**
1. `retro101-frontend/src/hooks/useWebSocket.ts`
   - Already had `sendCardDelete()` method exported

2. `retro101-frontend/src/stores/roomStore.ts`
   - Already had 'deleted' case in handleCardMessage
   - Filters out deleted card from cards array

### Build Results
- Backend: ✅ Maven clean compile succeeded
- Frontend: ✅ npm run build succeeded (335.67 kB)

### Implementation Notes
- Delete functionality uses same optimistic update pattern as Stories 2.2 and 2.3
- Confirmation dialog prevents accidental deletions
- Fade-out animation (200ms) provides visual feedback before removal
- Backend validates card exists before deletion
- Real-time sync via WebSocket broadcast to `/topic/room.{roomId}`
- All acceptance criteria implemented and compilation verified
- Optimistic delete removes card immediately from UI for responsive UX
