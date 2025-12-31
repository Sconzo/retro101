# Story 1.4: Participant Onboarding (Name Entry)

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **participant**,
I want **to enter my name to join a room**,
So that **I can start contributing to the retrospective in less than 30 seconds without creating an account**.

## Acceptance Criteria

**Given** I accessed a room for the first time (FR5 detection from Story 1.3)
**When** the room page loads
**Then** an onboarding modal appears

**And** Name entry interface works (FR20):
- Modal displays simple prompt: "Enter your name to join"
- Single text input field for name (labeled clearly)
- Input has focus automatically (keyboard ready)
- "Join Room" button to submit
- Minimal design - no unnecessary fields or distractions (NFR15)

**And** Name validation works:
- Name must not be empty (client-side validation)
- Name trimmed of whitespace
- Name length: 1-50 characters
- Clear error message if validation fails
- No special characters validation needed for MVP

**And** Participant identification works (FR22, FR24):
- Participant object created with: id, name, roomId, joinedAt
- Participant stored in room's participants list
- Facilitator uses same process (no special roles in MVP)
- Backend endpoint: POST /api/rooms/{roomId}/participants

**And** Modal dismissal and room entry:
- After successful name submission, modal closes
- Participant now "in" the room
- Categories visible and ready for interaction
- Time from link click to first card creation: <30 seconds (NFR13)

**And** Participant persistence:
- Participant data stored in browser (localStorage)
- Returning to same room doesn't require re-entry
- Participant can clear data manually if needed

**And** Error handling:
- Network errors show retry option
- Duplicate names allowed (no unique constraint)
- Clear feedback if join fails

**And** Accessibility (FR31, FR34):
- Modal can be navigated with keyboard (Tab, Enter)
- Input has proper label and aria attributes
- Focus trap in modal until name entered

## Tasks / Subtasks

### Frontend - Onboarding Modal Component

- [ ] Create OnboardingModal component (AC: Name entry interface)
  - [ ] Create features/room/components/OnboardingModal.tsx
  - [ ] Modal overlay with backdrop
  - [ ] Modal content: title, input, submit button
  - [ ] Auto-focus on input when modal opens
  - [ ] Tailwind styling for minimal design
  - [ ] Modal state: open/closed

- [ ] Implement name input form (AC: Name entry interface)
  - [ ] Controlled input with useState
  - [ ] Label: "Enter your name to join"
  - [ ] Placeholder: "Your name"
  - [ ] Submit on Enter key press
  - [ ] Submit on "Join Room" button click

- [ ] Add client-side validation (AC: Name validation)
  - [ ] Check name is not empty
  - [ ] Trim whitespace before validation
  - [ ] Check length 1-50 characters
  - [ ] Display error message below input
  - [ ] Disable submit button if invalid
  - [ ] Clear error on input change

- [ ] Implement accessibility (AC: Accessibility)
  - [ ] Focus trap: Tab stays within modal
  - [ ] aria-label on input
  - [ ] aria-describedby for error messages
  - [ ] role="dialog" on modal
  - [ ] Escape key to close (optional, may not apply for mandatory modal)

### Frontend - Modal Integration with RoomView

- [ ] Update RoomView to show modal (AC: Modal appears on first visit)
  - [ ] Use first-visit flag from Story 1.3 localStorage check
  - [ ] Show OnboardingModal if first visit AND no participant in localStorage
  - [ ] Pass roomId to modal
  - [ ] Handle modal close after successful join

- [ ] Implement participant join flow (AC: Participant identification)
  - [ ] On modal submit, call addParticipant API
  - [ ] Pass name and roomId to API
  - [ ] On success, save participant to localStorage
  - [ ] Close modal
  - [ ] Update room state with current participant

- [ ] Add participant persistence (AC: Participant persistence)
  - [ ] Store participant in localStorage: `participant_{roomId}`
  - [ ] Structure: { id, name, roomId, joinedAt }
  - [ ] On room load, check localStorage for existing participant
  - [ ] Skip modal if participant exists for this room
  - [ ] Clear localStorage option (future: settings page)

