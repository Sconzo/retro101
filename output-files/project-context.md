---
project_name: 'retro101'
user_name: 'Rspol'
date: '2025-12-30'
sections_completed: ['technology_stack', 'language_rules', 'framework_rules', 'testing_rules', 'code_quality_rules', 'workflow_rules', 'critical_rules']
existing_patterns_found: 8
status: 'complete'
rule_count: 200+
optimized_for_llm: true
---

# Project Context for AI Agents

_This file contains critical rules and patterns that AI agents must follow when implementing code in this project. Focus on unobvious details that agents might otherwise miss._

---

## Technology Stack & Versions

**CRITICAL:** Always use exact versions specified below. These were verified as compatible on 2025-12-30.

### Frontend Stack
- **React**: 18+ (use latest 18.x, concurrent features enabled)
- **TypeScript**: 5.x (strict mode REQUIRED)
- **Vite**: 6.x (HMR and optimization)
- **Tailwind CSS**: 3.4+ (JIT mode, utility-first)
- **Zustand**: 5.0.9 (state management)
- **React Router**: 6.x (client-side routing)
- **Testing**: Vitest (unit), Playwright 1.57.0 (E2E)

### Backend Stack
- **Java**: 17+ (LTS, minimum version)
- **Spring Boot**: 3.x (latest stable 3.x)
- **Maven**: 3.8+ (build tool)
- **Spring WebSocket**: Built-in (STOMP over SockJS)
- **Testing**: JUnit 5, Mockito

### Version Constraints
- ⚠️ Spring Boot 3.x REQUIRES Java 17+ (will not work with Java 11)
- ⚠️ React 18 hooks patterns required (no class components)
- ⚠️ TypeScript strict mode is MANDATORY (configure in tsconfig.json)
- ⚠️ Tailwind 3.4+ uses JIT mode by default (no purge config needed)

## Critical Implementation Rules

### TypeScript/JavaScript Rules (Frontend)

**Configuration Requirements:**
- ✅ MUST enable `strict: true` in tsconfig.json
- ✅ MUST use ESNext target for modern features
- ✅ MUST enable `jsx: "react-jsx"` for React 18

**Import/Export Patterns:**
- ✅ Use named exports for components: `export function ComponentName()`
- ✅ Use named exports for utilities: `export function utilityName()`
- ✅ Default exports ONLY for pages/routes
- ✅ Absolute imports preferred: `@/components/...` (configure in vite.config.ts)
- ❌ NEVER use `import * as` - be explicit

**Naming Conventions:**
- ✅ **Components**: PascalCase (`RoomView`, `CardItem`)
- ✅ **Files**: Match component name exactly (`RoomView.tsx`, `CardItem.tsx`)
- ✅ **Hooks**: camelCase with `use` prefix (`useRoom`, `useWebSocket`)
- ✅ **Functions**: camelCase (`createCard`, `handleSubmit`)
- ✅ **Constants**: SCREAMING_SNAKE_CASE (`MAX_CARD_LENGTH`, `API_URL`)
- ✅ **Types/Interfaces**: PascalCase (`Room`, `CardMessage`)

**Async Patterns:**
- ✅ ALWAYS use async/await (never raw Promises with .then())
- ✅ ALWAYS handle errors with try/catch
- ✅ Use `Promise<void>` return type for async functions without return value
- ❌ NEVER use `any` type - use `unknown` if type is truly unknown

**Type Safety:**
- ✅ MUST define interfaces for all API request/response types
- ✅ MUST define types for WebSocket messages
- ✅ MUST type all function parameters and return values
- ❌ NEVER use `as any` - refactor code instead
- ❌ NEVER use `@ts-ignore` - fix the type issue

### Java Rules (Backend)

**Language Version:**
- ✅ Use Java 17+ features (records, sealed classes, pattern matching)
- ✅ Prefer `var` for local variables with obvious types
- ✅ Use text blocks for multi-line strings

**Naming Conventions:**
- ✅ **Classes**: PascalCase (`RoomService`, `CardController`)
- ✅ **Methods**: camelCase (`createRoom`, `handleCardCreate`)
- ✅ **Variables**: camelCase (`roomId`, `participantName`)
- ✅ **Constants**: SCREAMING_SNAKE_CASE (`MAX_CARDS_PER_ROOM`)
- ✅ **Packages**: lowercase, no underscores (`com.retro101.service`)

