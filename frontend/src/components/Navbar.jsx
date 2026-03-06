import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useState } from "react";
import "./Navbar.css";
import logo from "../assets/logo.png";

function Navbar() {
  const { cart } = useCart();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const totalItems = cart.reduce((acc, item) => acc + item.qty, 0);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
    window.location.reload();
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="logo" onClick={() => navigate("/home")}>
        <img src={logo} alt="logo" />
        <span>Skinify</span>
      </div>

      {/* Right Section */}
      <div className="right-section">
        <div className="nav-links">
          <Link to="/home">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/ai">AI Recommend</Link>
          <Link to="/cart">
            Cart
            {totalItems > 0 && (
              <span className="cart-count">{totalItems}</span>
            )}
          </Link>
        </div>

        {/* Profile */}
        <div className="profile-container">
          <div className="profile-icon" onClick={() => setOpen(!open)}>
            👤
          </div>

          {open && (
            <div className="dropdown">
              <div onClick={() => { navigate("/orders"); setOpen(false); }}>My Orders</div>
              <div onClick={handleLogout}>Logout</div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