### Frontend - API Integration

- [ ] Create addParticipant API function (AC: Participant identification)
  - [ ] Add addParticipant to services/api.ts
  - [ ] POST /api/rooms/{roomId}/participants
  - [ ] Request body: { name: string }
  - [ ] Response: Participant object
  - [ ] Handle 200 OK, 400 Bad Request, 404 Not Found
  - [ ] Error handling with toast notifications

### Backend - Participant Entity & Model

- [ ] Create Participant entity (AC: Participant identification)
  - [ ] Create model/Participant.java
  - [ ] Fields: id (String), name (String), roomId (String), joinedAt (LocalDateTime)
  - [ ] Use Lombok @Data, @AllArgsConstructor, @NoArgsConstructor
  - [ ] Generate UUID for id
  - [ ] joinedAt defaults to LocalDateTime.now()

- [ ] Update Room entity (AC: Participant stored in room)
  - [ ] Add participants field: List<Participant> to Room.java
  - [ ] Initialize as empty ArrayList in constructor
  - [ ] Add methods: addParticipant, removeParticipant, getParticipants

### Backend - Participant API Endpoint

- [ ] Add POST /participants endpoint (AC: Backend endpoint)
  - [ ] Add @PostMapping("/{roomId}/participants") to RoomController
  - [ ] Accept roomId as @PathVariable
  - [ ] Accept AddParticipantRequest DTO in @RequestBody
  - [ ] Call RoomService.addParticipant
  - [ ] Return Participant object with 200 OK
  - [ ] Handle RoomNotFoundException with 404

- [ ] Implement addParticipant in RoomService (AC: Participant identification)
  - [ ] Create addParticipant method
  - [ ] Validate room exists (findById)
  - [ ] Create Participant object with UUID
  - [ ] Add participant to room's participants list
  - [ ] Save room (in-memory update)
  - [ ] Return Participant object
  - [ ] Response time <200ms (NFR1)

- [ ] Create DTOs for participant (AC: Backend endpoint)
  - [ ] Create dto/AddParticipantRequest.java
  - [ ] Field: @NotBlank String name
  - [ ] @Size(min = 1, max = 50) for name length
  - [ ] Validation annotations

### Backend - Error Handling

- [ ] Update validation error handling (AC: Name validation, Error handling)
  - [ ] GlobalExceptionHandler already handles MethodArgumentNotValidException
  - [ ] Ensure clear error messages for name validation
  - [ ] Return 400 Bad Request with validation errors

### Frontend - Error Handling & UX

- [ ] Add error handling for join failure (AC: Error handling)
  - [ ] Display error message in modal
  - [ ] Network error: "Failed to join room. Please try again."
  - [ ] Validation error: Show specific field error
  - [ ] Keep modal open on error
  - [ ] Allow retry without refreshing

- [ ] Add loading state (AC: Modal dismissal)
  - [ ] Show loading spinner during API call
  - [ ] Disable submit button while loading
  - [ ] Prevent double submission

### Testing

- [ ] Frontend manual testing
  - [ ] Test first-time visit shows modal
  - [ ] Test entering valid name (1-50 chars)
  - [ ] Test empty name shows error
  - [ ] Test name with only whitespace shows error
  - [ ] Test 51+ character name shows error
  - [ ] Test Enter key submits form
  - [ ] Test successful join closes modal
  - [ ] Test localStorage saves participant
  - [ ] Test returning to room skips modal
  - [ ] Test keyboard navigation (Tab, Enter)
  - [ ] Test accessibility with screen reader

- [ ] Backend manual testing
  - [ ] Test POST /api/rooms/{roomId}/participants with valid name
  - [ ] Test 200 OK with Participant object response
  - [ ] Test 400 Bad Request with empty name
  - [ ] Test 400 Bad Request with 51+ character name
  - [ ] Test 404 Not Found with invalid roomId
  - [ ] Verify participant added to room's participants list
  - [ ] Verify response time <200ms

