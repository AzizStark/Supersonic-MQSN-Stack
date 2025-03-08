package org.example;

import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.util.List;
import org.jboss.logging.Logger;

/**
 * REST API endpoints for poem operations
 * Provides endpoints for retrieving poems
 */
@Path("/api/poems")
@Produces(MediaType.APPLICATION_JSON)
public class PoemResource {
    
    private static final Logger LOGGER = Logger.getLogger(PoemResource.class);
    
    @Inject
    PoemService poemService;
    
    /**
     * Retrieves all poems
     * @return HTTP response with list of poems
     */
    @GET
    public Response getAllPoems() {
        LOGGER.info("GET request received for all poems");
        List<Poem> poems = poemService.getAllPoems();
        LOGGER.debug("Returning " + poems.size() + " poems");
        return Response.ok(poems).build();
    }
    
    /**
     * Retrieves a specific poem by ID
     * @param id The poem's ID
     * @return HTTP response with the poem or 404 if not found
     */
    @GET
    @Path("/{id}")
    public Response getPoemById(@PathParam("id") String id) {
        LOGGER.infof("GET request received for poem with ID: %s", id);
        Poem poem = poemService.getPoemById(id);
            
        if (poem != null) {
            LOGGER.debug("Poem found, returning data");
            return Response.ok(poem).build();
        } else {
            LOGGER.infof("Poem with ID %s not found", id);
            return Response.status(Response.Status.NOT_FOUND)
                .entity("{\"error\": \"Poem not found\"}")
                .build();
        }
    }
}
