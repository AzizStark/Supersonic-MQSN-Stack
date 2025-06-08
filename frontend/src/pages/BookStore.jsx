import { createSignal, createEffect, onMount } from "solid-js";
import { createStore } from "solid-js/store";

/**
 * BookStore component for displaying books available for purchase
 * Allows users to browse and add books to their cart
 */
export default function BookStore() {
  const [books, setBooks] = createSignal([]);
  const [filteredBooks, setFilteredBooks] = createSignal([]);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal(null);
  const [searchTerm, setSearchTerm] = createSignal("");
  const [selectedCategory, setSelectedCategory] = createSignal("");
  const [categories, setCategories] = createSignal([]);

  // Load books on component mount
  onMount(async () => {
    await fetchBooks();
  });

  // Fetch all books from API
  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("http://localhost:8081/api/books");
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();
      setBooks(data);

      // Extract unique categories
      const uniqueCategories = [
        ...new Set(data.map((book) => book.category).filter(Boolean)),
      ];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error("Error fetching books:", err);
      setError(err.message || "Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  // Filter books based on search term and category
  createEffect(() => {
    let result = books();

    // Filter by search term
    if (searchTerm()) {
      const term = searchTerm().toLowerCase();
      result = result.filter(
        (book) =>
          book.title?.toLowerCase().includes(term) ||
          book.author?.toLowerCase().includes(term) ||
          book.description?.toLowerCase().includes(term)
      );
    }

    // Filter by category
    if (selectedCategory()) {
      result = result.filter((book) => book.category === selectedCategory());
    }

    setFilteredBooks(result);
  });

  // Add to cart function
  const addToCart = (book) => {
    // Retrieve current cart from localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Check if book is already in cart
    const existingItem = cart.find((item) => item.id === book.id);

    if (existingItem) {
      // Update quantity if already in cart
      existingItem.quantity += 1;
    } else {
      // Add new item with quantity 1
      cart.push({
        ...book,
        quantity: 1,
      });
    }

    // Save updated cart back to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));

    // Show success message
    alert(`"${book.title}" added to your collection!`);
  };

  return (
    <div class="book-store">
      <h1>Quintessa Literary Collection</h1>
      <p style={"color: #fff"}>
        Browse our curated selection of literary treasures.
      </p>

      {/* Search and filter controls */}
      <div class="filters">
        <div class="search-box">
          <input
            type="text"
            placeholder="Search our literary catalogue..."
            value={searchTerm()}
            onInput={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div class="category-filter">
          <select
            value={selectedCategory()}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All Categories</option>
            {categories().map((category) => (
              <option value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Error message */}
      {error() && <div class="error-message">Error: {error()}</div>}

      {/* Books grid */}
      <div class="books-container">
        {loading() && <p class="loading-message">Loading books...</p>}

        {!loading() && filteredBooks().length === 0 && (
          <p class="no-results">No books found. Try a different search.</p>
        )}

        <div class="books-grid">
          {filteredBooks().map((book) => (
            <div class="book-card">
              <div class="book-cover">
                {book.imageUrl ? (
                  <img src={book.imageUrl} alt={book.title} />
                ) : (
                  <div class="placeholder-cover">
                    <span>{book.title.substring(0, 2)}</span>
                  </div>
                )}
              </div>

              <div class="book-details">
                <h3 class="book-title">{book.title}</h3>
                <p class="book-author">by {book.author}</p>
                <p class="book-price">${book.price.toFixed(2)}</p>

                <div class="book-actions">
                  <button
                    onClick={() => addToCart(book)}
                    disabled={book.quantity <= 0}
                  >
                    {book.quantity > 0 ? "Add to Cart" : "Out of Stock"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