**Spring Boot Patterns:**
- ✅ ALWAYS use constructor injection (NEVER field injection with `@Autowired`)
- ✅ Use `@RequiredArgsConstructor` (Lombok) for cleaner constructors
- ✅ Services MUST be marked `@Service`
- ✅ Controllers MUST be marked `@RestController` or `@Controller`
- ✅ Configuration classes MUST be marked `@Configuration`

**Error Handling:**
- ✅ Create custom exceptions extending RuntimeException
- ✅ Use @ControllerAdvice for global exception handling
- ✅ ALWAYS log exceptions with context: `log.error("Failed to create room", e)`
- ❌ NEVER swallow exceptions silently
- ❌ NEVER catch generic Exception unless re-throwing

**Dependency Injection:**
- ✅ Use constructor injection pattern:
  ```java
  @Service
  @RequiredArgsConstructor
  public class RoomService {
      private final RoomRepository roomRepository;
  }
  ```
- ❌ NEVER use field injection:
  ```java
  @Autowired
  private RoomRepository roomRepository; // ❌ BAD
  ```

**Null Safety:**
- ✅ Use Optional<T> for methods that might return null
- ✅ Validate parameters at service boundaries
- ❌ NEVER return null from collections (return empty collection)

### Cross-Language Patterns

**Error Messages:**
- ✅ User-facing: Clear, actionable ("Failed to create card. Please try again.")
- ✅ Logging: Technical with context ("Failed to create card: roomId={}, error={}")
- ❌ NEVER expose stack traces to users

**Logging Levels:**
- `ERROR`: Failures that need immediate attention
- `WARN`: Degraded functionality or unexpected conditions
- `INFO`: Important business events (room created, card deleted)
- `DEBUG`: Detailed flow information (development only)

### React Framework Rules (Frontend)

**Component Structure:**
- ✅ Use function components ONLY (no class components)
- ✅ One component per file (except small helper components)
- ✅ Co-locate tests: `ComponentName.tsx` + `ComponentName.test.tsx`
- ✅ Extract complex logic into custom hooks

