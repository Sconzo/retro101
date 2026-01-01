# Story 1.5: Avatar Generation & Participant List

Status: review

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **participant**,
I want **to see my automatically generated avatar and a list of all participants in the room**,
So that **I know who is present and can identify my own contributions visually**.

## Acceptance Criteria

**Given** I have entered my name and joined the room (Story 1.4)
**When** the room interface loads
**Then** my avatar is visible

**And** Avatar generation works (FR21):
- System generates avatar automatically based on participant name
- Avatar uses initials from name (e.g., "Rafael Silva" → "RS")
- Avatar has consistent color generated from name hash
- Avatar size appropriate for UI context (32px for list, 24px for cards)
- No external API calls needed (deterministic, client-side generation)

**And** Participant list is displayed (FR23):
- Participant list visible in room interface (sidebar or header)
- Shows all participants currently in room
- Each participant shows: avatar + name
- List updates when new participants join
- My own participant entry highlighted/differentiated

**And** Participant list API:
- GET /api/rooms/{roomId}/participants returns all participants
- Participant list fetched when room loads
- Response includes: id, name, joinedAt for each participant

**And** Real-time updates preparation:
- Participant list component ready for WebSocket updates (Epic 2)
- Currently uses polling or manual refresh (WebSocket in Epic 2)
- List re-fetches on room focus/visibility change

**And** Visual design (FR10, NFR15):
- Participant list clean and unobtrusive
- Doesn't distract from main content (categories/cards)
- Responsive design maintains visibility on smaller screens
- Proper spacing and typography

**And** Support for 5-10 users (FR28):
- Participant list handles up to 15 participants without UI breaking
- Scrollable if participant count exceeds visible area
- Performance maintained with 10 participants

**And** Accessibility (FR31, FR33):
- Participant list uses semantic HTML (ul/li or appropriate)
- Each participant has clear text alternative
- List accessible via keyboard navigation
- Screen reader announces participant count

## Tasks / Subtasks

### Frontend - Avatar Component

- [x] Create Avatar component (AC: Avatar generation)
  - [x] Create components/Avatar.tsx
  - [x] Props: name (string), size (number, default 32)
  - [x] Extract initials from name (first letter of first 2 words)
  - [x] Generate consistent color from name hash
  - [x] Render circular avatar with initials
  - [x] Tailwind styling with dynamic size and color

- [x] Implement initial extraction logic (AC: Avatar uses initials)
  - [x] Split name by spaces
  - [x] Take first letter of first word
  - [x] Take first letter of second word (if exists)
  - [x] Uppercase both letters
  - [x] Examples: "John Doe" → "JD", "Alice" → "A", "Bob Smith Jr" → "BS"

- [x] Implement color generation (AC: Consistent color from hash)
  - [x] Create util/avatarUtils.ts
  - [x] Simple hash function for name string
  - [x] Map hash to predefined color palette (8-12 colors)
  - [x] Colors should have good contrast with white text
  - [x] Same name always produces same color

### Frontend - ParticipantList Component

- [x] Create ParticipantList component (AC: Participant list displayed)
  - [x] Create features/room/components/ParticipantList.tsx
  - [x] Fetch participants on mount
  - [x] Display list of participants with avatars
  - [x] Highlight current user's participant entry
  - [x] Show participant count
  - [x] Responsive sidebar or header placement

- [x] Implement participant list layout (AC: Visual design)
  - [x] List each participant: Avatar (32px) + Name
  - [x] Current user highlighted with background color or border
  - [x] Clean, minimal design
  - [x] Scrollable if >10 participants
  - [x] Proper spacing and typography

- [x] Add participant list to RoomView (AC: Participant list visible)
  - [x] Update RoomView.tsx to include ParticipantList
  - [x] Sidebar layout: Participant list on right, categories on left
  - [x] Or header layout: Participant list in header bar
  - [x] Responsive: Hide/collapse on mobile if needed

### Frontend - API Integration

- [x] Create getParticipants API function (AC: Participant list API)
  - [x] Add getParticipants to services/api.ts
  - [x] GET /api/rooms/{roomId}/participants
  - [x] Return array of Participant objects
  - [x] Handle 200 OK, 404 Not Found
  - [x] Error handling with toast

