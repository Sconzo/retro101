# Story 1.2: Create Room with Categories

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **facilitator**,
I want **to create a new retrospective room with 2-5 custom categories**,
So that **I can prepare the room format in less than 60 seconds and share it with my team**.

## Acceptance Criteria

**Given** I am on the landing page
**When** I click "Create New Room"
**Then** I am taken to a room creation form

**And** Category definition interface works:
- Form displays input fields for categories
- I can add between 2 and 5 categories (validation enforced)
- Default suggestion shows example categories ("What went well", "To improve", "Action items")
- I can edit/remove categories before creating room
- Form validates that at least 2 categories are provided
- Form validates that category names are not empty
- Clear, simple UI following minimalist design principle (NFR15)

**And** Room creation API works (FR1, FR2):
- POST /api/rooms endpoint accepts category list
- Backend generates unique room ID (UUID or similar)
- Backend stores room with categories in memory
- Backend returns room object with ID and share link
- Response time <200ms (NFR1)

**And** Room entity structure:
- Room model includes: id, categories[], createdAt, active status
- Category model includes: id, name, roomId
- Rooms stored in-memory (Map<String, Room>)

**And** Share link is generated (FR2):
- Unique shareable URL created: `/room/{roomId}`
- Full URL displayed to facilitator: `https://retro101.vercel.app/room/{roomId}`
- Copy button available to copy link to clipboard
- Visual feedback confirms link copied

**And** Facilitator is redirected:
- After room creation, facilitator redirected to `/room/{roomId}`
- Room loads with defined categories visible (FR8, FR10)
- Total time from "Create New Room" click to shareable link: <60 seconds (NFR12)

**And** Error handling works:
- If room creation fails, clear error message shown
- User can retry without losing category input
- Network errors handled gracefully (NFR8)

## Tasks / Subtasks

### Frontend - Room Creation Form
- [ ] Create CreateRoom component/page (AC: Category definition interface)
  - [ ] Form with dynamic category inputs (2-5 categories)
  - [ ] Add/remove category buttons
  - [ ] Default suggestions: "What went well", "To improve", "Action items"
  - [ ] Validation: minimum 2, maximum 5 categories
  - [ ] Validation: category names not empty
  - [ ] Submit button to create room

- [ ] Implement form state management (AC: Category definition interface)
  - [ ] Use React useState or Zustand for form state
  - [ ] Track categories array
  - [ ] Handle add/remove category logic
  - [ ] Form validation before submission

- [ ] Add routing to CreateRoom page (AC: Given I am on landing page)
  - [ ] Install react-router-dom if not already installed
  - [ ] Setup BrowserRouter in App.tsx
  - [ ] Route "/" to Landing page
  - [ ] Route "/create" to CreateRoom page
  - [ ] Landing page button navigates to "/create"

### Frontend - API Integration
- [ ] Create API service for room creation (AC: Room creation API)
  - [ ] POST /api/rooms with categories payload
  - [ ] Handle response with roomId and share link
  - [ ] Error handling for network failures
  - [ ] Response timeout handling

- [ ] Create Room type definitions (AC: Room entity structure)
  - [ ] TypeScript interface for Room
  - [ ] TypeScript interface for Category
  - [ ] API request/response types

### Frontend - Share Link Display
- [ ] Create ShareLink component (AC: Share link generated)
  - [ ] Display full shareable URL
  - [ ] Copy to clipboard button
  - [ ] Visual confirmation on copy (toast or checkmark)
  - [ ] Use Clipboard API or library

- [ ] Implement room redirection (AC: Facilitator redirected)
  - [ ] Navigate to /room/{roomId} after creation
  - [ ] Pass room data via router state or refetch

### Backend - Room Entity & Storage
- [ ] Create Room model/entity (AC: Room entity structure)
  - [ ] Room class with: id (UUID), categories (List), createdAt, active
  - [ ] Category class with: id (UUID), name, roomId
  - [ ] Use Lombok @Data for boilerplate

- [ ] Implement in-memory storage (AC: Rooms stored in-memory)
  - [ ] Create RoomRepository with ConcurrentHashMap<String, Room>
  - [ ] Thread-safe storage operations
  - [ ] Generate unique room IDs (UUID.randomUUID())

### Backend - REST API Endpoint
- [ ] Create RoomController (AC: Room creation API)
  - [ ] POST /api/rooms endpoint
  - [ ] Accept CreateRoomRequest DTO with categories
  - [ ] Return CreateRoomResponse DTO with roomId and shareLink
  - [ ] Response time <200ms (use @Timed if monitoring)

- [ ] Create RoomService (AC: Room creation API)
  - [ ] Business logic for room creation
  - [ ] Validate categories (2-5, non-empty names)
  - [ ] Generate room ID
  - [ ] Store in repository
  - [ ] Build share link URL

- [ ] Create DTOs (AC: Room creation API)
  - [ ] CreateRoomRequest: List<String> categories
  - [ ] CreateRoomResponse: String roomId, String shareLink, Room room
  - [ ] Use @Valid for validation