**Hooks Usage Patterns:**
- ✅ Call hooks at top level (never inside conditions/loops)
- ✅ Custom hooks MUST start with `use` prefix
- ✅ Use `useCallback` for functions passed to child components
- ✅ Use `useMemo` for expensive computations ONLY (don't over-optimize)
- ✅ Cleanup effects properly: return cleanup function from `useEffect`
- ❌ NEVER call hooks conditionally

**Example - Correct Hook Usage:**
```typescript
// ✅ GOOD
function useWebSocket(roomId: string) {
  const [status, setStatus] = useState<'connected' | 'disconnected'>('disconnected');

  useEffect(() => {
    const client = createStompClient(roomId);
    client.activate();
    setStatus('connected');

    // Cleanup
    return () => {
      client.deactivate();
      setStatus('disconnected');
    };
  }, [roomId]);

  return status;
}
```

**State Management with Zustand:**
- ✅ Store in `stores/` directory
- ✅ One store per major feature (roomStore, not globalStore)
- ✅ ALWAYS use immutable updates:
  ```typescript
  // ✅ GOOD
  addCard: (card) => set((state) => ({
    cards: [...state.cards, card]
  }))

  // ❌ BAD
  addCard: (card) => {
    state.cards.push(card); // Direct mutation!
  }
  ```
- ✅ Actions should be imperative: `addCard`, `deleteCard` (not `cardAdded`)
- ✅ Use selectors for derived state
- ❌ NEVER mutate state directly

**Performance Patterns:**
- ✅ Use `React.memo()` for expensive list items (CardItem, ParticipantAvatar)
- ✅ Use `React.lazy()` + Suspense for route-based code splitting
- ✅ Avoid inline object/function creation in JSX (causes re-renders)
- ❌ NEVER use index as key in lists that can reorder

**Error Handling:**
- ✅ Use Error Boundaries for component tree errors
- ✅ Use try/catch in event handlers
- ✅ Show user-friendly error messages via toast
- ✅ Log errors to console in development: `console.error('[Component]', error)`

### Spring Boot Framework Rules (Backend)

**Controller Layer Patterns:**
- ✅ Use `@RestController` for REST APIs
- ✅ Use `@Controller` for WebSocket controllers
- ✅ Path variables: `@PathVariable String roomId`
- ✅ Request bodies: `@RequestBody @Valid CreateRoomRequest`
- ✅ Return `ResponseEntity<T>` for explicit status codes
- ❌ NEVER put business logic in controllers (delegate to services)

**Example - REST Controller:**
```java
@RestController
@RequestMapping("/api/rooms")
@RequiredArgsConstructor
public class RoomController {
    private final RoomService roomService;

    @PostMapping
    public ResponseEntity<Room> createRoom(@RequestBody @Valid CreateRoomRequest request) {
        Room room = roomService.createRoom(request.getCategories());
        return ResponseEntity.status(HttpStatus.CREATED).body(room);
    }
}
```

**Service Layer Patterns:**
- ✅ Mark with `@Service`
- ✅ Use constructor injection for dependencies
- ✅ Services contain ALL business logic
- ✅ Services orchestrate repositories
- ✅ Use `@Transactional` when persistence is added (future PostgreSQL)
- ❌ NEVER access repositories from controllers directly

**WebSocket Configuration:**
- ✅ Configure STOMP endpoints in `WebSocketConfig`
- ✅ Use `@MessageMapping` for client messages
- ✅ Use `SimpMessagingTemplate` for broadcasting
- ✅ Topics: `/topic/room/{roomId}/...` for broadcasts
- ✅ Destinations: `/app/room/{roomId}/...` for client → server

**Example - WebSocket Controller:**
```java
@Controller
@RequiredArgsConstructor
public class CardWebSocketController {
    private final CardService cardService;
    private final SimpMessagingTemplate messagingTemplate;

    @MessageMapping("/room/{roomId}/card/create")
    public void handleCreateCard(@DestinationVariable String roomId, CardMessage message) {
        Card card = cardService.createCard(roomId, message);
        messagingTemplate.convertAndSend(
            "/topic/room/" + roomId + "/cards",
            new ServerMessage("CARD_CREATED", card, System.currentTimeMillis())
        );
    }
}
```

**Configuration Classes:**
- ✅ Mark with `@Configuration`
- ✅ Use `@Bean` for third-party dependencies
- ✅ Keep configs focused (WebSocketConfig, CorsConfig, JacksonConfig)
- ✅ Use `@Value` or `@ConfigurationProperties` for external config

**Exception Handling:**
- ✅ Create custom exceptions: `RoomNotFoundException extends RuntimeException`
- ✅ Use `@ControllerAdvice` for global handling
- ✅ Return structured error responses
- ✅ Log exceptions with SLF4J: `private static final Logger log = LoggerFactory.getLogger(ServiceName.class);`

### Frontend ↔ Backend Integration

**API Communication:**
- ✅ Frontend calls REST for one-time operations (create room)
- ✅ Frontend uses WebSocket for real-time collaboration (cards, participants)
- ✅ JSON field naming: camelCase on both sides (Spring Boot Jackson default)
- ✅ Dates: ISO 8601 strings in JSON (`"2025-12-30T10:30:00Z"`)

**WebSocket Message Format (MUST BE CONSISTENT):**
```typescript
// Client → Server
{
  type: 'CARD_CREATE' | 'CARD_UPDATE' | 'CARD_DELETE',
  payload: { ... }
}

// Server → Clients
{
  type: 'CARD_CREATED' | 'CARD_UPDATED' | 'CARD_DELETED',
  payload: { ... },
  timestamp: number
}
```

**CORS Configuration:**
- ✅ Development: Allow `http://localhost:5173` (Vite dev server)
- ✅ Production: Allow `https://retro101.vercel.app`
- ✅ Configure in both REST (`CorsConfig`) and WebSocket (`WebSocketConfig`)

### Testing Rules

**Test Organization:**

**Frontend (Vitest + Playwright):**
- ✅ Co-locate unit/component tests: `Component.tsx` → `Component.test.tsx`
- ✅ E2E tests in separate `tests/e2e/` directory
- ✅ Test fixtures in `tests/fixtures/mockData.ts`
- ✅ One test file per component/hook/utility

**Backend (JUnit 5):**
- ✅ Mirror source structure: `src/main/java/...` → `src/test/java/...`
- ✅ Unit tests: `ServiceNameTest.java`
- ✅ Integration tests: `ServiceNameIntegrationTest.java` in `integration/` package
- ✅ Test utilities in `src/test/java/.../util/TestDataBuilder.java`

**Test Naming Conventions:**
- ✅ Test methods: `shouldDoSomethingWhenCondition()` (descriptive, readable)
- ✅ Frontend: `describe('ComponentName', () => { it('should...', () => {}) })`
- ✅ Backend: `@Test void shouldCreateRoomWithValidCategories()`
- ❌ NEVER use generic names like `test1()`, `testMethod()`

**Coverage Requirements:**
- ✅ Frontend: 70%+ for core components (RoomView, CardList, hooks)
- ✅ Backend: 80%+ for services and controllers
- ✅ Focus on critical paths (card CRUD, WebSocket, room creation)
- ❌ Don't chase 100% coverage - focus on valuable tests

**Mock Usage Patterns:**

**Frontend (Vitest):**
```typescript
// ✅ GOOD - Mock external dependencies
import { vi } from 'vitest';

vi.mock('@/services/api', () => ({
  createRoom: vi.fn()
}));

it('should call API when creating room', async () => {
  const { createRoom } = await import('@/services/api');
  await createRoomAction(['Good', 'Bad']);
  expect(createRoom).toHaveBeenCalledWith(['Good', 'Bad']);
});
```

**Backend (Mockito):**
```java
// ✅ GOOD - Mock dependencies in unit tests
@ExtendWith(MockitoExtension.class)
class RoomServiceTest {
    @Mock
    private RoomRepository roomRepository;

    @InjectMocks
    private RoomService roomService;

    @Test
    void shouldCreateRoomWithCategories() {
        // Arrange
        List<String> categories = List.of("Good", "Bad", "Actions");
        when(roomRepository.save(any())).thenAnswer(i -> i.getArgument(0));

        // Act
        Room room = roomService.createRoom(categories);

        // Assert
        assertThat(room.getCategories()).hasSize(3);
        verify(roomRepository).save(any(Room.class));
    }
}
```

**Integration vs Unit Test Boundaries:**

**Unit Tests:**
- ✅ Test single class/component in isolation
- ✅ Mock all external dependencies (repositories, services, APIs)
- ✅ Fast execution (< 100ms each)
- ✅ Run on every commit

**Integration Tests:**
- ✅ Test multiple components working together
- ✅ Use real WebSocket connections (Spring Boot Test)
- ✅ Use MockMvc for REST endpoint testing
- ✅ Can be slower (< 1s each)
- ✅ Run before merge/deploy

**E2E Tests (Playwright):**
- ✅ Test complete user flows (create room → add cards → see real-time updates)
- ✅ Test across multiple browser tabs (real-time sync)
- ✅ Use data-testid attributes for selectors
- ✅ Run before production deploy

**Test Structure Requirements:**

**Frontend Test Pattern:**
```typescript
// ✅ GOOD - Arrange-Act-Assert
describe('CardForm', () => {
  it('should create card when form is submitted', async () => {
    // Arrange
    const onCardCreate = vi.fn();
    render(<CardForm onSubmit={onCardCreate} />);

    // Act
    await userEvent.type(screen.getByRole('textbox'), 'Test card');
    await userEvent.click(screen.getByRole('button', { name: /add/i }));

    // Assert
    expect(onCardCreate).toHaveBeenCalledWith({
      content: 'Test card',
      categoryId: expect.any(String)
    });
  });
});
```

**Backend Test Pattern:**
```java
// ✅ GOOD - Given-When-Then
@Test
void shouldReturnCreatedStatusWhenRoomIsCreated() {
    // Given
    CreateRoomRequest request = new CreateRoomRequest(
        List.of("Good", "Bad", "Actions")
    );

    // When
    ResponseEntity<Room> response = roomController.createRoom(request);

    // Then
    assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CREATED);
    assertThat(response.getBody()).isNotNull();
    assertThat(response.getBody().getId()).isNotBlank();
}
```

**WebSocket Testing:**
```typescript
// Frontend E2E - Multiple tabs real-time sync
test('should sync cards between participants in real-time', async ({ page, context }) => {
  // Open room in first tab
  await page.goto('/room/test-room');
  await page.fill('[data-testid="participant-name"]', 'User 1');
  await page.click('[data-testid="join-button"]');

  // Open same room in second tab
  const secondPage = await context.newPage();
  await secondPage.goto('/room/test-room');
  await secondPage.fill('[data-testid="participant-name"]', 'User 2');
  await secondPage.click('[data-testid="join-button"]');

  // Create card in first tab
  await page.fill('[data-testid="card-input"]', 'Test card content');
  await page.click('[data-testid="add-card"]');

  // Verify card appears in second tab within 1 second
  await expect(secondPage.getByText('Test card content')).toBeVisible({ timeout: 1000 });
});
```

**Critical Testing Rules:**
- ✅ ALWAYS test error paths, not just happy paths
- ✅ ALWAYS test edge cases (empty lists, null values, long strings)
- ✅ ALWAYS cleanup in test teardown (close connections, clear mocks)
- ✅ Use descriptive test names that explain what's being tested
- ❌ NEVER commit commented-out tests
- ❌ NEVER use `setTimeout` in tests - use proper async waits
- ❌ NEVER share state between tests - each test must be independent

### Code Quality & Style Rules

**Linting & Formatting:**

**Frontend (ESLint + Prettier):**
- ✅ Run `npm run lint` before committing
- ✅ Configure ESLint for React + TypeScript + Vite
- ✅ Use Prettier for automatic formatting (2 spaces, single quotes, trailing commas)
- ✅ Install lint-staged + husky for pre-commit hooks
- ❌ NEVER disable ESLint rules without documenting why
- ❌ NEVER commit code with linting errors

**Backend (Checkstyle + SpotBugs):**
- ✅ Run `mvn checkstyle:check` before committing
- ✅ Follow Google Java Style Guide (with minor adjustments)
- ✅ Use IntelliJ auto-format (Ctrl+Alt+L) before saving
- ✅ Configure Maven to fail build on style violations
- ❌ NEVER suppress warnings without @SuppressWarnings with reason

**Code Organization:**

**Frontend File Structure:**
```
src/
├── features/              # Feature modules
│   ├── room/
│   │   ├── components/    # Room-specific components
│   │   ├── hooks/         # Room-specific custom hooks
│   │   └── types.ts       # Room-specific TypeScript types
│   ├── card/
│   └── participant/
├── components/            # Shared components ONLY
│   └── ui/                # Generic UI primitives (Button, Input, etc.)
├── stores/                # Zustand stores (one per feature)
├── services/              # API and WebSocket services
├── utils/                 # Pure utility functions
└── types/                 # Global TypeScript types
```

**Backend Package Structure:**
```
com.retro101/
├── controller/            # REST + WebSocket controllers
├── service/               # Business logic
├── repository/            # Data access (in-memory for MVP)
├── model/                 # Domain entities
├── dto/                   # Request/Response DTOs
├── config/                # Spring configurations
├── exception/             # Custom exceptions + global handler
└── util/                  # Utility classes
```

**Naming Conventions (Enforced):**

**Frontend:**
- ✅ Components: `PascalCase` matching file name (`RoomView.tsx`)
- ✅ Hooks: `camelCase` with `use` prefix (`useRoom.ts`)
- ✅ Utils: `camelCase` (`formatDate.ts`)
- ✅ Constants: `SCREAMING_SNAKE_CASE` in `constants.ts`
- ✅ Types/Interfaces: `PascalCase` (`Room.ts`, `CardMessage.ts`)

**Backend:**
- ✅ Controllers: `*Controller.java` (`RoomController.java`)
- ✅ Services: `*Service.java` (`CardService.java`)
- ✅ Repositories: `*Repository.java` (`RoomRepository.java`)
- ✅ DTOs: `*Request.java` / `*Response.java` (`CreateRoomRequest.java`)
- ✅ Exceptions: `*Exception.java` (`RoomNotFoundException.java`)

**Documentation Requirements:**

**When to Document:**
- ✅ Complex business logic (explain WHY, not WHAT)
- ✅ Non-obvious algorithms or calculations
- ✅ Public API methods (JSDoc/JavaDoc)
- ✅ Workarounds or temporary fixes (add TODO with context)
- ❌ DON'T document self-explanatory code

**Frontend JSDoc:**
```typescript
/**
 * Creates a WebSocket connection to a room with automatic reconnection
 * @param roomId - The unique room identifier
 * @param onMessage - Callback for incoming messages
 * @returns Cleanup function to disconnect
 */
export function useWebSocket(
  roomId: string,
  onMessage: (message: ServerMessage) => void
): () => void {
  // Implementation...
}
```

**Backend JavaDoc:**
```java
/**
 * Creates a new retrospective room with the specified categories.
 * Generates a unique room ID and initializes empty card collections.
 *
 * @param categories List of category names (e.g., ["Good", "Bad", "Actions"])
 * @return The created room with unique ID
 * @throws IllegalArgumentException if categories list is empty
 */
public Room createRoom(List<String> categories) {
    // Implementation...
}
```

**Code Complexity Rules:**
- ✅ Max function length: 50 lines (split larger functions)
- ✅ Max cyclomatic complexity: 10 (refactor if exceeded)
- ✅ Max parameters: 4 (use objects for more)
- ✅ Max nesting: 3 levels (use early returns)
- ❌ NO God classes/components (split responsibilities)

**Refactoring Indicators:**
- 🔴 Function > 50 lines → Extract smaller functions
- 🔴 Duplicated logic in 3+ places → Create utility function
- 🔴 Component > 200 lines → Split into sub-components
- 🔴 Service > 500 lines → Split by domain responsibility
- 🔴 Deeply nested conditionals → Use early returns / guard clauses

**Import Organization:**

**Frontend (TypeScript):**
```typescript
// ✅ GOOD - Organized imports
// 1. External libraries
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// 2. Internal absolute imports
import { useRoomStore } from '@/stores/roomStore';
import { WebSocketService } from '@/services/websocket';

// 3. Relative imports
import { CardList } from './components/CardList';
import { ParticipantList } from './components/ParticipantList';

// 4. Types
import type { Room, Card } from '@/types';
```

**Backend (Java):**
```java
// ✅ GOOD - Organized imports (IntelliJ auto-sorts)
// 1. Java standard library
import java.util.List;
import java.util.UUID;

// 2. Third-party libraries
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

// 3. Project imports
import com.retro101.model.Room;
import com.retro101.repository.RoomRepository;
```

**Dead Code & TODOs:**
- ✅ Remove commented-out code immediately (use git history)
- ✅ Remove unused imports (linter will catch)
- ✅ TODO comments MUST have context and ticket number: `// TODO(RETRO-123): Implement pagination`
- ❌ NEVER commit `console.log` / `System.out.println` in production code (use logging)
- ❌ NEVER commit debugging code (`debugger;` statements)

**Performance Rules:**
- ✅ Use `React.memo()` for expensive list items only (not every component)
- ✅ Use `useMemo()`/`useCallback()` when profiling shows benefit
- ✅ Lazy load routes: `const RoomView = lazy(() => import('./features/room/RoomView'))`
- ✅ Optimize bundle: Check size with `npm run build -- --analyze`
- ✅ Backend: Use `@Transactional(readOnly = true)` for read-only queries (future DB)
- ❌ NEVER premature optimization - measure first

**Security Rules:**
- ✅ Validate ALL user input on backend (use `@Valid`)
- ✅ Sanitize HTML content in cards (prevent XSS)
- ✅ Use HTTPS in production (Vercel + Railway default)
- ✅ Set secure CORS policies (specific origins, not *)
- ❌ NEVER trust client-side validation only
- ❌ NEVER log sensitive data (passwords, tokens)

### Development Workflow Rules

**Git Workflow:**
- ✅ Branch naming: `feature/room-creation`, `fix/card-delete-bug`, `refactor/websocket-service`
- ✅ Commit early, commit often (small, focused commits)
- ✅ Commit message format:
  ```
  feat(room): add room creation with validation

  - Implement RoomService.createRoom()
  - Add validation for category names
  - Add unit tests for room creation

  🤖 Generated with Claude Code
  ```
- ✅ Always pull before pushing: `git pull --rebase origin main`
- ❌ NEVER commit directly to `main` branch
- ❌ NEVER force push to shared branches

**Development Environment:**

**Frontend:**
```bash
# Start dev server
npm run dev              # http://localhost:5173

# Run linter
npm run lint

# Run tests
npm run test             # Vitest unit tests
npm run test:e2e         # Playwright E2E tests

# Build for production
npm run build
npm run preview          # Preview production build
```

**Backend:**
```bash
# Start dev server
mvn spring-boot:run      # http://localhost:8080

# Run tests
mvn test                 # Unit tests
mvn verify               # Integration tests

# Run linter
mvn checkstyle:check

# Build for production
mvn clean package
```

**Environment Variables:**

**Frontend (.env.development, .env.production):**
```bash
VITE_API_URL=http://localhost:8080
VITE_WS_URL=ws://localhost:8080/ws
```

**Backend (application-dev.yml, application-prod.yml):**
```yaml
server:
  port: 8080
spring:
  websocket:
    allowed-origins: "http://localhost:5173"
```

**Pre-Deployment Checklist:**
- ✅ All tests passing (`npm test && npm run test:e2e`, `mvn verify`)
- ✅ No linting errors (`npm run lint`, `mvn checkstyle:check`)
- ✅ Build succeeds locally (`npm run build`, `mvn package`)
- ✅ Environment variables configured (Vercel dashboard, Railway dashboard)
- ✅ CORS configured for production domains
- ✅ WebSocket endpoint tested with production URL

**Deployment Process:**

**Frontend (Vercel):**
1. Push to `main` branch
2. Vercel auto-deploys from GitHub
3. Verify build logs in Vercel dashboard
4. Test deployed app at `https://retro101.vercel.app`

**Backend (Railway):**
1. Push to `main` branch
2. Railway auto-deploys from GitHub
3. Verify build logs in Railway dashboard
4. Test API at `https://retro101-backend.railway.app/api/rooms`

### Critical Don't-Miss Rules

**🚨 ARCHITECTURE VIOLATIONS (NEVER DO THESE):**

**❌ BAD - Accessing Repository from Controller:**
```java
// ❌ NEVER DO THIS
@RestController
public class RoomController {
    @Autowired
    private RoomRepository roomRepository; // WRONG!

    @PostMapping("/api/rooms")
    public Room createRoom() {
        return roomRepository.save(new Room()); // Bypass business logic!
    }
}
```
**✅ GOOD - Use Service Layer:**
```java
// ✅ ALWAYS DO THIS
@RestController
@RequiredArgsConstructor
public class RoomController {
    private final RoomService roomService; // Correct!

    @PostMapping("/api/rooms")
    public ResponseEntity<Room> createRoom(@RequestBody CreateRoomRequest request) {
        Room room = roomService.createRoom(request.getCategories());
        return ResponseEntity.status(HttpStatus.CREATED).body(room);
    }
}
```

**❌ BAD - Mutating Zustand State Directly:**
```typescript
// ❌ NEVER DO THIS
const useRoomStore = create<RoomState>((set, get) => ({
  cards: [],
  addCard: (card) => {
    get().cards.push(card); // DIRECT MUTATION! Will NOT trigger re-render!
  }
}));
```
**✅ GOOD - Immutable State Updates:**
```typescript
// ✅ ALWAYS DO THIS
const useRoomStore = create<RoomState>((set) => ({
  cards: [],
  addCard: (card) => set((state) => ({
    cards: [...state.cards, card] // New array, triggers re-render
  }))
}));
```

**❌ BAD - Inconsistent WebSocket Message Format:**
```typescript
// ❌ Frontend sends this:
{ action: 'CREATE_CARD', data: {...} }

// ❌ Backend expects this:
{ type: 'CARD_CREATE', payload: {...} }

// Result: Messages don't work!
```
**✅ GOOD - Consistent Format:**
```typescript
// ✅ BOTH sides use:
{
  type: 'CARD_CREATE',
  payload: { content: '...', categoryId: '...' }
}
```

**🔥 REAL-TIME SYNC GOTCHAS:**

**❌ BAD - No Optimistic Updates:**
```typescript
// ❌ User waits for server response (slow, laggy UX)
async function createCard(content: string) {
  const response = await api.post('/cards', { content });
  addCardToStore(response.data); // Only updates after roundtrip
}
```
**✅ GOOD - Optimistic Updates:**
```typescript
// ✅ Update UI immediately, then sync
async function createCard(content: string) {
  const tempCard = { id: uuid(), content, synced: false };
  addCardToStore(tempCard); // IMMEDIATE UI update

  try {
    await websocket.send({ type: 'CARD_CREATE', payload: { content } });
    // Backend broadcasts, all clients receive and reconcile
  } catch (error) {
    removeCardFromStore(tempCard.id); // Rollback on error
    showToast('Failed to create card');
  }
}
```

**❌ BAD - Missing WebSocket Cleanup:**
```typescript
// ❌ Memory leak! Connection stays open when component unmounts
useEffect(() => {
  const client = createStompClient(roomId);
  client.activate();
  // MISSING cleanup!
}, [roomId]);
```
**✅ GOOD - Proper Cleanup:**
```typescript
// ✅ Always cleanup connections
useEffect(() => {
  const client = createStompClient(roomId);
  client.activate();

  return () => {
    client.deactivate(); // Cleanup on unmount
  };
}, [roomId]);
```

**⚠️ EDGE CASES TO HANDLE:**

1. **Empty Room IDs:**
   - ✅ Validate roomId exists before WebSocket connection
   - ✅ Show error page if room not found

2. **WebSocket Disconnection:**
   - ✅ Implement exponential backoff retry (max 5 attempts)
   - ✅ Show "Reconnecting..." indicator to user
   - ✅ Don't lose unsent messages (queue them)

3. **Long Card Content:**
   - ✅ Max length: 500 characters (validate frontend + backend)
   - ✅ Show character count while typing
   - ✅ Truncate with ellipsis in display if needed

4. **Empty Participant Names:**
   - ✅ Require minimum 1 character
   - ✅ Auto-generate fallback: "Participant #X"

5. **Concurrent Card Edits:**
   - ✅ Last write wins (simple conflict resolution)
   - ✅ Show warning if card was modified by another user
   - ✅ Future: Add optimistic locking with version field

**🔒 SECURITY EDGE CASES:**

1. **XSS in Card Content:**
   ```typescript
   // ❌ BAD - Renders malicious scripts
   <div>{card.content}</div>

   // ✅ GOOD - React escapes by default, but sanitize HTML
   import DOMPurify from 'dompurify';
   <div>{DOMPurify.sanitize(card.content)}</div>
   ```

2. **CORS Misconfiguration:**
   ```java
   // ❌ BAD - Allows all origins
   .setAllowedOrigins("*")

   // ✅ GOOD - Specific origins only
   .setAllowedOrigins("http://localhost:5173", "https://retro101.vercel.app")
   ```

3. **Missing Input Validation:**
   ```java
   // ❌ BAD - No validation
   public Room createRoom(List<String> categories) {
       return roomRepository.save(new Room(categories));
   }

   // ✅ GOOD - Validate input
   public Room createRoom(@Valid CreateRoomRequest request) {
       if (request.getCategories().isEmpty()) {
           throw new IllegalArgumentException("Categories cannot be empty");
       }
       // ...
   }
   ```

**💡 PERFORMANCE GOTCHAS:**

1. **Rendering All Cards Without Virtualization:**
   - ✅ OK for < 50 cards (typical retrospective)
   - ✅ If > 100 cards, use `react-window` for virtualization

2. **Not Memoizing WebSocket Callbacks:**
   ```typescript
   // ❌ BAD - Creates new function on every render
   useEffect(() => {
     websocket.onMessage((msg) => handleMessage(msg));
   }, [websocket]);

   // ✅ GOOD - Memoize callback
   const handleMessage = useCallback((msg) => {
     // Handle message
   }, []);

   useEffect(() => {
     websocket.onMessage(handleMessage);
   }, [websocket, handleMessage]);
   ```

3. **Large Bundle Size:**
   - ✅ Lazy load routes with React.lazy()
   - ✅ Check bundle: `npm run build -- --analyze`
   - ✅ Target: < 200KB gzipped for initial load

**📊 MONITORING & DEBUGGING:**

**Development:**
- ✅ Use React DevTools for component debugging
- ✅ Use Redux DevTools for Zustand (zustand/middleware)
- ✅ Check Network tab for WebSocket frames
- ✅ Add `[ComponentName]` prefix to console.error() logs

**Production:**
- ✅ Frontend: Vercel auto-logs errors
- ✅ Backend: Railway auto-logs Spring Boot output
- ✅ Future: Add Sentry for error tracking
- ✅ Future: Add Web Vitals monitoring

**🎯 WHEN IN DOUBT:**
- ✅ Check architecture.md for decisions
- ✅ Check this project-context.md for patterns
- ✅ Look at existing code for examples
- ✅ Follow the established patterns (don't reinvent)
- ✅ Ask for clarification if architecture is ambiguous

---

## Usage Guidelines

**For AI Agents:**

- ✅ **ALWAYS read this file** before implementing any code
- ✅ **Follow ALL rules exactly** as documented - no exceptions
- ✅ **When in doubt**, prefer the more restrictive/explicit option
- ✅ **Cross-reference** with architecture.md for strategic decisions
- ✅ **Update this file** if you discover new critical patterns during implementation

**For Humans:**

- ✅ **Keep this file lean** - focus only on agent needs and non-obvious rules
- ✅ **Update when stack changes** - add new versions, remove deprecated tech
- ✅ **Review quarterly** - remove rules that become obvious or outdated
- ✅ **Refine patterns** - improve clarity based on agent mistakes or confusion
- ✅ **Don't duplicate architecture.md** - this file is for implementation details, not strategic decisions

**File Maintenance:**

- Add new rules when you discover AI agents making consistent mistakes
- Remove rules that are now obvious or handled by linters
- Update technology versions when upgrading dependencies
- Refine language when rules are misunderstood
- Keep total length under 1000 lines for optimal LLM context usage

**Last Updated:** 2025-12-30
