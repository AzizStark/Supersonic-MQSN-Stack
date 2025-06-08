package org.example;

import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.Response.Status;

import java.net.URI;
import java.util.List;
import org.jboss.logging.Logger;

/**
 * REST API endpoints for book operations
 * Provides endpoints for managing books in the bookshop
 */
@Path("/api/books")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class BookResource {
    
    private static final Logger LOGGER = Logger.getLogger(BookResource.class);
    
    @Inject
    BookService bookService;
    
    /**
     * Retrieves all books
     * @return HTTP response with list of books
     */
    @GET
    @PermitAll
    public Response getAllBooks() {
        LOGGER.info("GET request received for all books");
        List<Book> books = bookService.getAllBooks();
        LOGGER.debug("Returning " + books.size() + " books");
        return Response.ok(books).build();
    }
    
    /**
     * Retrieves a specific book by ID
     * @param id The book's ID
     * @return HTTP response with the book or 404 if not found
     */
    @GET
    @Path("/{id}")
    @PermitAll
    public Response getBookById(@PathParam("id") String id) {
        LOGGER.infof("GET request received for book with ID: %s", id);
        Book book = bookService.getBookById(id);
            
        if (book != null) {
            LOGGER.debug("Book found, returning data");
            return Response.ok(book).build();
        } else {
            LOGGER.infof("Book with ID %s not found", id);
            return Response.status(Status.NOT_FOUND)
                .entity("{\"error\": \"Book not found\"}")
                .build();
        }
    }
    
    /**
     * Adds a new book to the inventory
     * @param book The book to add
     * @return HTTP response with the added book and location header
     */
    @POST
    @RolesAllowed("ADMIN")
    public Response addBook(@Valid Book book) {
        LOGGER.infof("POST request received to add book: %s", book.getTitle());
        Book addedBook = bookService.addBook(book);
        
        return Response
            .created(URI.create("/api/books/" + addedBook.id))
            .entity(addedBook)
            .build();
    }
    
    /**
     * Updates an existing book
     * @param id The book's ID
     * @param book The updated book data
     * @return HTTP response with the updated book
     */
    @PUT
    @Path("/{id}")
    @RolesAllowed("ADMIN")
    public Response updateBook(@PathParam("id") String id, @Valid Book book) {
        LOGGER.infof("PUT request received to update book with ID: %s", id);
        try {
            Book updatedBook = bookService.updateBook(id, book);
            return Response.ok(updatedBook).build();
        } catch (NotFoundException e) {
            LOGGER.infof("Book with ID %s not found for update", id);
            return Response.status(Status.NOT_FOUND)
                .entity("{\"error\": \"" + e.getMessage() + "\"}")
                .build();
        }
    }
    
    /**
     * Deletes a book from inventory
     * @param id The book's ID
     * @return HTTP response with success or not found status
     */
    @DELETE
    @Path("/{id}")
    @RolesAllowed("ADMIN")
    public Response deleteBook(@PathParam("id") String id) {
        LOGGER.infof("DELETE request received for book with ID: %s", id);
        boolean deleted = bookService.deleteBook(id);
        
        if (deleted) {
            LOGGER.debug("Book deleted successfully");
            return Response.noContent().build();
        } else {
            LOGGER.infof("Book with ID %s not found for deletion", id);
            return Response.status(Status.NOT_FOUND)
                .entity("{\"error\": \"Book not found\"}")
                .build();
        }
    }
}
