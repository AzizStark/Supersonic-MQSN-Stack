package org.example.dto;

import java.util.List;

/**
 * Data Transfer Object for authentication responses
 * Contains JWT token and user information
 */
public class AuthResponse {
    
    private String token;
    private String username;
    private List<String> roles;
    private String message;

    // Default constructor
    public AuthResponse() {
    }
    
    // Constructor with all fields
    public AuthResponse(String token, String username, List<String> roles, String message) {
        this.token = token;
        this.username = username;
        this.roles = roles;
        this.message = message;
    }

    // Getters and setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}
