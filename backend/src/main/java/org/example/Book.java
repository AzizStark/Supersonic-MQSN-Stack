package org.example;

import io.quarkus.mongodb.panache.PanacheMongoEntity;
import io.quarkus.mongodb.panache.common.MongoEntity;
import org.bson.codecs.pojo.annotations.BsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import java.math.BigDecimal;
import java.time.LocalDate;

/**
 * Represents a book entity stored in MongoDB
 * This class uses Panache for simplified MongoDB operations
 */
@MongoEntity(collection = "books")
public class Book extends PanacheMongoEntity {
    
    @NotBlank
    @BsonProperty("title")
    private String title;
    
    @NotBlank
    @BsonProperty("author")
    private String author;
    
    @BsonProperty("description")
    private String description;
    
    @NotNull
    @Positive
    @BsonProperty("price")
    private BigDecimal price;
    
    @NotNull
    @PositiveOrZero
    @BsonProperty("quantity")
    private Integer quantity;
    
    @BsonProperty("isbn")
    private String isbn;
    
    @BsonProperty("publishedDate")
    private LocalDate publishedDate;
    
    @BsonProperty("publisher")
    private String publisher;
    
    @BsonProperty("category")
    private String category;
    
    @BsonProperty("imageUrl")
    private String imageUrl;

    /**
     * Default constructor required for MongoDB serialization
     */
    public Book() {
        // Default constructor required for MongoDB
    }

    /**
     * Creates a new book with the specified attributes
     *
     * @param title The book's title
     * @param author The book's author
     * @param description The book's description
     * @param price The book's price
     * @param quantity Available quantity
     * @param isbn ISBN number
     * @param publishedDate Publication date
     * @param publisher Publisher name
     * @param category Book category/genre
     * @param imageUrl URL to book cover image
     */
    public Book(String title, String author, String description, BigDecimal price, 
                Integer quantity, String isbn, LocalDate publishedDate, 
                String publisher, String category, String imageUrl) {
        this.title = title;
        this.author = author;
        this.description = description;
        this.price = price;
        this.quantity = quantity;
        this.isbn = isbn;
        this.publishedDate = publishedDate;
        this.publisher = publisher;
        this.category = category;
        this.imageUrl = imageUrl;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getIsbn() {
        return isbn;
    }

    public void setIsbn(String isbn) {
        this.isbn = isbn;
    }

    public LocalDate getPublishedDate() {
        return publishedDate;
    }

    public void setPublishedDate(LocalDate publishedDate) {
        this.publishedDate = publishedDate;
    }

    public String getPublisher() {
        return publisher;
    }

    public void setPublisher(String publisher) {
        this.publisher = publisher;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }
}
