import { createSignal, onMount } from 'solid-js';
import { createStore } from 'solid-js/store';
import authStore from '../store/authStore';

/**
 * Book Management component for admin dashboard
 * Allows administrators to add, edit, and delete books
 */
export default function BookManagement() {
  const [books, setBooks] = createSignal([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal(null);
  const [successMessage, setSuccessMessage] = createSignal(null);
  const [isEditing, setIsEditing] = createSignal(false);
  const [editingBookId, setEditingBookId] = createSignal(null);
  
  // Initial book form state
  const initialBookState = {
    title: '',
    author: '',
    description: '',
    price: '',
    quantity: '',
    isbn: '',
    publishedDate: '',
    publisher: '',
    category: '',
    imageUrl: ''
  };
  
  // Form state for adding/editing books
  const [bookForm, setBookForm] = createStore({...initialBookState});
  
  // Available book categories
  const categories = [
    'Fiction', 
    'Non-Fiction', 
    'Science Fiction', 
    'Fantasy', 
    'Mystery', 
    'Thriller', 
    'Romance', 
    'Biography',
    'History',
    'Self-Help',
    'Children',
    'Poetry',
    'Educational'
  ];
  
  // Load books on component mount
  onMount(async () => {
    await fetchBooks();
  });
  
  // Fetch all books from API
  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('http://localhost:8081/api/books');
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      setBooks(data);
    } catch (err) {
      console.error('Error fetching books:', err);
      setError(err.message || 'Failed to fetch books');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookForm({ [name]: value });
  };
  
  // Reset form to initial state and cancel editing
  const resetForm = () => {
    setBookForm({...initialBookState});
    setIsEditing(false);
    setEditingBookId(null);
  };
  
  // Load book data into form for editing
  const startEditingBook = (book) => {
    // Format the date properly for the input field if it exists
    let formattedDate = '';
    if (book.publishedDate) {
      // If it's a full ISO date string, extract just the YYYY-MM-DD part
      if (book.publishedDate.includes('T')) {
        formattedDate = book.publishedDate.split('T')[0];
      } else {
        formattedDate = book.publishedDate;
      }
    }
    
    setBookForm({
      title: book.title || '',
      author: book.author || '',
      description: book.description || '',
      price: book.price?.toString() || '',
      quantity: book.quantity?.toString() || '',
      isbn: book.isbn || '',
      publishedDate: formattedDate,
      publisher: book.publisher || '',
      category: book.category || '',
      imageUrl: book.imageUrl || ''
    });
    
    setIsEditing(true);
    setEditingBookId(book.id);
    
    // Scroll to the form
    document.querySelector('.add-book-panel')?.scrollIntoView({ behavior: 'smooth' });
  };
  
  // Handle form submission to add or update a book
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      // Prepare book data for API
      const bookData = {
        ...bookForm,
        price: parseFloat(bookForm.price),
        quantity: parseInt(bookForm.quantity, 10),
        // Only include date if provided
        publishedDate: bookForm.publishedDate ? bookForm.publishedDate : null
      };
      
      let response;
      
      // If editing, send PUT request to update existing book
      if (isEditing()) {
        response = await fetch(`http://localhost:8081/api/books/${editingBookId()}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authStore.token()}`
          },
          body: JSON.stringify(bookData)
        });
        
        if (response.ok) {
          setSuccessMessage(`Book "${bookData.title}" updated successfully!`);
        }
      } 
      // Otherwise, send POST request to add new book
      else {
        response = await fetch('http://localhost:8081/api/books', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${authStore.token()}`
          },
          body: JSON.stringify(bookData)
        });
        
        if (response.ok) {
          setSuccessMessage(`Book "${bookData.title}" added successfully!`);
        }
      }
      
      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          throw new Error(errorData.error || `Error: ${response.status}`);
        } else {
          throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
      }
      
      // Check if the response has content
      const contentType = response.headers.get("content-type");
      let addedBook;
      
      if (contentType && contentType.includes("application/json")) {
        try {
          addedBook = await response.json();
        } catch (err) {
          console.warn("Could not parse response as JSON, using form data instead");
          addedBook = { ...bookData, id: `temp-${Date.now()}` };
        }
      } else {
        // If no JSON response, use the submitted form data and fetch latest books
        addedBook = { ...bookData, id: `temp-${Date.now()}` };
      }
      
      // Refresh books list to get the latest data
      await fetchBooks();
      
      setSuccessMessage(`Book "${bookData.title}" added successfully!`);
      resetForm();
    } catch (err) {
      console.error('Error adding book:', err);
      setError(err.message || 'Failed to add book');
    } finally {
      setLoading(false);
    }
  };
  
  // Handle book deletion
  const handleDeleteBook = async (id, title) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setSuccessMessage(null);
      
      const response = await fetch(`http://localhost:8081/api/books/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${authStore.token()}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      // Remove deleted book from list
      setBooks(books().filter(book => book.id !== id));
      setSuccessMessage(`Book "${title}" deleted successfully!`);
    } catch (err) {
      console.error('Error deleting book:', err);
      setError(err.message || 'Failed to delete book');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div class="book-management">
      <h2 class="artisan-title">Book Management</h2>
      <p class="artisan-subtitle">Curate your collection of literary treasures</p>
      
      {/* Success message */}
      {successMessage() && (
        <div class="success-message">
          <span class="success-icon">✓</span> {successMessage()}
        </div>
      )}
      
      {/* Error message */}
      {error() && (
        <div class="error-message">
          <span class="error-icon">!</span> Error: {error()}
        </div>
      )}
      
      {/* Add/Edit Book Form */}
      <div class="add-book-panel artisan-panel">
        <h3 class="panel-title">{isEditing() ? 'Edit Book' : 'Add New Book'}</h3>
        <p class="panel-description">
          {isEditing() 
            ? 'Update the details of this literary work in your collection.' 
            : 'Enter the details of the literary work you wish to add to your collection.'}
        </p>
        <form onSubmit={handleSubmit} class="book-form">
          <div class="form-row">
            <div class="form-group">
              <label for="title">Title*</label>
              <input 
                type="text" 
                id="title" 
                name="title" 
                value={bookForm.title} 
                onInput={handleInputChange} 
                required 
              />
            </div>
            
            <div class="form-group">
              <label for="author">Author*</label>
              <input 
                type="text" 
                id="author" 
                name="author" 
                value={bookForm.author} 
                onInput={handleInputChange} 
                required 
              />
            </div>
          </div>
          
          <div class="form-group">
            <label for="description">Description</label>
            <textarea 
              id="description" 
              name="description" 
              value={bookForm.description} 
              onInput={handleInputChange}
              rows="3"
            />
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="price">Price*</label>
              <input 
                type="number" 
                id="price" 
                name="price" 
                min="0.01" 
                step="0.01" 
                value={bookForm.price} 
                onInput={handleInputChange} 
                required 
              />
            </div>
            
            <div class="form-group">
              <label for="quantity">Quantity*</label>
              <input 
                type="number" 
                id="quantity" 
                name="quantity" 
                min="0" 
                value={bookForm.quantity} 
                onInput={handleInputChange} 
                required 
              />
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="isbn">ISBN</label>
              <input 
                type="text" 
                id="isbn" 
                name="isbn" 
                value={bookForm.isbn} 
                onInput={handleInputChange} 
              />
            </div>
            
            <div class="form-group">
              <label for="publishedDate">Publication Date</label>
              <input 
                type="date" 
                id="publishedDate" 
                name="publishedDate" 
                value={bookForm.publishedDate} 
                onInput={handleInputChange} 
              />
            </div>
          </div>
          
          <div class="form-row">
            <div class="form-group">
              <label for="publisher">Publisher</label>
              <input 
                type="text" 
                id="publisher" 
                name="publisher" 
                value={bookForm.publisher} 
                onInput={handleInputChange} 
              />
            </div>
            
            <div class="form-group">
              <label for="category">Category</label>
              <select 
                id="category" 
                name="category" 
                value={bookForm.category} 
                onInput={handleInputChange}
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
          
          <div class="form-group">
            <label for="imageUrl">Cover Image URL</label>
            <input 
              type="url" 
              id="imageUrl" 
              name="imageUrl" 
              value={bookForm.imageUrl} 
              onInput={handleInputChange} 
              placeholder="https://example.com/images/book-cover.jpg" 
            />
          </div>
          
          <div class="form-buttons">
            <button type="button" onClick={resetForm} class="btn-secondary">
              {isEditing() ? 'Cancel' : 'Reset'}
            </button>
            <button type="submit" class="btn-primary" disabled={loading()}>
              {loading() 
                ? (isEditing() ? 'Updating...' : 'Adding...') 
                : (isEditing() ? 'Update Book' : 'Add Book')}
            </button>
          </div>
        </form>
      </div>
      
      {/* Books List */}
      <div class="books-list-panel artisan-panel">
        <h3 class="panel-title">Book Inventory</h3>
        <p class="panel-description">Browse and manage your collection of {books().length} literary works</p>
        
        {loading() && <p class="loading-message"><span class="loading-icon">⟳</span> Loading your collection...</p>}
        
        {!loading() && books().length === 0 && (
          <p class="empty-inventory">Your bookshelf awaits its first treasures. Begin your collection above.</p>
        )}
        
        {!loading() && books().length > 0 && (
          <table class="books-table artisan-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Category</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books().map(book => (
                <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.author}</td>
                  <td>${book.price.toFixed(2)}</td>
                  <td>{book.quantity}</td>
                  <td>{book.category || '-'}</td>
                  <td>
                    <button 
                      class="btn-small"
                      onClick={() => startEditingBook(book)}
                    >
                      Edit
                    </button>
                    <button 
                      class="btn-small btn-danger" 
                      onClick={() => handleDeleteBook(book.id, book.title)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
