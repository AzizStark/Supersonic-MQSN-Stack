package org.example;

import io.quarkus.mongodb.panache.PanacheMongoEntity;
import io.quarkus.mongodb.panache.common.MongoEntity;
import org.bson.codecs.pojo.annotations.BsonProperty;
import jakarta.validation.constraints.NotBlank;

/**
 * Represents a poem entity stored in MongoDB
 * This class uses Panache for simplified MongoDB operations
 */
@MongoEntity(collection = "poems")
public class Poem extends PanacheMongoEntity {
    
    @NotBlank
    @BsonProperty("title")
    private String title;
    
    @NotBlank
    @BsonProperty("author")
    private String author;
    
    @NotBlank
    @BsonProperty("content")
    private String content;

    /**
     * Default constructor required for MongoDB serialization
     */
    public Poem() {
        // Default constructor required for MongoDB
    }

    /**
     * Creates a new poem with the specified attributes
     *
     * @param title   The poem's title
     * @param author  The poem's author
     * @param content The poem's content text
     */
    public Poem(String title, String author, String content) {
        this.title = title;
        this.author = author;
        this.content = content;
    }

    /**
     * Gets the poem's title
     * @return The title
     */
    public String getTitle() {
        return title;
    }

    /**
     * Sets the poem's title
     * @param title The title to set
     */
    public void setTitle(String title) {
        this.title = title;
    }

    /**
     * Gets the poem's author
     * @return The author
     */
    public String getAuthor() {
        return author;
    }

    /**
     * Sets the poem's author
     * @param author The author to set
     */
    public void setAuthor(String author) {
        this.author = author;
    }

    /**
     * Gets the poem's content text
     * @return The content
     */
    public String getContent() {
        return content;
    }

    /**
     * Sets the poem's content text
     * @param content The content to set
     */
    public void setContent(String content) {
        this.content = content;
    }
}
