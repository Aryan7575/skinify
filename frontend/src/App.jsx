import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import Cart from "./pages/Cart";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Products from "./pages/Products";
import AIUpload from "./pages/AIupload";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";
import ProtectedRoute from "./components/ProtectedRoute";
import Orders from "./pages/Orders";
import axios from "./api/axios";
import AdminPage from "./pages/AdminPage";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("/auth/me", { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setCurrentUser(res.data))
        .catch((err) => console.log(err));
    }
  }, []);

  return (
    <BrowserRouter>
      {localStorage.getItem("token") && <Navbar />}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Routes */}
        <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/products" element={<ProtectedRoute><Products /></ProtectedRoute>} />
        <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
        <Route path="/ai" element={<ProtectedRoute><AIUpload user={currentUser} /></ProtectedRoute>} />
        <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
        <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />

        {/* Admin Route - NO ProtectedRoute, AdminPage handles its own auth */}
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;