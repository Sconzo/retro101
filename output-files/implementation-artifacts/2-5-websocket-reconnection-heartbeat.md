# Story 2.5: WebSocket Reconnection & Heartbeat

Status: ready-for-dev

## Story

As a **participant**,
I want **automatic reconnection if my connection drops and consistent state after reconnecting**,
So that **I can continue participating even with temporary network issues**.

## Acceptance Criteria

**Given** I am connected to a room via WebSocket (Story 2.1)
**When** my connection drops temporarily
**Then** the system automatically reconnects and resynchronizes

**And** Connection monitoring works (FR30):
- Heartbeat every 30 seconds
- Detect missed heartbeats (3 = disconnected)
- Update connection status

**And** Automatic reconnection works (FR29):
- Auto-retry after 1s
- Exponential backoff: 1s, 2s, 4s, 8s, max 30s
- Max 10 attempts
- Status: disconnected → connecting → connected

**And** Visual feedback:
- Show "Reconnecting..." message
- Update with retry count
- Disappear when connected

**And** State reconciliation after reconnect (NFR6):
- Fetch current room state after reconnect
- GET /api/rooms/{roomId}/cards returns all cards
- Merge server state with local
- Retry pending operations

**And** Heartbeat backend works:
- Spring WebSocket heartbeat configured
- Detect dead connections
- Clean up connections

## Tasks / Subtasks

### Backend

- [ ] Verify WebSocketConfig heartbeat settings (done in 2.1)
- [ ] Create GET /api/rooms/{roomId}/cards endpoint for state sync
- [ ] Implement in CardController

### Frontend

- [ ] Update useWebSocket with reconnection logic (enhance from 2.1)
- [ ] Add exponential backoff
- [ ] Track retry count
- [ ] Show reconnection UI feedback
- [ ] Implement state reconciliation after reconnect
- [ ] Fetch cards after reconnect
- [ ] Merge with local state

### Testing

- [ ] Simulate network drop (kill backend)
- [ ] Verify auto-reconnect
- [ ] Test state sync after reconnect
- [ ] Test pending operations retry

## Dev Notes

Story 2.1 already configured heartbeat (4000ms). This story enhances reconnection logic and adds state reconciliation.

**Key Implementation:**
```typescript
// useWebSocket.ts - Enhanced reconnection (already in 2.1)
// Add state reconciliation:
const reconcileState = async () => {
  const cards = await fetch(`${API_URL}/api/rooms/${roomId}/cards`).then(r => r.json());
  useRoomStore.getState().setCards(cards);
};
```

```java
// CardController.java - Add GET /cards endpoint
@GetMapping("/{roomId}/cards")
public ResponseEntity<List<Card>> getCards(@PathVariable String roomId) {
    List<Card> cards = cardService.getCards(roomId);
    return ResponseEntity.ok(cards);
}
```

## Dev Agent Record

### File List
_To be filled by dev agent_