### Backend - Error Handling
- [ ] Implement error handling (AC: Error handling works)
  - [ ] @ControllerAdvice for global exception handling
  - [ ] Validation exceptions (400 Bad Request)
  - [ ] Server errors (500 Internal Server Error)
  - [ ] Clear error messages in response

### Frontend - Error Handling & UX
- [ ] Add error handling (AC: Error handling works)
  - [ ] Display error messages from API
  - [ ] Retry mechanism for failed requests
  - [ ] Preserve form input on error
  - [ ] Use toast notifications for errors

### Testing
- [ ] Frontend manual testing
  - [ ] Verify form validation (2-5 categories, non-empty)
  - [ ] Verify room creation flow end-to-end
  - [ ] Verify share link copy works
  - [ ] Verify redirect to room page
  - [ ] Test error scenarios

- [ ] Backend manual testing
  - [ ] Test POST /api/rooms with valid payload
  - [ ] Test validation errors (empty categories, >5 categories)
  - [ ] Verify room stored in memory
  - [ ] Verify unique room IDs generated

## Dev Notes

### Previous Story Intelligence (Story 1.1)

**Key Learnings from Story 1.1:**
- Project structure is already set up (frontend: retro101-frontend, backend: retro101-backend)
- Vite + React + TypeScript + Tailwind configured
- Spring Boot 3.x + Maven configured
- Dev servers: Frontend on 5173, Backend on 8080
- CORS already configured for development
- Deployment: Vercel (frontend) + Railway (backend)

**Files Created in Story 1.1:**
- Frontend: src/App.tsx, src/main.tsx, src/index.css
- Frontend: tailwind.config.js, vite.config.ts, tsconfig.json
- Backend: Retro101Application.java, WebSocketConfig.java, CorsConfig.java
- Backend: application-development.yml, application-production.yml

**Patterns Established:**
- Feature-based organization for frontend
- Layer-based organization for backend
- Tailwind utility-first styling
- TypeScript strict mode
- Spring Boot profiles (development, production)

### Architecture Compliance

**CRITICAL: Build Upon Story 1.1 Setup**

**Frontend Additions Required:**
- **Routing:** React Router v6+ (must install: `npm install react-router-dom`)
- **State Management:** Choose Zustand or Context API for room state
- **API Client:** Axios or fetch for HTTP requests
- **Toast Notifications:** react-hot-toast or similar for user feedback
- **Clipboard API:** For copy-to-clipboard functionality

**Backend Additions Required:**
- **Entities:** Room.java, Category.java (in model package)
- **Repository:** RoomRepository.java (in-memory storage)
- **Service:** RoomService.java (business logic)
- **Controller:** RoomController.java (REST endpoints)
- **DTOs:** CreateRoomRequest.java, CreateRoomResponse.java (in dto package)

### File Structure Requirements

**Frontend New Files:**
```
src/
├── features/
│   └── rooms/
│       ├── CreateRoom.tsx           # Room creation page
│       ├── ShareLink.tsx            # Share link component
│       └── types.ts                 # Room/Category TypeScript types
├── services/
│   └── api.ts                       # API client service
├── components/
│   └── CategoryInput.tsx            # Reusable category input
└── App.tsx                          # Update with routes
```

**Backend New Files:**
```
src/main/java/com/retro101/
├── model/
│   ├── Room.java                    # Room entity
│   └── Category.java                # Category entity
├── repository/
│   └── RoomRepository.java          # In-memory storage
├── service/
│   └── RoomService.java             # Business logic
├── controller/
│   └── RoomController.java          # REST endpoints
└── dto/
    ├── CreateRoomRequest.java       # Request DTO
    └── CreateRoomResponse.java      # Response DTO
```

### Technical Requirements

**React Router Setup:**
```typescript
// src/App.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/create" element={<CreateRoom />} />
        <Route path="/room/:roomId" element={<Room />} />
      </Routes>
    </BrowserRouter>
  );
}
```

**API Service Pattern:**
```typescript
// src/services/api.ts
const API_URL = import.meta.env.VITE_API_URL;

export const createRoom = async (categories: string[]) => {
  const response = await fetch(`${API_URL}/api/rooms`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ categories }),
  });
  if (!response.ok) throw new Error('Failed to create room');
  return response.json();
};
```

**Room Entity (Backend):**
```java
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Room {
    private String id;
    private List<Category> categories;
    private LocalDateTime createdAt;
    private boolean active;
}

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Category {
    private String id;
    private String name;
    private String roomId;
}
```

**Room Repository (In-Memory):**
```java
@Repository
public class RoomRepository {
    private final ConcurrentHashMap<String, Room> rooms = new ConcurrentHashMap<>();

    public Room save(Room room) {
        rooms.put(room.getId(), room);
        return room;
    }

    public Optional<Room> findById(String id) {
        return Optional.ofNullable(rooms.get(id));
    }
}
```

