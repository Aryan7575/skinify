import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import "./Home.css";
import { useCart } from "../context/CartContext";

function Home() {
  const navigate = useNavigate();

  const slides = [
    {
      image: "https://images.unsplash.com/photo-1485795959911-ea5ebf41b6ae?w=1920&auto=format&fit=crop&q=95&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGdsb3d5aW5nJTIwc2tpbnxlbnwwfHwwfHx8MA%3D%3D",
      title: <>Glow Smarter with <em>AI Wellness</em></>,
      text: "Personalized skincare powered by intelligent recommendations",
    },
    {
      image: "https://images.unsplash.com/photo-1470058869958-2a77ade41c02?w=1920&auto=format&fit=crop&q=95&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cGxhbnRzfGVufDB8fDB8fHww",
      title: <>Plant-Based <em>Nutrition</em></>,
      text: "Clean protein & fat-loss formulas crafted for your body",
    },
    {
      image: "https://images.unsplash.com/photo-1574621100236-d25b64cfd647?w=1920&auto=format&fit=crop&q=95",
      title: <>Stronger Hair, <em>Healthier You</em></>,
      text: "AI-powered hair care solutions tailored to your needs",
    },
  ];

  const [current, setCurrent] = useState(0);
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get("/products");
        setProducts(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="home">

      {/* ── SLIDER ── */}
      <section className="slider">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`slide ${index === current ? "active" : ""}`}
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="overlay">
              <h1>{slide.title}</h1>
              <p>{slide.text}</p>
              <button onClick={() => navigate("/ai")}>
                Get AI Recommendation
              </button>
            </div>
          </div>
        ))}

        {/* Slide indicators */}
        <div style={{
          position: "absolute",
          bottom: "40px",
          right: "6vw",
          display: "flex",
          gap: "8px",
          alignItems: "center",
          zIndex: 10,
        }}>
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              style={{
                width: i === current ? "28px" : "6px",
                height: "6px",
                borderRadius: "3px",
                background: i === current ? "#c8a97e" : "#333",
                border: "none",
                cursor: "pointer",
                transition: "all 0.4s ease",
                padding: 0,
              }}
            />
          ))}
        </div>
      </section>

      {/* ── BEST SELLERS ── */}
      <section className="best-sellers">
        <span className="section-tag">Curated Collection</span>
        <h2>Best Sellers</h2>

        <div className="product-grid">
          {products.slice(0,6).map((product) => (
            <div key={product._id} className="product-card">
              <img src={product.image} alt={product.name} />
              <h4>{product.name}</h4>
              <p>₹{product.price}</p>
              <button
                onClick={(e) => {
                  addToCart(product);
                  e.target.classList.add("pop");
                  setTimeout(() => e.target.classList.remove("pop"), 300);
                }}
              >
                Add to Cart
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-top">
          <div>
            <h3>AI Wellness</h3>
            <p>Science-backed · Plant-based · Premium</p>
          </div>
          <div>
            <h4>Customer Care</h4>
            <p>support@aiwellness.com</p>
            <p>+91 9876543210</p>
          </div>
          <div>
            <h4>Address</h4>
            <p>Mumbai, Maharashtra</p>
            <p>India</p>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 AI Wellness Store. All rights reserved. Made by Aryan.</span>
          <span>✦</span>
        </div>
      </footer>

    </div>
  );
}

export default Home;