## Dev Notes

### Previous Story Intelligence (Stories 1.1, 1.2, 1.3)

**Key Learnings from Story 1.1:**
- Project structure: retro101-frontend (Vite + React + TS), retro101-backend (Spring Boot)
- Dev servers: Frontend on 5173, Backend on 8080
- Tailwind CSS for styling
- Deployment: Vercel + Railway

**Key Learnings from Story 1.2:**
- React Router configured with routes
- Room and Category entities created
- RoomRepository with ConcurrentHashMap
- RoomController with POST /api/rooms
- RoomService with createRoom
- Zustand for state management
- API service in services/api.ts
- Toast notifications with react-hot-toast
- DTOs for request/response

**Key Learnings from Story 1.3:**
- RoomView component created in features/room/
- GET /api/rooms/{roomId} endpoint
- First-visit detection with localStorage (`visited_room_{roomId}`)
- Error handling with RoomNotFoundException
- GlobalExceptionHandler for centralized errors
- CategoryColumn component for category display
- useRoom hook for room data management

**Files Created in Story 1.3:**
- Frontend: features/room/RoomView.tsx
- Frontend: features/room/components/CategoryColumn.tsx
- Frontend: features/room/hooks/useRoom.ts (if created)
- Frontend: services/api.ts (added getRoomById)
- Frontend: components/ErrorBoundary.tsx
- Backend: controller/RoomController (added GET /{roomId})
- Backend: service/RoomService (added getRoomById)
- Backend: exception/RoomNotFoundException.java
- Backend: exception/GlobalExceptionHandler.java

**Patterns Established:**
- Feature-based organization (features/room/)
- Component-based architecture (RoomView, CategoryColumn)
- localStorage for client-side persistence
- Modal patterns (to be established in this story)
- REST API with DTOs and validation
- Error handling with try/catch and toast

**CRITICAL Integration Point from Story 1.3:**
Story 1.3 implemented first-visit detection:
```typescript
// In RoomView.tsx
const visitedKey = `visited_room_${roomId}`;
const hasVisited = localStorage.getItem(visitedKey);
if (!hasVisited) {
  localStorage.setItem(visitedKey, 'true');
  // Story 1.4 will handle onboarding navigation
}
```

**This story (1.4) MUST:**
- Use the same localStorage check to trigger modal
- Show OnboardingModal when `hasVisited === null`
- ALSO check for existing participant in localStorage
- Skip modal if participant already exists for this room

### Architecture Compliance

**CRITICAL: Build Upon Stories 1.1, 1.2, 1.3 Setup**

**Frontend Additions Required:**
- **Onboarding Modal:** OnboardingModal.tsx component
- **Modal Integration:** Update RoomView.tsx to show modal
- **API Function:** addParticipant in services/api.ts
- **Types:** Participant interface in features/room/types.ts
- **State Management:** Participant in roomStore or localStorage

**Backend Additions Required:**
- **Entity:** Participant.java in model package
- **Update Entity:** Add participants list to Room.java
- **Controller:** Add POST /{roomId}/participants to RoomController
- **Service:** Add addParticipant to RoomService
- **DTO:** AddParticipantRequest.java

**No New Dependencies:** All libraries already installed.

### File Structure Requirements

**Frontend New Files:**
```
src/
├── features/
│   └── room/
│       ├── RoomView.tsx                      # Update to show modal
│       ├── components/
│       │   ├── CategoryColumn.tsx            # Existing
│       │   └── OnboardingModal.tsx           # NEW - Modal component
│       ├── hooks/
│       │   └── useRoom.ts                    # Existing or new
│       └── types.ts                          # Update with Participant
└── services/
    └── api.ts                                # Add addParticipant
```

