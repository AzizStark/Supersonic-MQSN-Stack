import { createSignal, onMount, createEffect } from 'solid-js';
import authStore from '../store/authStore';

/**
 * Shopping Cart component for displaying and managing items in the user's cart
 */
export default function ShoppingCart() {
  const [cartItems, setCartItems] = createSignal([]);
  const [totalPrice, setTotalPrice] = createSignal(0);
  
  // Load cart from localStorage on component mount
  onMount(() => {
    loadCart();
  });
  
  // Recalculate total price when cart changes
  createEffect(() => {
    calculateTotal();
  });
  
  // Load cart from localStorage
  const loadCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    setCartItems(cart);
  };
  
  // Save cart to localStorage
  const saveCart = (items) => {
    localStorage.setItem('cart', JSON.stringify(items));
    setCartItems(items);
  };
  
  // Calculate total price of all items in cart
  const calculateTotal = () => {
    const total = cartItems().reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
    setTotalPrice(total);
  };
  
  // Update item quantity
  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cartItems().map(item => {
      if (item.id === id) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    
    saveCart(updatedCart);
  };
  
  // Remove item from cart
  const removeItem = (id) => {
    const updatedCart = cartItems().filter(item => item.id !== id);
    saveCart(updatedCart);
  };
  
  // Clear entire cart
  const clearCart = () => {
    if (confirm('Are you sure you want to clear your cart?')) {
      saveCart([]);
    }
  };
  
  // Proceed to checkout
  const checkout = () => {
    if (!authStore.isAuthenticated) {
      if (confirm('You need to be logged in to checkout. Go to login page?')) {
        // We'll let the parent component handle navigation via the onLogin callback
        return true;
      }
      return false;
    }
    
    // Mock checkout process
    alert('Order placed successfully! (This is a demo)');
    saveCart([]);
    return true;
  };
  
  return (
    <div class="shopping-cart">
      <h1>Your Shopping Cart</h1>
      
      {cartItems().length === 0 ? (
        <div class="empty-cart">
          <p>Your cart is empty.</p>
          <a href="#" class="btn-primary">Continue Shopping</a>
        </div>
      ) : (
        <div class="cart-content">
          <table class="cart-table">
            <thead>
              <tr>
                <th>Book</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Subtotal</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cartItems().map(item => (
                <tr key={item.id}>
                  <td class="cart-item-info">
                    <div class="item-image">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.title} />
                      ) : (
                        <div class="placeholder-cover">
                          <span>{item.title.substring(0, 2)}</span>
                        </div>
                      )}
                    </div>
                    <div class="item-details">
                      <h3>{item.title}</h3>
                      <p>by {item.author}</p>
                    </div>
                  </td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>
                    <div class="quantity-controls">
                        <button 
                            class="btn-quantity"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                        >−</button>
                        <span>{item.quantity}</span>
                        <button 
                            class="btn-quantity"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >+</button>
                    </div>
                  </td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button 
                      class="btn-remove" 
                      onClick={() => removeItem(item.id)}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="3" class="total-label">Total</td>
                <td class="total-price">${totalPrice().toFixed(2)}</td>
                <td></td>
              </tr>
            </tfoot>
          </table>
          
          <div class="cart-actions">
            <button class="btn-secondary" onClick={clearCart}>
              Clear Cart
            </button>
            <button class="btn-primary" onClick={checkout}>
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
