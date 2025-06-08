# MQSN Stack Backend: Quarkus + MongoDB

This directory contains the backend application for the MQSN stack demo, built with Quarkus and MongoDB.

## Technology Stack

### Core Framework
- **[Quarkus 3.8.6.1](https://quarkus.io/)** - Supersonic Subatomic Java Framework
  - Container-first design
  - Optimized for GraalVM and HotSpot
  - Minimal footprint Java application

### API Layer
- **RESTEasy Reactive** - Reactive REST implementation
  - Non-blocking I/O for all REST endpoints
  - Reactive return types (Uni/Multi)
  - Minimal overhead request handling

- **JSON Processing**
  - Jackson for JSON serialization/deserialization
  - DTOs for clean API contracts

### Data Access
- **MongoDB with Panache**
  - MongoDB NoSQL document database
  - Reactive MongoDB client
  - Panache for active record or repository patterns
  - Simplified MongoDB queries

### Security
- **SmallRye JWT**
  - JWT token generation and validation
  - Role-based authorization
  - Public/private key cryptographic signing

- **Password Security**
  - jBCrypt for password hashing
  - Secure password storage practices

### Validation
- **Hibernate Validator**
  - Bean validation and constraint checking
  - Input validation for API requests

## Project Structure

```
src/
├── main/
│   ├── java/
│   │   └── org/example/
│   │       ├── AuthResource.java     # Authentication endpoints
│   │       ├── AuthService.java      # Authentication business logic
│   │       ├── Book.java             # Book entity
│   │       ├── BookResource.java     # Book API endpoints
│   │       ├── BookService.java      # Book business logic
│   │       ├── Poem.java             # Poem entity
│   │       ├── PoemResource.java     # Poem API endpoints
│   │       ├── PoemService.java      # Poem business logic
│   │       ├── User.java             # User entity
│   │       ├── dto/                  # Data Transfer Objects
│   │       │   ├── AuthResponse.java # Authentication response DTO
│   │       │   ├── LoginRequest.java # Login request DTO
│   │       │   └── SignupRequest.java # Signup request DTO
│   │       └── util/                 # Utility classes
│   │           └── KeyGenerator.java # JWT key generation utilities
│   └── resources/
│       ├── application.properties    # Application configuration
│       └── META-INF/resources/       # Static resources
└── test/                            # Test directory
    └── java/
        └── org/example/
            └── PoemResourceTest.java # Resource tests
```

## API Endpoints Overview

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Authenticate and receive JWT token

### Books
- `GET /api/books` - Get all books
- `GET /api/books/{id}` - Get book by ID
- `POST /api/books` - Create new book
- `PUT /api/books/{id}` - Update book
- `DELETE /api/books/{id}` - Delete book

### Poems
- `GET /api/poems` - Get all poems
- `GET /api/poems/{id}` - Get poem by ID
- `POST /api/poems` - Create new poem
- `PUT /api/poems/{id}` - Update poem
- `DELETE /api/poems/{id}` - Delete poem

## Configuration Details

### MongoDB Configuration
```properties
# MongoDB Connection
quarkus.mongodb.connection-string=mongodb://localhost:27017
quarkus.mongodb.database=poem_db
```

### JWT Configuration
```properties
# JWT Configuration
mp.jwt.verify.publickey.location=publicKey.pem
mp.jwt.verify.issuer=poem-app
smallrye.jwt.sign.key.location=privateKey.pem
```

### CORS Configuration
```properties
# CORS Configuration
quarkus.http.cors=true
quarkus.http.cors.origins=http://localhost:5173,http://127.0.0.1:5173
quarkus.http.cors.methods=GET,POST,PUT,DELETE
quarkus.http.cors.headers=Content-Type,Authorization
```

## Development

### Starting the Backend Individually
```bash
./mvnw quarkus:dev
```

This starts Quarkus in development mode with:
- Hot reload for Java changes
- Live coding enabled
- Dev UI available at http://localhost:8081/q/dev/

### Development Features
- **Dev UI** - Access development tools and information
- **Swagger UI** - API documentation at /q/swagger-ui
- **GraphQL UI** - If GraphQL extensions are installed
- **Health** - Health check endpoints

### Debugging
Quarkus dev mode allows remote debugging by default on port 5005 (no suspend)

## Performance Considerations

### Memory Optimization
- The backend uses a fraction of memory compared to traditional Java applications
- Minimal dependency injection overhead through build-time processing
- Reduced reflection usage

### Startup Performance
- Extremely fast startup times (~1 second in dev mode)
- Most metadata processing moved to build time
- Optimized class loading

### Reactive Programming
- Non-blocking I/O throughout
- Reactive MongoDB driver
- Efficient thread utilization

## Testing

Run tests using:
```bash
./mvnw test
```

## Packaging

### JVM Mode
```bash
./mvnw package
```

### Native Mode
```bash
./mvnw package -Pnative
```

## Containerization

The project includes several Dockerfile options:
- `Dockerfile.jvm` - For JVM-based deployment
- `Dockerfile.native` - For GraalVM native image deployment
- `Dockerfile.native-micro` - Minimal native image container

### Building a Container
```bash
docker build -f src/main/docker/Dockerfile.jvm -t quarkus-simple-api .
```

### Running the Container
```bash
docker run -i --rm -p 8081:8081 quarkus-simple-api
```

## Key Technical Advantages

1. **Reduced Memory Footprint**: Up to 2-4x reduction vs traditional Java frameworks
2. **Fast Startup**: Near-instant startup for rapid development and scaling
3. **Reactive Core**: Non-blocking programming model for efficient resource utilization
4. **Minimal Configuration**: Sensible defaults with minimal boilerplate
5. **Live Coding**: Immediate feedback during development
6. **Native Compilation**: GraalVM native image support for containerized deployments

This backend is designed to work seamlessly with the SolidJS frontend while providing a high-performance, reactive API layer backed by MongoDB.