**Room Controller:**
```java
@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {
    private final RoomService roomService;

    @PostMapping
    public ResponseEntity<CreateRoomResponse> createRoom(
        @Valid @RequestBody CreateRoomRequest request
    ) {
        CreateRoomResponse response = roomService.createRoom(request);
        return ResponseEntity.ok(response);
    }
}
```

**DTOs:**
```java
@Data
public class CreateRoomRequest {
    @NotNull
    @Size(min = 2, max = 5)
    private List<@NotBlank String> categories;
}

@Data
@AllArgsConstructor
public class CreateRoomResponse {
    private String roomId;
    private String shareLink;
    private Room room;
}
```

### Library & Framework Requirements

**Frontend New Dependencies:**
```bash
npm install react-router-dom zustand react-hot-toast
```

**Frontend package.json additions:**
```json
{
  "dependencies": {
    "react-router-dom": "^6.28.0",
    "zustand": "^5.0.2",
    "react-hot-toast": "^2.4.1"
  }
}
```

**Backend Dependencies (Already in pom.xml from Story 1.1):**
- Spring Boot Starter Web (for REST)
- Lombok (for @Data annotations)
- Spring Boot Starter Validation (for @Valid)

### State Management Decision

**Recommended: Zustand for Room State**

Why Zustand:
- Lightweight (~1KB)
- Simple API
- Perfect for sharing room state across components
- No provider boilerplate
- TypeScript-friendly

```typescript
// src/stores/roomStore.ts
import { create } from 'zustand';

interface RoomState {
  currentRoom: Room | null;
  setRoom: (room: Room) => void;
}

export const useRoomStore = create<RoomState>((set) => ({
  currentRoom: null,
  setRoom: (room) => set({ currentRoom: room }),
}));
```

### UI/UX Guidelines

**Form Design (Minimalist):**
- Clean white background
- Category inputs stacked vertically
- Add category button (+ icon or "Add Category")
- Remove category button (X icon per category)
- Default examples as placeholders
- Submit button prominent (same style as landing page CTA)

**Validation Feedback:**
- Show error messages below inputs
- Disable submit if validation fails
- Show validation errors on blur or submit attempt

**Share Link Display:**
- Modal or dedicated section after creation
- Large, readable URL text
- Copy button with icon
- Success feedback (green checkmark or toast)
- Continue button to proceed to room

**Performance:**
- Form interactions <100ms (NFR1)
- API call <200ms (NFR1)
- Total flow <60 seconds (NFR12)

### Error Handling Patterns

**Frontend Error Handling:**
```typescript
try {
  const response = await createRoom(categories);
  // Success: show share link, redirect
} catch (error) {
  toast.error('Failed to create room. Please try again.');
  // Keep form data intact
}
```

**Backend Error Handling:**
```java
@ControllerAdvice
public class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(
        MethodArgumentNotValidException ex
    ) {
        return ResponseEntity.badRequest()
            .body(new ErrorResponse("Invalid input: " + ex.getMessage()));
    }
}
```

### Testing Strategy

**Frontend Testing (Manual for MVP):**
- Test with 2 categories (minimum)
- Test with 5 categories (maximum)
- Test with 1 category (should fail validation)
- Test with 6 categories (should fail validation)
- Test with empty category names (should fail)
- Test copy to clipboard functionality
- Test navigation and redirect

**Backend Testing (Manual for MVP):**
- cURL or Postman to test POST /api/rooms
- Verify 200 OK with valid payload
- Verify 400 Bad Request with invalid payload
- Verify unique room IDs generated
- Verify room stored in repository

**Example cURL:**
```bash
curl -X POST http://localhost:8080/api/rooms \
  -H "Content-Type: application/json" \
  -d '{"categories": ["What went well", "To improve", "Action items"]}'
```

### Deployment Notes

**Environment Variables:**
- Frontend: VITE_API_URL already configured from Story 1.1
- Backend: No new environment variables needed

**Deployment Steps:**
- Deploy backend first (Railway auto-deploys on git push)
- Deploy frontend (Vercel auto-deploys on git push)
- Test end-to-end on production URLs

### References

**Source Documents:**
- [Source: planning-artifacts/epics.md#Epic-1-Story-1.2]
- [Source: planning-artifacts/architecture.md#API-Communication-Patterns]
- [Source: planning-artifacts/architecture.md#State-Management]
- [Source: implementation-artifacts/1-1-project-setup-landing-page.md] (Previous story)

**External Documentation:**
- [React Router Documentation](https://reactrouter.com/)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [React Hot Toast](https://react-hot-toast.com/)
- [Spring Boot Validation](https://spring.io/guides/gs/validating-form-input/)

## Dev Agent Record

### Agent Model Used

_To be filled by dev agent_

### Debug Log References

_To be filled by dev agent_

### Completion Notes List

_To be filled by dev agent_

### File List

_To be filled by dev agent during implementation_
