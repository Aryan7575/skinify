import { useState } from "react";
import axios from "../api/axios";
import { useNavigate, Link } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=DM+Sans:wght@300;400;500&display=swap');

  .auth-page {
    min-height: 100vh;
    background: #0e0e0e;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'DM Sans', sans-serif;
    padding: 40px 20px;
  }

  .auth-card {
    width: 100%;
    max-width: 420px;
    background: #161616;
    border: 1px solid #2a2a2a;
    padding: 52px 48px;
    animation: fadeUp 0.5s ease;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .auth-brand {
    font-family: 'Cormorant Garamond', serif;
    font-size: 15px;
    font-weight: 300;
    letter-spacing: 3px;
    color: #c8a97e;
    text-transform: uppercase;
    margin-bottom: 36px;
    display: block;
  }

  .auth-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: 38px;
    font-weight: 300;
    color: #f0ece4;
    line-height: 1.1;
    margin-bottom: 8px;
  }

  .auth-subtitle {
    font-size: 13px;
    color: #555;
    font-weight: 300;
    margin-bottom: 44px;
    line-height: 1.6;
  }

  .auth-field {
    margin-bottom: 20px;
  }

  .auth-label {
    display: block;
    font-size: 9px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #555;
    margin-bottom: 8px;
  }

  .auth-input {
    width: 100%;
    padding: 14px 16px;
    background: #111;
    border: 1px solid #2a2a2a;
    color: #f0ece4;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 300;
    outline: none;
    transition: border-color 0.3s ease;
    border-radius: 1px;
    box-sizing: border-box;
  }

  .auth-input::placeholder { color: #333; }

  .auth-input:focus {
    border-color: #c8a97e;
    background: #131313;
  }

  .auth-submit {
    width: 100%;
    padding: 16px;
    margin-top: 12px;
    background: #c8a97e;
    color: #0e0e0e;
    border: none;
    font-family: 'DM Sans', sans-serif;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 3px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-bottom: 28px;
  }

  .auth-submit:hover {
    background: #d4b98a;
    transform: translateY(-1px);
  }

  .auth-divider {
    height: 1px;
    background: #2a2a2a;
    margin-bottom: 24px;
  }

  .auth-footer {
    font-size: 12px;
    color: #555;
    text-align: center;
  }

  .auth-footer a {
    color: #c8a97e;
    text-decoration: none;
    transition: opacity 0.2s ease;
  }

  .auth-footer a:hover { opacity: 0.75; }
`;

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name || !email || !password) return;
    setLoading(true);
    try {
      await axios.post("/auth/register", { name, email, password });
      navigate("/login");
    } catch (err) {
      alert("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleRegister();
  };

  return (
    <>
      <style>{styles}</style>
      <div className="auth-page">
        <div className="auth-card">
          <span className="auth-brand">Skinify</span>
          <h1 className="auth-title">Create your<br />account</h1>
          <p className="auth-subtitle">Join Skinify and discover AI-powered wellness</p>

          <div className="auth-field">
            <label className="auth-label">Full Name</label>
            <input
              className="auth-input"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Email Address</label>
            <input
              className="auth-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <div className="auth-field">
            <label className="auth-label">Password</label>
            <input
              className="auth-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
            />
          </div>

          <button className="auth-submit" onClick={handleRegister} disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <div className="auth-divider" />

          <p className="auth-footer">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Register;