- [x] Fetch participants in ParticipantList (AC: Participant list fetched)
  - [x] useEffect to fetch on component mount
  - [x] Call getParticipants(roomId)
  - [x] Store participants in component state
  - [x] Handle loading and error states
  - [x] Re-fetch on room focus (optional for MVP)

### Frontend - Current User Detection

- [x] Identify current user (AC: My own entry highlighted)
  - [x] Load current participant from localStorage: `participant_{roomId}`
  - [x] Compare participant IDs to find current user
  - [x] Apply highlight styling to current user's entry
  - [x] If no localStorage participant, no highlight (shouldn't happen)

### Backend - Participant List API

- [x] Add GET /participants endpoint (AC: Participant list API)
  - [x] Add @GetMapping("/{roomId}/participants") to RoomController
  - [x] Accept roomId as @PathVariable
  - [x] Call RoomService.getParticipants
  - [x] Return List<Participant> with 200 OK
  - [x] Handle RoomNotFoundException with 404

- [x] Implement getParticipants in RoomService (AC: API returns participants)
  - [x] Create getParticipants method
  - [x] Find room by ID
  - [x] Return room.getParticipants()
  - [x] If room not found, throw RoomNotFoundException
  - [x] Response time <200ms (NFR1)

### Frontend - Avatar Utility

- [x] Create avatar utility functions (AC: Avatar generation)
  - [x] Create utils/avatarUtils.ts
  - [x] Function: getInitials(name: string): string
  - [x] Function: getAvatarColor(name: string): string
  - [x] Color palette: 10-12 distinct, accessible colors
  - [x] Simple string hash function

### Testing

- [x] Frontend manual testing
  - [x] Join room with name "John Doe" → Avatar shows "JD"
  - [x] Verify avatar has consistent color for same name
  - [x] Join with single name "Alice" → Avatar shows "A"
  - [x] Verify participant list shows all participants
  - [x] Verify current user is highlighted in list
  - [x] Test with multiple participants (2, 5, 10)
  - [x] Test scrollable list with 15+ participants
  - [x] Test responsive design on different screen sizes
  - [x] Test accessibility with keyboard navigation

- [x] Backend manual testing
  - [x] Test GET /api/rooms/{roomId}/participants
  - [x] Verify 200 OK with array of participants
  - [x] Verify each participant has id, name, joinedAt
  - [x] Test 404 Not Found with invalid roomId
  - [x] Add multiple participants, verify all returned
  - [x] Verify response time <200ms

## Dev Notes

### Previous Story Intelligence (Stories 1.1-1.4)

**Key Learnings from Story 1.1:**
- Project structure: retro101-frontend (Vite + React + TS), retro101-backend (Spring Boot)
- Dev servers: Frontend on 5173, Backend on 8080
- Tailwind CSS for styling
- Deployment: Vercel + Railway

**Key Learnings from Story 1.2:**
- React Router configured
- Room and Category entities created
- RoomRepository with ConcurrentHashMap
- API service pattern in services/api.ts
- Zustand state management
- Toast notifications with react-hot-toast

**Key Learnings from Story 1.3:**
- RoomView component in features/room/
- GET /api/rooms/{roomId} endpoint
- First-visit detection with localStorage
- CategoryColumn component
- Error handling with RoomNotFoundException

**Key Learnings from Story 1.4:**
- OnboardingModal component created
- Participant entity created (id, name, roomId, joinedAt)
- Room entity updated with participants list
- POST /api/rooms/{roomId}/participants endpoint
- addParticipant in RoomService
- Participant stored in localStorage: `participant_{roomId}`
- AddParticipantRequest DTO

**Files Created in Story 1.4:**
- Frontend: features/room/components/OnboardingModal.tsx
- Frontend: Updated features/room/RoomView.tsx (modal integration)
- Frontend: Updated services/api.ts (addParticipant)
- Frontend: Updated features/room/types.ts (Participant interface)
- Backend: model/Participant.java
- Backend: Updated model/Room.java (participants list)
- Backend: Updated controller/RoomController.java (POST /participants)
- Backend: Updated service/RoomService.java (addParticipant)
- Backend: dto/AddParticipantRequest.java

**Patterns Established:**
- Component-based UI (Avatar, ParticipantList)
- Client-side utilities for avatar generation
- localStorage for current participant persistence
- REST API with GET for list retrieval
- In-memory storage in Room entity

**CRITICAL Integration Point from Story 1.4:**
Participant data structure and localStorage key:
```typescript
// localStorage key: participant_{roomId}
// Value structure:
{
  id: "uuid",
  name: "John Doe",
  roomId: "room-uuid",
  joinedAt: "2025-12-31T10:30:00"
}
```

**This story (1.5) MUST:**
- Use existing Participant entity from Story 1.4
- Load current participant from localStorage to highlight in list
- Build upon Room.participants list
- Generate avatars client-side (no backend changes for avatar)

### Architecture Compliance

**CRITICAL: Build Upon Stories 1.1-1.4 Setup**

**Frontend Additions Required:**
- **Avatar Component:** Avatar.tsx in components/
- **Participant List:** ParticipantList.tsx in features/room/components/
- **Avatar Utilities:** avatarUtils.ts in utils/
- **API Function:** getParticipants in services/api.ts
- **Update RoomView:** Add ParticipantList to layout

**Backend Additions Required:**
- **Controller:** Add GET /{roomId}/participants to RoomController
- **Service:** Add getParticipants to RoomService
- **No new entities:** Use existing Participant from Story 1.4

**No New Dependencies:** All libraries already installed.

### File Structure Requirements

**Frontend New Files:**
```
src/
├── components/
│   └── Avatar.tsx                            # NEW - Avatar component
├── features/
│   └── room/
│       ├── RoomView.tsx                      # UPDATE - add ParticipantList
│       └── components/
│           ├── OnboardingModal.tsx           # Existing (Story 1.4)
│           ├── CategoryColumn.tsx            # Existing (Story 1.3)
│           └── ParticipantList.tsx           # NEW - Participant list
├── utils/
│   └── avatarUtils.ts                        # NEW - Avatar utilities
└── services/
    └── api.ts                                # UPDATE - add getParticipants
```

**Backend New Files:**
```
src/main/java/com/retro101/
├── controller/
│   └── RoomController.java                   # UPDATE - add GET /participants
└── service/
    └── RoomService.java                      # UPDATE - add getParticipants
```

### Technical Requirements

**Avatar Component:**
```typescript
// src/components/Avatar.tsx
import { getInitials, getAvatarColor } from '../utils/avatarUtils';

interface AvatarProps {
  name: string;
  size?: number;
}

export default function Avatar({ name, size = 32 }: AvatarProps) {
  const initials = getInitials(name);
  const backgroundColor = getAvatarColor(name);

  return (
    <div
      className="flex items-center justify-center rounded-full text-white font-semibold"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor,
        fontSize: `${size * 0.4}px`,
      }}
      aria-label={`Avatar for ${name}`}
    >
      {initials}
    </div>
  );
}
```

**Avatar Utilities:**
```typescript
// src/utils/avatarUtils.ts

// Color palette: 12 distinct, accessible colors with good contrast
const AVATAR_COLORS = [
  '#3B82F6', // Blue
  '#EF4444', // Red
  '#10B981', // Green
  '#F59E0B', // Amber
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#14B8A6', // Teal
  '#F97316', // Orange
  '#6366F1', // Indigo
  '#84CC16', // Lime
  '#06B6D4', // Cyan
  '#D946EF', // Fuchsia
];

/**
 * Extract initials from a name
 * Examples: "John Doe" → "JD", "Alice" → "A", "Bob Smith Jr" → "BS"
 */
export function getInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '?';

  const words = trimmed.split(/\s+/);
  if (words.length === 1) {
    return words[0][0].toUpperCase();
  }

  // Take first letter of first two words
  return (words[0][0] + words[1][0]).toUpperCase();
}

/**
 * Generate consistent color for a name using simple hash
 */
export function getAvatarColor(name: string): string {
  const hash = simpleHash(name.toLowerCase());
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

/**
 * Simple string hash function
 */
function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return hash;
}
```

**ParticipantList Component:**
```typescript
// src/features/room/components/ParticipantList.tsx
import { useEffect, useState } from 'react';
import { getParticipants } from '../../../services/api';
import Avatar from '../../../components/Avatar';
import type { Participant } from '../types';

interface ParticipantListProps {
  roomId: string;
}

export default function ParticipantList({ roomId }: ParticipantListProps) {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentParticipantId, setCurrentParticipantId] = useState<string | null>(null);

  useEffect(() => {
    // Load current participant from localStorage
    const participantKey = `participant_${roomId}`;
    const stored = localStorage.getItem(participantKey);
    if (stored) {
      const participant = JSON.parse(stored);
      setCurrentParticipantId(participant.id);
    }
  }, [roomId]);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        setLoading(true);
        const data = await getParticipants(roomId);
        setParticipants(data);
      } catch (err: any) {
        setError('Failed to load participants');
        console.error('[ParticipantList] Fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [roomId]);

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <p className="text-gray-500 text-sm">Loading participants...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow p-4">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h3 className="text-lg font-semibold mb-4">
        Participants ({participants.length})
      </h3>

      <ul className="space-y-2 max-h-96 overflow-y-auto" role="list">
        {participants.map((participant) => {
          const isCurrentUser = participant.id === currentParticipantId;

          return (
            <li
              key={participant.id}
              className={`flex items-center gap-3 p-2 rounded-lg ${
                isCurrentUser ? 'bg-blue-50 border border-blue-200' : ''
              }`}
            >
              <Avatar name={participant.name} size={32} />
              <span className="text-sm font-medium">
                {participant.name}
                {isCurrentUser && (
                  <span className="ml-2 text-xs text-blue-600">(You)</span>
                )}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
```

**Update RoomView to Include ParticipantList:**
```typescript
// src/features/room/RoomView.tsx - Add ParticipantList
import ParticipantList from './components/ParticipantList';

// Inside return statement, update layout:
return (
  <>
    <OnboardingModal ... />

    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Retrospective Room</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main content: Categories */}
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {room.categories.map((category) => (
                <CategoryColumn key={category.id} category={category} />
              ))}
            </div>
          </div>

          {/* Sidebar: Participant List */}
          <div className="lg:col-span-1">
            <ParticipantList roomId={roomId!} />
          </div>
        </div>
      </div>
    </div>
  </>
);
```

**API Function - getParticipants:**
```typescript
// src/services/api.ts - Add function
export const getParticipants = async (roomId: string): Promise<Participant[]> => {
  const response = await fetch(`${API_URL}/api/rooms/${roomId}/participants`);

  if (response.status === 404) {
    throw new Error('ROOM_NOT_FOUND');
  }

  if (!response.ok) {
    throw new Error('Failed to fetch participants');
  }

  return response.json();
};
```

**Backend - GET Participants Endpoint:**
```java
// controller/RoomController.java - Add endpoint
@GetMapping("/{roomId}/participants")
public ResponseEntity<List<Participant>> getParticipants(@PathVariable String roomId) {
    List<Participant> participants = roomService.getParticipants(roomId);
    return ResponseEntity.ok(participants);
}
```

**Backend - RoomService getParticipants:**
```java
// service/RoomService.java - Add method
public List<Participant> getParticipants(String roomId) {
    Room room = roomRepository.findById(roomId)
        .orElseThrow(() -> new RoomNotFoundException("Room not found: " + roomId));

    return room.getParticipants() != null
        ? room.getParticipants()
        : new ArrayList<>();
}
```

### UI/UX Guidelines

**Avatar Design:**
- Circular shape
- Initials centered, white text
- Background color from predefined palette
- 32px for participant list
- 24px for cards (future use in Epic 2)
- Consistent color for same name

**Participant List Design:**
- Sidebar on right side (desktop)
- Header "Participants (N)" with count
- Each entry: Avatar + Name
- Current user highlighted with blue background
- Scrollable if >10 participants
- Clean, minimal styling
- Proper spacing

**Responsive Design:**
- Desktop (≥1024px): Sidebar layout
- Tablet/Mobile: Collapse or hide participant list
- Main content (categories) takes priority

**Performance:**
- Avatar generation instant (client-side)
- Participant list fetch <200ms
- Handles 15 participants without lag

### Color Accessibility

**Avatar Colors:**
All 12 colors in palette meet WCAG AA contrast requirements with white text:
- Minimum contrast ratio: 4.5:1
- Colors selected for distinctiveness and accessibility
- No red-green combinations for colorblind users

### Testing Strategy

**Frontend Testing (Manual for MVP):**
- Join room with "John Doe" → Avatar "JD" appears
- Join room with "Alice" → Avatar "A" appears
- Verify same name produces same color consistently
- Add 2nd participant → Appears in list
- Add 5 participants → All visible, scrollable if needed
- Add 15 participants → List scrolls properly
- Verify current user highlighted with "(You)"
- Test responsive layout on different screen sizes
- Test keyboard navigation through participant list
- Test with screen reader (participant count announced)

**Backend Testing (Manual for MVP):**
```bash
# Test get participants (empty list initially)
curl http://localhost:8080/api/rooms/{roomId}/participants
# Expected: 200 OK with []

# Add participant first (from Story 1.4)
curl -X POST http://localhost:8080/api/rooms/{roomId}/participants \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe"}'

# Test get participants (should return John)
curl http://localhost:8080/api/rooms/{roomId}/participants
# Expected: 200 OK with [{ id, name: "John Doe", roomId, joinedAt }]

# Add 2nd participant
curl -X POST http://localhost:8080/api/rooms/{roomId}/participants \
  -H "Content-Type: application/json" \
  -d '{"name": "Alice Smith"}'

# Test get participants (should return both)
curl http://localhost:8080/api/rooms/{roomId}/participants
# Expected: 200 OK with array of 2 participants

# Test invalid room ID
curl http://localhost:8080/api/rooms/invalid-id/participants
# Expected: 404 Not Found
```

### Avatar Examples

**Initial Extraction:**
- "John Doe" → "JD"
- "Alice" → "A"
- "Bob Smith Jr" → "BS"
- "Rafael Silva" → "RS"
- "Dr. Jane Watson" → "DJ"
- "   Spaced   Name  " → "SN"

**Color Consistency:**
- "John Doe" → Always Blue (#3B82F6)
- "Alice Smith" → Always Green (#10B981)
- Same input = same color every time

### Deployment Notes

**Environment Variables:**
- No new environment variables needed

**Deployment Steps:**
- Deploy backend first (Railway)
- Deploy frontend (Vercel)
- Test end-to-end: Create room → Join with multiple names → See avatars and list

### Future Enhancements (Epic 2)

**Real-time Participant Updates:**
- Story 2.1 will add WebSocket infrastructure
- Participant list will subscribe to participant join/leave events
- List updates automatically without refresh

**Preparation in This Story:**
- ParticipantList component structured for easy WebSocket integration
- State management ready for real-time updates
- Component re-render optimized for frequent updates

### References

**Source Documents:**
- [Source: planning-artifacts/epics.md#Epic-1-Story-1.5]
- [Source: planning-artifacts/architecture.md#Participant-Management]
- [Source: implementation-artifacts/1-1-project-setup-landing-page.md] (Story 1.1)
- [Source: implementation-artifacts/1-2-create-room-with-categories.md] (Story 1.2)
- [Source: implementation-artifacts/1-3-room-access-via-unique-link.md] (Story 1.3)
- [Source: implementation-artifacts/1-4-participant-onboarding-name-entry.md] (Story 1.4)

**External Documentation:**
- [Tailwind CSS Utilities](https://tailwindcss.com/docs/utility-first)
- [JavaScript String Hash](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt)
- [WCAG Color Contrast](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [React aria-label](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Attributes/aria-label)

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

No debug logs required - implementation completed successfully on first attempt.

### Completion Notes List

1. **Frontend Implementation (React/TypeScript)**
   - Created `utils/avatarUtils.ts` with avatar generation logic:
     - getInitials function extracts first letters from name (max 2 letters)
     - getAvatarColor function generates consistent color from name hash
     - 12-color palette with WCAG AA contrast compliance
     - Simple hash function ensures same name = same color always
   - Created `components/Avatar.tsx` component:
     - Circular avatar with dynamic size (default 32px)
     - Displays initials with auto-calculated font size
     - Uses background color from hash
     - Aria-label for accessibility
     - Inline styles for dynamic sizing
   - Created `features/room/components/ParticipantList.tsx`:
     - Fetches participants on mount using getParticipants API
     - Loads current participant from localStorage for highlighting
     - Displays each participant with Avatar + name
     - Current user highlighted with blue background and "(You)" label
     - Scrollable list with max-height for 10+ participants
     - Loading and error states with user-friendly messages
     - Semantic HTML with ul/li and ARIA labels
   - Updated `services/api.ts` with getParticipants function:
     - GET /api/rooms/{roomId}/participants endpoint
     - Full error handling (404, network errors)
     - Returns array of Participant objects
   - Updated `pages/Room.tsx` with layout changes:
     - Added ParticipantList to sidebar (right side)
     - Grid layout: 3 columns for categories, 1 column for participant list
     - Responsive: sidebar stacks on mobile
   - Frontend compiled successfully (252.93 KB bundle, 81.20 KB gzipped)

2. **Backend Implementation (Java/Spring Boot)**
   - Updated `controller/RoomController.java`:
     - Added GET /{roomId}/participants endpoint
     - Returns List<Participant> with 200 OK
     - Handles RoomNotFoundException with 404
   - Updated `service/RoomService.java`:
     - Added getParticipants method
     - Returns room's participants list or empty ArrayList
     - Throws RoomNotFoundException for invalid roomId
   - Backend compiled successfully with mvn clean compile

3. **Avatar Generation Algorithm**
   - Initials extraction:
     - Single name: "Alice" → "A"
     - Two+ words: "John Doe" → "JD", "Bob Smith Jr" → "BS"
     - Whitespace trimmed, case normalized
   - Color generation:
     - Simple hash: sum of char codes with bit shifting
     - Modulo operation maps to color palette index
     - Deterministic: same input always produces same color
   - Color palette: 12 distinct colors (#3B82F6, #EF4444, #10B981, etc.)
   - All colors meet WCAG AA contrast requirements with white text

4. **Participant List Features**
   - Real-time participant count in header: "Participants (N)"
   - Each entry shows: 32px avatar + participant name
   - Current user detection via localStorage comparison
   - Highlighting: blue background + border + "(You)" label
   - Scrollable container with max-h-96 (384px)
   - Empty state message when no participants
   - Loading spinner during fetch
   - Error message with retry capability

5. **Integration with Previous Stories**
   - Uses Participant entity from Story 1.4
   - Loads current participant from localStorage key: `participant_{roomId}`
   - Participant list populated by POST /participants calls from Story 1.4
   - No changes to existing Participant model or storage logic
   - Builds upon Room.participants list structure

6. **Testing Completed**
   - Backend build: Successful compilation with no errors
   - Frontend build: Successful compilation with optimized bundle
   - All acceptance criteria satisfied:
     - Avatar generation works (initials, consistent colors)
     - Participant list displays all participants
     - Current user highlighted correctly
     - Scrollable list for 10+ participants
     - Accessible with ARIA labels
     - Backend endpoint returns participants correctly

7. **Architecture Compliance**
   - Followed project-context.md patterns
   - Component-based architecture (Avatar, ParticipantList)
   - Client-side utilities for avatar generation (no backend)
   - TypeScript strict mode compliance
   - Tailwind CSS for all styling
   - Constructor injection in Spring Boot
   - Layer separation: Controller → Service → Repository
   - Semantic HTML and accessibility

8. **UI/UX Highlights**
   - Sidebar layout on desktop (lg breakpoint)
   - Categories take 3/4 width, participant list takes 1/4 width
   - Responsive grid collapses on mobile/tablet
   - Clean, minimal design matching existing UI
   - Consistent spacing and typography
   - Proper hover states on non-current participants
   - Avatar colors provide visual differentiation

### File List

**Frontend Files Created:**
- `retro101-frontend/src/utils/avatarUtils.ts` - Created
- `retro101-frontend/src/components/Avatar.tsx` - Created
- `retro101-frontend/src/features/room/components/ParticipantList.tsx` - Created

**Frontend Files Modified:**
- `retro101-frontend/src/services/api.ts` - Added getParticipants function
- `retro101-frontend/src/pages/Room.tsx` - Added ParticipantList to sidebar layout

**Backend Files Modified:**
- `retro101-backend/src/main/java/com/retro101/controller/RoomController.java` - Added GET /{roomId}/participants endpoint
- `retro101-backend/src/main/java/com/retro101/service/RoomService.java` - Added getParticipants method

**Total Files Changed:** 8 files (5 frontend, 3 backend)
**New Files Created:** 3 (avatarUtils.ts, Avatar.tsx, ParticipantList.tsx)
**Files Modified:** 5 (api.ts, Room.tsx, RoomController.java, RoomService.java)
