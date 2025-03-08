package org.example;

import io.quarkus.runtime.StartupEvent;
import jakarta.annotation.security.PermitAll;
import jakarta.enterprise.event.Observes;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.example.dto.LoginRequest;
import org.example.dto.SignupRequest;
import org.jboss.logging.Logger;

/**
 * REST API endpoints for user authentication operations
 */
@Path("/api/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthResource {
    
    private static final Logger LOGGER = Logger.getLogger(AuthResource.class);
    
    @Inject
    AuthService authService;
    
    /**
     * Initialize default users on application startup
     */
    void onStart(@Observes StartupEvent ev) {
        LOGGER.info("Initializing user authentication system");
        authService.initializeUsers();
    }
    
    /**
     * Endpoint for user registration
     * 
     * @param request User signup request
     * @return HTTP response with auth token or error
     */
    @POST
    @Path("/signup")
    @PermitAll
    public Response registerUser(@Valid SignupRequest request) {
        LOGGER.info("New user signup request received");
        return authService.register(request);
    }
    
    /**
     * Endpoint for user login
     * 
     * @param request User login request
     * @return HTTP response with auth token or error
     */
    @POST
    @Path("/login")
    @PermitAll
    public Response loginUser(@Valid LoginRequest request) {
        LOGGER.info("User login request received");
        return authService.login(request);
    }
    
    /**
     * Test endpoint to verify user is authenticated as admin
     */
    @GET
    @Path("/admin")
    @jakarta.annotation.security.RolesAllowed("ADMIN")
    public Response adminEndpoint() {
        return Response.ok("{\"message\": \"Admin access confirmed\"}").build();
    }
    
    /**
     * Test endpoint to verify user is authenticated
     */
    @GET
    @Path("/user")
    @jakarta.annotation.security.RolesAllowed("USER")
    public Response userEndpoint() {
        return Response.ok("{\"message\": \"User access confirmed\"}").build();
    }
}