**Backend New Files:**
```
src/main/java/com/retro101/
├── model/
│   ├── Room.java                             # UPDATE - add participants
│   ├── Category.java                         # Existing
│   └── Participant.java                      # NEW
├── controller/
│   └── RoomController.java                   # UPDATE - add POST /participants
├── service/
│   └── RoomService.java                      # UPDATE - add addParticipant
└── dto/
    └── AddParticipantRequest.java            # NEW
```

### Technical Requirements

**OnboardingModal Component:**
```typescript
// src/features/room/components/OnboardingModal.tsx
import { useState, useEffect, useRef } from 'react';

interface OnboardingModalProps {
  isOpen: boolean;
  onSubmit: (name: string) => void;
  isLoading: boolean;
  error: string | null;
}

export default function OnboardingModal({
  isOpen,
  onSubmit,
  isLoading,
  error
}: OnboardingModalProps) {
  const [name, setName] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const validateName = (value: string): boolean => {
    const trimmed = value.trim();
    if (!trimmed) {
      setValidationError('Name is required');
      return false;
    }
    if (trimmed.length > 50) {
      setValidationError('Name must be 50 characters or less');
      return false;
    }
    setValidationError(null);
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (validateName(trimmed)) {
      onSubmit(trimmed);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <h2 id="modal-title" className="text-2xl font-bold mb-4">
          Enter your name to join
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="participant-name" className="block text-sm font-medium mb-2">
              Your name
            </label>
            <input
              id="participant-name"
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setValidationError(null);
              }}
              placeholder="Your name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-describedby={validationError ? "name-error" : undefined}
              disabled={isLoading}
            />
            {validationError && (
              <p id="name-error" className="text-red-600 text-sm mt-1">
                {validationError}
              </p>
            )}
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !name.trim()}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Joining...' : 'Join Room'}
          </button>
        </form>
      </div>
    </div>
  );
}
```

**Update RoomView to Show Modal:**
```typescript
// src/features/room/RoomView.tsx - Update
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getRoomById, addParticipant } from '../../services/api';
import CategoryColumn from './components/CategoryColumn';
import OnboardingModal from './components/OnboardingModal';
import type { Room, Participant } from './types';

export default function RoomView() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [joinLoading, setJoinLoading] = useState(false);
  const [joinError, setJoinError] = useState<string | null>(null);

  useEffect(() => {
    if (!roomId) return;

    const fetchRoom = async () => {
      try {
        setLoading(true);
        const data = await getRoomById(roomId);
        setRoom(data);

        // Check if participant already exists for this room
        const participantKey = `participant_${roomId}`;
        const existingParticipant = localStorage.getItem(participantKey);

        // Show modal if: first visit AND no existing participant
        const visitedKey = `visited_room_${roomId}`;
        const hasVisited = localStorage.getItem(visitedKey);

        if (!hasVisited && !existingParticipant) {
          setShowModal(true);
          localStorage.setItem(visitedKey, 'true');
        }
      } catch (err: any) {
        if (err.message === 'ROOM_NOT_FOUND') {
          setError('Room not found');
        } else {
          setError('Failed to load room');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchRoom();
  }, [roomId]);

  const handleJoinRoom = async (name: string) => {
    if (!roomId) return;

    try {
      setJoinLoading(true);
      setJoinError(null);

      const participant = await addParticipant(roomId, name);

      // Save participant to localStorage
      const participantKey = `participant_${roomId}`;
      localStorage.setItem(participantKey, JSON.stringify(participant));

      // Close modal
      setShowModal(false);
    } catch (err: any) {
      setJoinError(err.message || 'Failed to join room. Please try again.');
    } finally {
      setJoinLoading(false);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="text-lg">Loading room...</div>
    </div>;
  }

  if (error) {
    return <div className="flex flex-col items-center justify-center h-screen">
      <h2 className="text-2xl font-bold mb-4">{error}</h2>
      <button
        onClick={() => navigate('/')}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg"
      >
        Back to Home
      </button>
    </div>;
  }

  if (!room) return null;

  return (
    <>
      <OnboardingModal
        isOpen={showModal}
        onSubmit={handleJoinRoom}
        isLoading={joinLoading}
        error={joinError}
      />

      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Retrospective Room</h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {room.categories.map((category) => (
              <CategoryColumn key={category.id} category={category} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
```

