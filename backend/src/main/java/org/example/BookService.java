package org.example;

import io.quarkus.runtime.StartupEvent;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.enterprise.event.Observes;
import jakarta.ws.rs.NotFoundException;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import org.bson.types.ObjectId;
import org.jboss.logging.Logger;

/**
 * Service class for book-related business logic
 * Handles database operations and application initialization
 */
@ApplicationScoped
public class BookService {
    
    private static final Logger LOGGER = Logger.getLogger(BookService.class);

    /**
     * Initialize the database with sample books if none exist
     * This method runs on application startup
     */
    void onStart(@Observes StartupEvent ev) {
        if (Book.count() == 0) {
            LOGGER.info("Initializing book database with sample data");
            
            // Add sample books to MongoDB
            Book.persist(
                new Book(
                    "The Great Gatsby", 
                    "F. Scott Fitzgerald", 
                    "The story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.",
                    new BigDecimal("12.99"),
                    50,
                    "9780743273565",
                    LocalDate.of(1925, 4, 10),
                    "Scribner",
                    "Fiction",
                    "https://example.com/images/great-gatsby.jpg"
                ),
                    
                new Book(
                    "To Kill a Mockingbird", 
                    "Harper Lee", 
                    "The story of Scout Finch and her father Atticus defending Tom Robinson.",
                    new BigDecimal("14.95"),
                    75,
                    "9780061120084",
                    LocalDate.of(1960, 7, 11),
                    "Harper Perennial",
                    "Fiction",
                    "https://example.com/images/to-kill-mockingbird.jpg"
                ),
                    
                new Book(
                    "1984", 
                    "George Orwell", 
                    "A dystopian social science fiction novel set in a totalitarian future society.",
                    new BigDecimal("10.99"),
                    25,
                    "9780451524935",
                    LocalDate.of(1949, 6, 8),
                    "Signet Classic",
                    "Science Fiction",
                    "https://example.com/images/1984.jpg"
                ),
                
                new Book(
                    "The Hobbit", 
                    "J.R.R. Tolkien", 
                    "The tale of Bilbo Baggins, a hobbit who embarks on an unexpected journey.",
                    new BigDecimal("15.99"),
                    30,
                    "9780547928227",
                    LocalDate.of(1937, 9, 21),
                    "Houghton Mifflin Harcourt",
                    "Fantasy",
                    "https://example.com/images/hobbit.jpg"
                ),
                
                new Book(
                    "Pride and Prejudice", 
                    "Jane Austen", 
                    "The story of Elizabeth Bennet and her tumultuous relationship with Mr. Darcy.",
                    new BigDecimal("9.99"),
                    45,
                    "9780141439518",
                    LocalDate.of(1813, 1, 28),
                    "Penguin Classics",
                    "Romance",
                    "https://example.com/images/pride-prejudice.jpg"
                )
            );
            
            LOGGER.info("Database initialization complete. Added " + Book.count() + " books.");
        }
    }

    /**
     * Retrieve all books from the database
     * @return List of all books
     */
    public List<Book> getAllBooks() {
        LOGGER.debug("Fetching all books");
        return Book.listAll();
    }

    /**
     * Retrieve a specific book by ID
     * @param id The book's ID
     * @return The book if found, null otherwise
     */
    public Book getBookById(String id) {
        LOGGER.debugf("Fetching book with ID: %s", id);
        return Book.findById(new ObjectId(id));
    }
    
    /**
     * Add a new book to the database
     * @param book The book to add
     * @return The added book with generated ID
     */
    public Book addBook(Book book) {
        LOGGER.debugf("Adding new book: %s by %s", book.getTitle(), book.getAuthor());
        book.persist();
        return book;
    }
    
    /**
     * Update an existing book
     * @param id The book's ID
     * @param book The updated book data
     * @return The updated book
     * @throws NotFoundException if the book is not found
     */
    public Book updateBook(String id, Book book) {
        LOGGER.debugf("Updating book with ID: %s", id);
        Book existingBook = Book.findById(new ObjectId(id));
        if (existingBook == null) {
            throw new NotFoundException("Book with ID " + id + " not found");
        }
        
        existingBook.setTitle(book.getTitle());
        existingBook.setAuthor(book.getAuthor());
        existingBook.setDescription(book.getDescription());
        existingBook.setPrice(book.getPrice());
        existingBook.setQuantity(book.getQuantity());
        existingBook.setIsbn(book.getIsbn());
        existingBook.setPublishedDate(book.getPublishedDate());
        existingBook.setPublisher(book.getPublisher());
        existingBook.setCategory(book.getCategory());
        existingBook.setImageUrl(book.getImageUrl());
        
        existingBook.update();
        return existingBook;
    }
    
    /**
     * Delete a book by ID
     * @param id The book's ID
     * @return true if the book was deleted, false if it wasn't found
     */
    public boolean deleteBook(String id) {
        LOGGER.debugf("Deleting book with ID: %s", id);
        return Book.deleteById(new ObjectId(id));
    }
}
