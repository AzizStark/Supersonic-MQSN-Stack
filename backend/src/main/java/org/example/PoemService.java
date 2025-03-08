package org.example;

import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;

import java.util.List;
import org.jboss.logging.Logger;

/**
 * Service class for poem-related business logic
 * Handles database operations and application initialization
 */
@ApplicationScoped
public class PoemService {
    
    private static final Logger LOGGER = Logger.getLogger(PoemService.class);

    /**
     * Initialize the database with sample poems if none exist
     * This method runs on application startup
     */
    void onStart(@Observes StartupEvent ev) {
        if (Poem.count() == 0) {
            LOGGER.info("Initializing poem database with sample data");
            
            // Add sample poems to MongoDB
            Poem.persist(
                new Poem("Whispers of Dawn", "Autumn Breeze",
                    "Morning light filters through\n" +
                    "ancient oak branches,\n" +
                    "dewdrops on grass blades\n" +
                    "sing silent hymns to the sun.\n" +
                    "Earth awakens."),
                    
                new Poem("Mountain's Breath", "River Stone", 
                    "Granite peaks rise\n" +
                    "against azure skies.\n" +
                    "Time moves slowly here,\n" +
                    "where clouds become snow\n" +
                    "and snow becomes streams."),
                    
                new Poem("Seaside Reverie", "Coastal Wind", 
                    "Waves wash ashore,\n" +
                    "erasing yesterday's footprints.\n" +
                    "Salt-kissed air carries\n" +
                    "memories of distant shores.\n" +
                    "The tide returns, always."),
                    
                new Poem("Urban Whispers", "City Dweller", 
                    "Steel and glass towers\n" +
                    "reach for passing clouds.\n" +
                    "Below, a thousand stories\n" +
                    "unfold in synchrony.\n" +
                    "The city breathes."),
                    
                new Poem("Forest Secrets", "Woodland Echo", 
                    "Ancient trees hold counsel\n" +
                    "in verdant cathedral halls.\n" +
                    "Moss-covered stones remember\n" +
                    "what humanity forgets.\n" +
                    "Shadows dance with light.")
            );
            
            LOGGER.info("Database initialization complete. Added " + Poem.count() + " poems.");
        }
    }

    /**
     * Retrieve all poems from the database
     * @return List of all poems
     */
    public List<Poem> getAllPoems() {
        LOGGER.debug("Fetching all poems");
        return Poem.listAll();
    }

    /**
     * Retrieve a specific poem by ID
     * @param id The poem's ID
     * @return The poem if found, null otherwise
     */
    public Poem getPoemById(String id) {
        LOGGER.debugf("Fetching poem with ID: %s", id);
        return Poem.findById(id);
    }
}
