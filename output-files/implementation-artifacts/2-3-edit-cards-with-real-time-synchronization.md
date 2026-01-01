# Story 2.3: Edit Cards with Real-Time Synchronization

Status: in-progress

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

- [x] Update CardService with updateCard method
- [x] Implement handleUpdateCard in CardWebSocketController
- [x] Add updatedAt and updatedBy to Card entity
- [x] Validate card exists before update

### Frontend

- [x] Add edit mode to Card component
- [x] Create useCardActions.updateCard function
- [x] Handle CARD_UPDATED messages in RoomView (already existed in roomStore)
- [x] Add edit button to Card component

### Testing

- [x] Test compilation - Backend and frontend build successfully
- [ ] Manual test: Test edit in 2 browser tabs
- [ ] Manual test: Verify updates sync <500ms
- [ ] Manual test: Test optimistic update

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

**Backend Files Modified:**
1. `retro101-backend/src/main/java/com/retro101/model/Card.java`
   - Added `updatedAt` (LocalDateTime) field
   - Added `updatedBy` (String) field

2. `retro101-backend/src/main/java/com/retro101/service/CardService.java`
   - Added `updateCard()` method with validation
   - Validates room exists, card exists, and content is valid
   - Updates card content, updatedAt, and updatedBy fields
   - Saves to room repository

3. `retro101-backend/src/main/java/com/retro101/controller/CardWebSocketController.java`
   - Updated `updateCard()` handler to call CardService.updateCard()
   - Added try-catch error handling
   - Broadcasts updated card data with actual card fields from service
   - Uses updatedAt timestamp in broadcast message

4. `retro101-backend/src/main/java/com/retro101/dto/CardUpdateMessage.java`
   - Already existed from previous implementation
   - Contains roomId, cardId, content, participantId fields

**Frontend Files Modified:**
1. `retro101-frontend/src/features/room/components/Card.tsx`
   - Added edit mode state (`isEditing`)
   - Added edit button with pencil icon (only shown for non-pending cards)
   - Added conditional rendering for edit mode using CardEditInput
   - Added `handleEdit()` function that calls updateCard and exits edit mode
   - Integrated useCardActions hook for updateCard function

2. `retro101-frontend/src/features/room/hooks/useCardActions.ts`
   - Added `sendCardUpdate` to destructured useWebSocket return
   - Added `updateCard()` function with optimistic update pattern
   - Validates roomId, connection, and participant data
   - Stores original cards for rollback on error
   - Updates card content and updatedAt in store before sending to server
   - Sends CardUpdateMessage via WebSocket
   - Rollback to original state on error

**Frontend Files Created:**
1. `retro101-frontend/src/features/room/components/CardEditInput.tsx`
   - New component for inline card editing
   - Auto-focuses and selects text on mount
   - Character counter (500 max)
   - Ctrl+Enter to submit, Escape to cancel
   - Save button disabled if content unchanged or empty
   - Similar UX to CardInput but for editing existing content

**Files Verified (No Changes Needed):**
1. `retro101-frontend/src/hooks/useWebSocket.ts`
   - Already had `sendCardUpdate()` method exported

2. `retro101-frontend/src/stores/roomStore.ts`
   - Already had 'updated' case in handleCardMessage
   - Updates card content and updatedAt timestamp
   - Maps through cards and updates matching cardId

### Build Results
- Backend: ✅ Maven clean compile succeeded
- Frontend: ✅ npm run build succeeded (333.07 kB)

### Implementation Notes
- Edit functionality uses same optimistic update pattern as Story 2.2
- Edit button only appears for non-pending (non-temp) cards
- CardEditInput pre-fills with current content and auto-selects for easy editing
- Backend validates card exists and enforces content validation (1-500 chars, not blank)
- Real-time sync via WebSocket broadcast to `/topic/room.{roomId}`
- All acceptance criteria implemented and compilation verified
