import { useCart } from "../context/CartContext";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .pc-card {
    background: #161616;
    display: flex;
    flex-direction: column;
    transition: background 0.3s ease;
    position: relative;
    overflow: hidden;
  }
  .pc-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0;
    width: 0; height: 1px;
    background: #c8a97e;
    transition: width 0.4s ease;
  }
  .pc-card:hover::before { width: 100%; }
  .pc-card:hover { background: #1a1a1a; }

  .pc-img-wrap {
    width: 100%;
    height: 220px;
    overflow: hidden;
    background: #111;
  }
  .pc-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s ease;
    display: block;
  }
  .pc-card:hover .pc-img { transform: scale(1.05); }

  .pc-body {
    padding: 20px 20px 24px;
    display: flex;
    flex-direction: column;
    flex: 1;
  }

  .pc-category {
    font-family: 'DM Sans', sans-serif;
    font-size: 9px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #555;
    margin-bottom: 8px;
  }

  .pc-name {
    font-family: 'DM Sans', sans-serif;
    font-size: 13px;
    color: #ccc;
    line-height: 1.55;
    flex: 1;
    margin-bottom: 12px;
    font-weight: 400;
  }

  .pc-price {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    color: #c8a97e;
    font-weight: 400;
    margin-bottom: 16px;
  }

  .pc-btn {
    padding: 11px;
    background: transparent;
    border: 1px solid #333;
    color: #888;
    font-family: 'DM Sans', sans-serif;
    font-size: 10px;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s ease;
    border-radius: 1px;
    width: 100%;
  }
  .pc-btn:hover {
    border-color: #c8a97e;
    color: #c8a97e;
    background: rgba(200,169,126,0.06);
  }
  .pc-btn.pop {
    transform: scale(0.96);
    border-color: #c8a97e;
    color: #c8a97e;
  }
`;

function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <>
      <style>{styles}</style>
      <div className="pc-card">
        <div className="pc-img-wrap">
          <img src={product.image} alt={product.name} className="pc-img" />
        </div>
        <div className="pc-body">
          {product.category && (
            <span className="pc-category">{product.category}</span>
          )}
          <p className="pc-name">{product.name}</p>
          <p className="pc-price">₹{product.price}</p>
          <button
            className="pc-btn"
            onClick={(e) => {
              addToCart(product);
              e.target.classList.add("pop");
              setTimeout(() => e.target.classList.remove("pop"), 300);
            }}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </>
  );
}

export default ProductCard;
