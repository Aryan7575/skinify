import { useEffect, useState } from "react";
import axios from "../api/axios";
import ProductCard from "../components/ProductCard";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400;500&display=swap');

  .products-page {
    min-height: 100vh;
    background: #0e0e0e;
    padding: 108px 6vw 80px;
    font-family: 'DM Sans', sans-serif;
    color: #f0ece4;
  }

  .products-header {
    margin-bottom: 52px;
  }

  .products-tag {
    font-size: 10px;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: #c8a97e;
    display: block;
    margin-bottom: 12px;
  }

  .products-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(32px, 4vw, 52px);
    font-weight: 300;
    color: #f0ece4;
    line-height: 1.1;
  }

  .products-title::after {
    content: '';
    display: block;
    width: 40px;
    height: 1px;
    background: #c8a97e;
    margin-top: 16px;
  }

  /* Category tabs */
  .cat-tabs {
    display: flex;
    gap: 0;
    margin-bottom: 48px;
    border-bottom: 1px solid #2a2a2a;
    overflow-x: auto;
  }

  .cat-tab {
    padding: 14px 28px;
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #555;
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    font-family: 'DM Sans', sans-serif;
    transition: all 0.25s ease;
    white-space: nowrap;
    margin-bottom: -1px;
  }

  .cat-tab:hover { color: #888; }

  .cat-tab.active {
    color: #c8a97e;
    border-bottom-color: #c8a97e;
  }

  /* Grid */
  .products-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 1px;
    background: #2a2a2a;
    border: 1px solid #2a2a2a;
  }

  .products-empty {
    text-align: center;
    padding: 80px 20px;
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-style: italic;
    color: #333;
    background: #161616;
    border: 1px solid #2a2a2a;
  }
`;

const CATEGORIES = ["All", "Skincare", "Haircare", "Weightloss"];

function Products() {
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState("All");

  useEffect(() => {
    axios.get("/products").then((res) => setProducts(res.data));
  }, []);

  const filtered = activeTab === "All"
    ? products
    : products.filter(
        (p) => p.category?.toLowerCase() === activeTab.toLowerCase()
      );

  return (
    <>
      <style>{styles}</style>
      <div className="products-page">
        <div className="products-header">
          <span className="products-tag">Our Collection</span>
          <h1 className="products-title">All Products</h1>
        </div>

        {/* Category tabs */}
        <div className="cat-tabs">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`cat-tab ${activeTab === cat ? "active" : ""}`}
              onClick={() => setActiveTab(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {filtered.length === 0 ? (
          <div className="products-empty">No products found in this category.</div>
        ) : (
          <div className="products-grid">
            {filtered.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Products;
