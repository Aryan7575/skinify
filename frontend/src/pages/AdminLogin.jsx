import { useState } from "react";
import axios from "../api/axios";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700&family=DM+Mono:wght@300;400&display=swap');
  .adm-login { min-height: 100vh; display: flex; align-items: center; justify-content: center; background: #f5f3ef; font-family: 'Syne', sans-serif; }
  .adm-login-card { background: #fff; border: 1px solid #e5e5e5; padding: 48px; width: 400px; max-width: 95vw; }
  .adm-login-logo { font-size: 22px; font-weight: 700; margin-bottom: 4px; }
  .adm-login-sub { font-size: 11px; letter-spacing: 3px; text-transform: uppercase; color: #999; margin-bottom: 40px; font-family: 'DM Mono', monospace; }
  .adm-login-label { display: block; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #666; margin-bottom: 8px; font-family: 'DM Mono', monospace; }
  .adm-login-input { width: 100%; padding: 12px 14px; border: 1px solid #ddd; border-radius: 2px; font-family: 'Syne', sans-serif; font-size: 14px; outline: none; margin-bottom: 20px; transition: border-color 0.2s; box-sizing: border-box; }
  .adm-login-input:focus { border-color: #1a1a1a; }
  .adm-login-btn { width: 100%; padding: 14px; background: #1a1a1a; color: #fff; border: none; font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 600; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; border-radius: 2px; margin-top: 8px; }
  .adm-login-btn:hover { background: #333; }
  .adm-login-btn:disabled { opacity: 0.6; cursor: not-allowed; }
  .adm-login-error { background: #fee2e2; color: #dc2626; padding: 12px 14px; border-radius: 2px; font-size: 13px; margin-bottom: 20px; }
  .adm-login-hint { margin-top: 24px; padding-top: 24px; border-top: 1px solid #eee; font-size: 12px; color: #999; font-family: 'DM Mono', monospace; }
`;

function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!email || !password) { setError("Please fill in all fields"); return; }
    setLoading(true);
    setError("");
    try {
      const res = await axios.post("/auth/login", { email, password });
      const { token, user } = res.data;
      if (user.role !== "admin") { setError("Access denied. Admin accounts only."); setLoading(false); return; }
      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminUser", JSON.stringify(user));
      onLogin(token, user);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
    setLoading(false);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="adm-login">
        <div className="adm-login-card">
          <div className="adm-login-logo">Skinify</div>
          <div className="adm-login-sub">Admin Access</div>
          {error && <div className="adm-login-error">{error}</div>}
          <label className="adm-login-label">Email</label>
          <input className="adm-login-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@skinify.com" onKeyDown={e => e.key === "Enter" && handleLogin()} />
          <label className="adm-login-label">Password</label>
          <input className="adm-login-input" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" onKeyDown={e => e.key === "Enter" && handleLogin()} />
          <button className="adm-login-btn" onClick={handleLogin} disabled={loading}>{loading ? "Signing in..." : "Sign In"}</button>
          <div className="adm-login-hint">Only admin accounts can access this panel.</div>
        </div>
      </div>
    </>
  );
}

export default AdminLogin;