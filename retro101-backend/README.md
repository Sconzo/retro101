# retro101 Backend

Spring Boot backend with WebSocket support.

## Setup

Requires:
- Java 17+
- Maven 3.8+

## Development

```bash
mvn spring-boot:run
```

Runs on http://localhost:8080 with development profile.

## Environment Variables

For development, configuration is in `src/main/resources/application-development.yml`.

For production, create environment variables (see `.env.example`):

```bash
SPRING_PROFILES_ACTIVE=production
ALLOWED_ORIGINS=https://retro101.vercel.app
PORT=8080
```

## Build

```bash
mvn clean package
```

Generates `target/retro101-backend.jar`.

## Run Production Build

```bash
java -jar target/retro101-backend.jar
```

## Tests

```bash
# Unit tests
mvn test

# Integration tests
mvn verify
```

## Project Structure

```
src/main/java/com/retro101/
├── Retro101Application.java  # Spring Boot main class
├── controller/               # REST & WebSocket controllers
├── service/                  # Business logic layer
├── repository/               # Data access layer
├── model/                    # Domain models/entities
├── config/                   # Spring configuration classes
│   ├── WebSocketConfig.java  # WebSocket configuration
│   └── CorsConfig.java       # CORS configuration
├── exception/                # Custom exceptions
├── dto/                      # Data Transfer Objects
└── util/                     # Utility classes

src/main/resources/
├── application.yml           # Base configuration
├── application-development.yml   # Dev profile
└── application-production.yml    # Prod profile
```

## Tech Stack

- **Java:** 17+ (LTS version)
- **Spring Boot:** 3.x with Spring Web + Spring WebSocket
- **Maven:** 3.8+ build tool
- **Lombok:** Reduce boilerplate code
- **JUnit 5:** Testing framework

## Deployment

Deploys automatically to Railway on push to `main` branch.

**Build Settings:**
- Build: Maven automatic detection
- Start Command: `java -jar target/retro101-backend.jar`

**Environment Variables in Railway:**
- `SPRING_PROFILES_ACTIVE=production`
- `ALLOWED_ORIGINS`: Vercel frontend URL

## Architecture Notes

- **Layer-based structure:** controller → service → repository
- **CORS:** Configured for development (localhost:5173) and production (Vercel)
- **WebSocket:** STOMP over SockJS for real-time communication
- **In-memory storage:** Using ConcurrentHashMap for MVP (no database yet)
