package org.example;

import io.quarkus.mongodb.panache.PanacheMongoEntity;
import io.quarkus.mongodb.panache.common.MongoEntity;
import org.bson.codecs.pojo.annotations.BsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;

import java.util.ArrayList;
import java.util.List;

/**
 * Represents a user entity stored in MongoDB
 * This class uses Panache for simplified MongoDB operations
 */
@MongoEntity(collection = "users")
public class User extends PanacheMongoEntity {
    
    @NotBlank
    @BsonProperty("username")
    private String username;
    
    @NotBlank
    @Email
    @BsonProperty("email")
    private String email;
    
    @NotBlank
    @BsonProperty("password") 
    private String password; // Will store hashed passwords
    
    @BsonProperty("roles")
    private List<String> roles = new ArrayList<>();

    /**
     * Default constructor required for MongoDB serialization
     */
    public User() {
        // Default constructor required for MongoDB
    }

    /**
     * Creates a new user with the specified attributes
     *
     * @param username The user's username
     * @param email    The user's email
     * @param password The user's hashed password
     * @param roles    The user's roles (ADMIN, USER)
     */
    public User(String username, String email, String password, List<String> roles) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.roles = roles;
    }

    // Getters and setters
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }
    
    /**
     * Finds a user by username
     * 
     * @param username The username to search for
     * @return The user if found, null otherwise
     */
    public static User findByUsername(String username) {
        return find("username", username).firstResult();
    }
    
    /**
     * Finds a user by email
     * 
     * @param email The email to search for
     * @return The user if found, null otherwise
     */
    public static User findByEmail(String email) {
        return find("email", email).firstResult();
    }
    
    /**
     * Checks if the user has a specific role
     * 
     * @param role The role to check
     * @return true if the user has the role, false otherwise
     */
    public boolean hasRole(String role) {
        return roles != null && roles.contains(role);
    }
}