**API Function - addParticipant:**
```typescript
// src/services/api.ts - Add function
export const addParticipant = async (roomId: string, name: string) => {
  const response = await fetch(`${API_URL}/api/rooms/${roomId}/participants`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });

  if (response.status === 404) {
    throw new Error('ROOM_NOT_FOUND');
  }

  if (response.status === 400) {
    const error = await response.json();
    throw new Error(error.message || 'Invalid name');
  }

  if (!response.ok) {
    throw new Error('Failed to join room');
  }

  return response.json();
};
```

**TypeScript Types - Update:**
```typescript
// src/features/room/types.ts - Add Participant
export interface Participant {
  id: string;
  name: string;
  roomId: string;
  joinedAt: string;
}

export interface Room {
  id: string;
  categories: Category[];
  participants: Participant[];  // Add this
  createdAt: string;
  active: boolean;
}

export interface Category {
  id: string;
  name: string;
  roomId: string;
}
```

**Backend - Participant Entity:**
```java
// model/Participant.java
package com.retro101.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Participant {
    private String id;
    private String name;
    private String roomId;
    private LocalDateTime joinedAt;

    public Participant(String name, String roomId) {
        this.id = UUID.randomUUID().toString();
        this.name = name;
        this.roomId = roomId;
        this.joinedAt = LocalDateTime.now();
    }
}
```

**Backend - Update Room Entity:**
```java
// model/Room.java - Update to add participants
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Room {
    private String id;
    private List<Category> categories;
    private List<Participant> participants;  // ADD THIS
    private LocalDateTime createdAt;
    private boolean active;

    public Room(String id, List<Category> categories) {
        this.id = id;
        this.categories = categories;
        this.participants = new ArrayList<>();  // Initialize
        this.createdAt = LocalDateTime.now();
        this.active = true;
    }

    public void addParticipant(Participant participant) {
        if (this.participants == null) {
            this.participants = new ArrayList<>();
        }
        this.participants.add(participant);
    }
}
```

**Backend - Add Participant Endpoint:**
```java
// controller/RoomController.java - Add endpoint
@PostMapping("/{roomId}/participants")
public ResponseEntity<Participant> addParticipant(
    @PathVariable String roomId,
    @Valid @RequestBody AddParticipantRequest request
) {
    Participant participant = roomService.addParticipant(roomId, request.getName());
    return ResponseEntity.ok(participant);
}
```

**Backend - RoomService addParticipant:**
```java
// service/RoomService.java - Add method
public Participant addParticipant(String roomId, String name) {
    Room room = roomRepository.findById(roomId)
        .orElseThrow(() -> new RoomNotFoundException("Room not found: " + roomId));

    Participant participant = new Participant(name, roomId);
    room.addParticipant(participant);

    // Update room in repository (in-memory update)
    roomRepository.save(room);

    return participant;
}
```

**Backend - AddParticipantRequest DTO:**
```java
// dto/AddParticipantRequest.java
package com.retro101.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class AddParticipantRequest {
    @NotBlank(message = "Name is required")
    @Size(min = 1, max = 50, message = "Name must be between 1 and 50 characters")
    private String name;
}
```

### UI/UX Guidelines

**Modal Design (Minimalist):**
- Centered modal with backdrop overlay
- Clean white modal box with rounded corners
- Simple heading: "Enter your name to join"
- Single input field with clear label
- Large "Join Room" button
- No unnecessary elements or distractions
- Focus automatically on input

**Validation Feedback:**
- Error messages in red below input
- Clear, actionable messages
- Error clears when user types
- Submit button disabled when invalid

