import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400;500&display=swap');

  .cart-page {
    min-height: 100vh;
    background: #0e0e0e;
    padding: 108px 6vw 80px;
    font-family: 'DM Sans', sans-serif;
    color: #f0ece4;
  }

  .cart-tag {
    font-size: 10px;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: #c8a97e;
    display: block;
    margin-bottom: 12px;
  }

  .cart-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(32px, 4vw, 52px);
    font-weight: 300;
    color: #f0ece4;
    margin-bottom: 52px;
  }

  .cart-title::after {
    content: '';
    display: block;
    width: 40px;
    height: 1px;
    background: #c8a97e;
    margin-top: 16px;
  }

  .cart-empty {
    text-align: center;
    padding: 100px 20px;
    border: 1px solid #2a2a2a;
    background: #161616;
  }

  .cart-empty-icon {
    font-size: 36px;
    margin-bottom: 16px;
    opacity: 0.3;
  }

  .cart-empty p {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-style: italic;
    color: #444;
  }

  .cart-layout {
    display: grid;
    grid-template-columns: 1fr 340px;
    gap: 2px;
    align-items: start;
  }

  @media (max-width: 800px) {
    .cart-layout { grid-template-columns: 1fr; }
  }

  /* Items list */
  .cart-items {
    border: 1px solid #2a2a2a;
    background: #2a2a2a;
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .cart-item {
    background: #161616;
    padding: 24px 28px;
    display: grid;
    grid-template-columns: 80px 1fr auto;
    gap: 20px;
    align-items: center;
    transition: background 0.2s ease;
  }

  .cart-item:hover { background: #1a1a1a; }

  .cart-item-img {
    width: 80px;
    height: 80px;
    object-fit: cover;
    display: block;
  }

  .cart-item-info {}

  .cart-item-name {
    font-size: 13px;
    color: #ccc;
    margin-bottom: 6px;
    line-height: 1.5;
  }

  .cart-item-price {
    font-family: 'Cormorant Garamond', serif;
    font-size: 18px;
    color: #c8a97e;
  }

  .cart-item-controls {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 12px;
  }

  .qty-row {
    display: flex;
    align-items: center;
    gap: 0;
    border: 1px solid #2a2a2a;
  }

  .qty-btn {
    width: 32px;
    height: 32px;
    background: #111;
    border: none;
    color: #888;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
  }

  .qty-btn:hover { background: #1e1e1e; color: #c8a97e; }

  .qty-val {
    width: 36px;
    text-align: center;
    font-size: 13px;
    color: #ccc;
    background: #161616;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-left: 1px solid #2a2a2a;
    border-right: 1px solid #2a2a2a;
  }

  .remove-btn {
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #444;
    background: none;
    border: none;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: color 0.2s ease;
    padding: 0;
  }

  .remove-btn:hover { color: #888; }

  /* Summary panel */
  .cart-summary {
    background: #161616;
    border: 1px solid #2a2a2a;
    padding: 36px 32px;
    position: sticky;
    top: 88px;
  }

  .summary-title {
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #666;
    margin-bottom: 28px;
  }

  .summary-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    font-size: 13px;
    color: #666;
  }

  .summary-divider {
    height: 1px;
    background: #2a2a2a;
    margin: 20px 0;
  }

  .summary-total {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-bottom: 32px;
  }

  .summary-total span:first-child {
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #888;
  }

  .summary-total span:last-child {
    font-family: 'Cormorant Garamond', serif;
    font-size: 32px;
    font-weight: 300;
    color: #c8a97e;
  }

  .checkout-btn {
    width: 100%;
    padding: 17px;
    background: #c8a97e;
    color: #0e0e0e;
    border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    letter-spacing: 3px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 500;
  }

  .checkout-btn:hover {
    background: #d4b98a;
    transform: translateY(-1px);
  }
`;

function Cart() {
  const { cart, removeFromCart, increaseQty, decreaseQty } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);
  const itemCount = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <>
      <style>{styles}</style>
      <div className="cart-page">
        <span className="cart-tag">Your Selection</span>
        <h1 className="cart-title">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="cart-empty">
            <div className="cart-empty-icon">✦</div>
            <p>Your cart is empty</p>
          </div>
        ) : (
          <div className="cart-layout">
            {/* Items */}
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item._id} className="cart-item">
                  <img src={item.image} alt={item.name} className="cart-item-img" />

                  <div className="cart-item-info">
                    <p className="cart-item-name">{item.name}</p>
                    <p className="cart-item-price">₹{item.price}</p>
                  </div>

                  <div className="cart-item-controls">
                    <div className="qty-row">
                      <button className="qty-btn" onClick={() => decreaseQty(item._id)}>−</button>
                      <span className="qty-val">{item.qty}</span>
                      <button className="qty-btn" onClick={() => increaseQty(item._id)}>+</button>
                    </div>
                    <button className="remove-btn" onClick={() => removeFromCart(item._id)}>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary */}
            <div className="cart-summary">
              <p className="summary-title">Order Summary</p>
              <div className="summary-row">
                <span>Items ({itemCount})</span>
                <span>₹{total}</span>
              </div>
              <div className="summary-row">
                <span>Shipping</span>
                <span style={{ color: "#c8a97e" }}>Free</span>
              </div>
              <div className="summary-divider" />
              <div className="summary-total">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
              <button className="checkout-btn" onClick={() => navigate("/checkout")}>
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Cart;
