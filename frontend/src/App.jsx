import { createSignal, onMount } from 'solid-js'
import './App.css'

/**
 * Main application component for displaying poems
 * Fetches poems from backend API and provides navigation between them
 */
function App() {
  const [poems, setPoems] = createSignal([]);
  const [currentPoemIndex, setCurrentPoemIndex] = createSignal(0);
  const [loading, setLoading] = createSignal(true);
  const [error, setError] = createSignal(null);
  
  // Fetch poems on component mount
  onMount(async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:8081/api/poems');
      if (!response.ok) {
        throw new Error(`Failed to fetch poems: ${response.status}`);
      }
      const data = await response.json();
      setPoems(data);
    } catch (err) {
      console.error('Error fetching poems:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  });
  
  // Navigation handlers
  const nextPoem = () => {
    if (poems().length > 0) {
      setCurrentPoemIndex(prev => (prev + 1) % poems().length);
    }
  };
  
  const prevPoem = () => {
    if (poems().length > 0) {
      setCurrentPoemIndex(prev => (prev - 1 + poems().length) % poems().length);
    }
  };
  
  // Helper function to render poem content with line breaks
  const renderPoemContent = (content) => {
    return content.split('\n').map((line, i) => (
      <p class="poem-line" key={i}>{line}</p>
    ));
  };
  
  return (
    <div class="poem-container">
      {loading() ? (
        <div class="loading">Loading poems...</div>
      ) : error() ? (
        <div class="error">
          <p>Error: {error()}</p>
          <p>Could not load poems from server.</p>
        </div>
      ) : poems().length === 0 ? (
        <div class="no-poems">No poems available.</div>
      ) : (
        <>
          <div class="poem-card">
            <h1 class="poem-title">{poems()[currentPoemIndex()].title}</h1>
            <div class="poem-content">
              {renderPoemContent(poems()[currentPoemIndex()].content)}
            </div>
            <p class="poem-author">— {poems()[currentPoemIndex()].author}</p>
          </div>
          
          <div class="poem-navigation">
            <button onClick={prevPoem} class="nav-button">Previous</button>
            <span class="poem-counter">{currentPoemIndex() + 1} / {poems().length}</span>
            <button onClick={nextPoem} class="nav-button">Next</button>
          </div>
        </>
      )}
    </div>
  )
}

export default App
