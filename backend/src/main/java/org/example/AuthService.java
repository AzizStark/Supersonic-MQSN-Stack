package org.example;

import io.smallrye.jwt.build.Jwt;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.Response;
import org.eclipse.microprofile.jwt.Claims;
import org.example.dto.AuthResponse;
import org.example.dto.LoginRequest;
import org.example.dto.SignupRequest;
import org.jboss.logging.Logger;
import org.mindrot.jbcrypt.BCrypt;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Set;

/**
 * Service class handling user authentication operations
 */
@ApplicationScoped
public class AuthService {

    private static final Logger LOGGER = Logger.getLogger(AuthService.class);
    private static final String ROLE_USER = "USER";
    private static final String ROLE_ADMIN = "ADMIN";
    
    /**
     * Process user registration request
     *
     * @param request The signup request
     * @return Response with authentication token or error message
     */
    public Response register(SignupRequest request) {
        LOGGER.infof("Processing registration for username: %s", request.getUsername());
        
        // Check if username already exists
        if (User.findByUsername(request.getUsername()) != null) {
            LOGGER.infof("Registration failed: Username '%s' already exists", request.getUsername());
            return Response.status(Response.Status.CONFLICT)
                .entity(new AuthResponse(null, null, null, "Username already exists"))
                .build();
        }
        
        // Check if email already exists
        if (User.findByEmail(request.getEmail()) != null) {
            LOGGER.infof("Registration failed: Email '%s' already exists", request.getEmail());
            return Response.status(Response.Status.CONFLICT)
                .entity(new AuthResponse(null, null, null, "Email already exists"))
                .build();
        }
        
        // Hash the password
        String hashedPassword = BCrypt.hashpw(request.getPassword(), BCrypt.gensalt());
        
        // Set user roles
        List<String> roles = new ArrayList<>();
        roles.add(ROLE_USER);
        if (request.isAdmin()) {
            roles.add(ROLE_ADMIN);
        }
        
        // Create and persist the new user
        User user = new User(request.getUsername(), request.getEmail(), hashedPassword, roles);
        user.persist();
        
        LOGGER.infof("User registered successfully: %s", request.getUsername());
        
        // Generate JWT token
        String token = generateToken(user);
        
        return Response.status(Response.Status.CREATED)
            .entity(new AuthResponse(token, user.getUsername(), user.getRoles(), "User registered successfully"))
            .build();
    }
    
    /**
     * Process user login request
     *
     * @param request The login request
     * @return Response with authentication token or error message
     */
    public Response login(LoginRequest request) {
        LOGGER.infof("Processing login for username: %s", request.getUsername());
        
        // Find user by username
        User user = User.findByUsername(request.getUsername());
        
        // Check if user exists and password matches
        if (user == null || !BCrypt.checkpw(request.getPassword(), user.getPassword())) {
            LOGGER.info("Login failed: Invalid username or password");
            return Response.status(Response.Status.UNAUTHORIZED)
                .entity(new AuthResponse(null, null, null, "Invalid username or password"))
                .build();
        }
        
        LOGGER.infof("User logged in successfully: %s", request.getUsername());
        
        // Generate JWT token
        String token = generateToken(user);
        
        return Response.ok(new AuthResponse(token, user.getUsername(), user.getRoles(), "Login successful"))
            .build();
    }
    
    /**
     * Generate JWT token for authenticated user
     *
     * @param user The authenticated user
     * @return JWT token as string
     */
    private String generateToken(User user) {
        Instant now = Instant.now();
        Instant expiry = now.plus(Duration.ofHours(24)); // Token valid for 24 hours
        
        return Jwt.issuer("poem-app")
            .subject(user.getUsername())
            .upn(user.getEmail())
            .groups(Set.copyOf(user.getRoles()))
            .claim(Claims.full_name.name(), user.getUsername())
            .claim(Claims.email.name(), user.getEmail())
            .issuedAt(now)
            .expiresAt(expiry)
            .sign();
    }
    
    /**
     * Initialize the database with default users
     * This method should be called on application startup
     */
    public void initializeUsers() {
        // Check if users exist, if not create default admin and user
        if (User.count() == 0) {
            LOGGER.info("Initializing user database with default users");
            
            // Create admin user
            String adminPassword = BCrypt.hashpw("admin123", BCrypt.gensalt());
            User adminUser = new User(
                "admin", 
                "admin@example.com", 
                adminPassword, 
                Arrays.asList(ROLE_ADMIN, ROLE_USER)
            );
            adminUser.persist();
            
            // Create regular user
            String userPassword = BCrypt.hashpw("user123", BCrypt.gensalt());
            User regularUser = new User(
                "user", 
                "user@example.com", 
                userPassword, 
                Arrays.asList(ROLE_USER)
            );
            regularUser.persist();
            
            LOGGER.info("Default users created successfully");
        }
    }
}