**Accessibility:**
- Keyboard navigation: Tab, Enter
- Focus trap in modal
- Proper ARIA labels
- Screen reader friendly

**Performance:**
- Modal appears instantly (<100ms)
- API call <200ms
- Total onboarding <30 seconds (NFR13)

### Error Handling Patterns

**Frontend Error Scenarios:**
1. **Empty Name:** "Name is required"
2. **Name Too Long:** "Name must be 50 characters or less"
3. **Network Error:** "Failed to join room. Please try again."
4. **Room Not Found:** Navigate to error page (shouldn't happen if room loaded)
5. **Server Error:** "Failed to join room. Please try again."

**Backend Error Scenarios:**
1. **Invalid Name (empty):** 400 Bad Request with validation error
2. **Name Too Long:** 400 Bad Request with validation error
3. **Room Not Found:** 404 Not Found (RoomNotFoundException)

### Testing Strategy

**Frontend Testing (Manual for MVP):**
- Open room link for first time
- Verify modal appears automatically
- Enter valid name (e.g., "John Doe") → Success
- Enter empty name → Error: "Name is required"
- Enter name with only spaces → Error: "Name is required"
- Enter 51+ character name → Error shown
- Press Enter to submit → Works
- Click "Join Room" button → Works
- Verify modal closes on success
- Verify localStorage has participant data
- Refresh page → Modal should NOT appear again
- Clear localStorage → Modal appears again
- Test keyboard navigation (Tab, Enter)

**Backend Testing (Manual for MVP):**
```bash
# Test valid participant
curl -X POST http://localhost:8080/api/rooms/{roomId}/participants \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe"}'
# Expected: 200 OK with Participant object

# Test empty name (should fail)
curl -X POST http://localhost:8080/api/rooms/{roomId}/participants \
  -H "Content-Type: application/json" \
  -d '{"name": ""}'
# Expected: 400 Bad Request

# Test name too long
curl -X POST http://localhost:8080/api/rooms/{roomId}/participants \
  -H "Content-Type: application/json" \
  -d '{"name": "This is a very long name that exceeds fifty characters limit"}'
# Expected: 400 Bad Request

# Test invalid room ID
curl -X POST http://localhost:8080/api/rooms/invalid-id/participants \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe"}'
# Expected: 404 Not Found
```

### localStorage Structure

**Participant Data:**
```typescript
// Key: participant_{roomId}
// Value: JSON string
{
  "id": "uuid-here",
  "name": "John Doe",
  "roomId": "room-uuid",
  "joinedAt": "2025-12-31T10:30:00"
}
```

**Visit Tracking (from Story 1.3):**
```typescript
// Key: visited_room_{roomId}
// Value: "true"
```

### Deployment Notes

**Environment Variables:**
- No new environment variables needed

**Deployment Steps:**
- Deploy backend first (Railway)
- Deploy frontend (Vercel)
- Test end-to-end: Create room → Share link → Open in incognito → Enter name

### References

**Source Documents:**
- [Source: planning-artifacts/epics.md#Epic-1-Story-1.4]
- [Source: planning-artifacts/architecture.md#Participant-Management]
- [Source: implementation-artifacts/1-1-project-setup-landing-page.md] (Story 1.1)
- [Source: implementation-artifacts/1-2-create-room-with-categories.md] (Story 1.2)
- [Source: implementation-artifacts/1-3-room-access-via-unique-link.md] (Story 1.3)

**External Documentation:**
- [React Modal Accessibility](https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/)
- [localStorage API](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
- [Spring Boot Validation](https://spring.io/guides/gs/validating-form-input/)
- [React useRef Hook](https://react.dev/reference/react/useRef)

## Dev Agent Record

### Agent Model Used

_To be filled by dev agent_

### Debug Log References

_To be filled by dev agent_

### Completion Notes List

_To be filled by dev agent_

### File List

_To be filled by dev agent during implementation_
