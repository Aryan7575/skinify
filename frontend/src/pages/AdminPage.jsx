import { useState, useEffect } from "react";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import axios from "../api/axios";

function AdminPage() {
  const [token, setToken] = useState(localStorage.getItem("adminToken"));
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem("adminUser");
    return u ? JSON.parse(u) : null;
  });

  // ✅ Set token in axios IMMEDIATELY on every render
  useEffect(() => {
    const t = localStorage.getItem("adminToken");
    if (t) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${t}`;
      console.log("✅ Admin token set in axios:", t);
    }
  }, [token]);

  const handleLogin = (newToken, newUser) => {
    localStorage.setItem("adminToken", newToken);
    localStorage.setItem("adminUser", JSON.stringify(newUser));
    axios.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
    setToken(newToken);
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    delete axios.defaults.headers.common["Authorization"];
    setToken(null);
    setUser(null);
  };

  if (!token || !user) return <AdminLogin onLogin={handleLogin} />;
  return <AdminDashboard onLogout={handleLogout} user={user} />;
}

export default AdminPage;