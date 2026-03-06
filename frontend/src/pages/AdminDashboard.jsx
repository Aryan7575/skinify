import { useState, useEffect } from "react";
import axios from "../api/axios";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700&family=DM+Mono:wght@300;400;500&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .adm { display: flex; min-height: 100vh; background: #f5f3ef; font-family: 'Syne', sans-serif; color: #1a1a1a; }

  /* ── SIDEBAR ── */
  .adm-sidebar { width: 220px; background: #1a1a1a; display: flex; flex-direction: column; padding: 32px 0; flex-shrink: 0; position: sticky; top: 0; height: 100vh; transition: width 0.3s ease; }
  .adm-logo { padding: 0 24px 32px; border-bottom: 1px solid #2a2a2a; }
  .adm-logo-text { font-size: 18px; font-weight: 700; color: #fff; letter-spacing: 1px; }
  .adm-logo-sub { font-size: 10px; color: #555; letter-spacing: 3px; text-transform: uppercase; margin-top: 2px; font-family: 'DM Mono', monospace; }
  .adm-nav { padding: 24px 0; flex: 1; }
  .adm-nav-item { display: flex; align-items: center; gap: 12px; padding: 12px 24px; cursor: pointer; transition: all 0.2s; color: #666; font-size: 13px; font-weight: 500; border-left: 2px solid transparent; white-space: nowrap; }
  .adm-nav-item:hover { color: #fff; background: #222; }
  .adm-nav-item.active { color: #e8c170; border-left-color: #e8c170; background: #222; }
  .adm-nav-icon { font-size: 16px; width: 20px; text-align: center; flex-shrink: 0; }
  .adm-logout { padding: 24px; border-top: 1px solid #2a2a2a; }
  .adm-logout-btn { width: 100%; padding: 10px; background: #2a2a2a; border: none; color: #888; font-family: 'Syne', sans-serif; font-size: 12px; letter-spacing: 1px; cursor: pointer; border-radius: 2px; transition: all 0.2s; }
  .adm-logout-btn:hover { background: #333; color: #fff; }

  /* ── MAIN ── */
  .adm-main { flex: 1; overflow-y: auto; overflow-x: hidden; min-width: 0; }
  .adm-topbar { padding: 20px 32px; background: #fff; border-bottom: 1px solid #eee; display: flex; align-items: center; justify-content: space-between; gap: 12px; }
  .adm-topbar-title { font-size: 20px; font-weight: 700; }
  .adm-topbar-badge { background: #1a1a1a; color: #e8c170; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; padding: 4px 10px; border-radius: 2px; font-family: 'DM Mono', monospace; white-space: nowrap; }
  .adm-content { padding: 32px; }

  /* ── STATS ── */
  .adm-stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 40px; }
  .adm-stat-card { background: #fff; border: 1px solid #eee; padding: 24px; border-radius: 2px; transition: box-shadow 0.2s; }
  .adm-stat-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
  .adm-stat-label { font-size: 10px; letter-spacing: 3px; text-transform: uppercase; color: #999; margin-bottom: 12px; font-family: 'DM Mono', monospace; }
  .adm-stat-value { font-size: 32px; font-weight: 700; color: #1a1a1a; line-height: 1; word-break: break-all; }
  .adm-stat-value.gold { color: #e8c170; }

  /* ── SECTION ── */
  .adm-section-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 12px; }
  .adm-section-title { font-size: 16px; font-weight: 700; }

  /* ── BUTTONS ── */
  .adm-btn { padding: 10px 20px; border: none; border-radius: 2px; font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 600; letter-spacing: 1px; cursor: pointer; transition: all 0.2s; }
  .adm-btn-dark { background: #1a1a1a; color: #fff; }
  .adm-btn-dark:hover { background: #333; }
  .adm-btn-danger { background: #fee2e2; color: #dc2626; }
  .adm-btn-danger:hover { background: #fecaca; }
  .adm-btn-success { background: #dcfce7; color: #16a34a; }
  .adm-btn-success:hover { background: #bbf7d0; }
  .adm-btn-sm { padding: 6px 12px; font-size: 11px; }

  /* ── TABLE ── */
  .adm-table-wrap { background: #fff; border: 1px solid #eee; border-radius: 2px; overflow-x: auto; margin-bottom: 40px; -webkit-overflow-scrolling: touch; }
  .adm-table { width: 100%; border-collapse: collapse; min-width: 480px; }
  .adm-table th { padding: 14px 16px; text-align: left; font-size: 10px; letter-spacing: 2px; text-transform: uppercase; color: #999; background: #fafafa; border-bottom: 1px solid #eee; font-family: 'DM Mono', monospace; font-weight: 400; white-space: nowrap; }
  .adm-table td { padding: 14px 16px; font-size: 13px; border-bottom: 1px solid #f5f5f5; vertical-align: middle; }
  .adm-table tr:last-child td { border-bottom: none; }
  .adm-table tr:hover td { background: #fafafa; }

  /* ── STATUS ── */
  .adm-status { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; font-family: 'DM Mono', monospace; white-space: nowrap; }
  .adm-status-Placed { background: #fef9c3; color: #854d0e; }
  .adm-status-Shipped { background: #e0f2fe; color: #0369a1; }
  .adm-status-Delivered { background: #dcfce7; color: #15803d; }
  .adm-status-Cancelled { background: #fee2e2; color: #dc2626; }
  .adm-status-admin { background: #fef3c7; color: #d97706; }
  .adm-status-user { background: #f3f4f6; color: #374151; }
  .adm-status-select { padding: 4px 8px; border: 1px solid #ddd; border-radius: 2px; font-family: 'Syne', sans-serif; font-size: 12px; outline: none; background: #fff; cursor: pointer; }

  /* ── PRODUCT IMG ── */
  .adm-product-img { width: 48px; height: 48px; object-fit: cover; border-radius: 2px; background: #f5f5f5; }

  /* ── MODAL ── */
  .adm-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; backdrop-filter: blur(4px); padding: 16px; }
  .adm-modal { background: #fff; width: 500px; max-width: 100%; max-height: 90vh; overflow-y: auto; border-radius: 4px; }
  .adm-modal-header { padding: 24px 28px; border-bottom: 1px solid #eee; display: flex; align-items: center; justify-content: space-between; }
  .adm-modal-title { font-size: 16px; font-weight: 700; }
  .adm-modal-close { background: none; border: none; font-size: 20px; cursor: pointer; color: #999; padding: 4px; }
  .adm-modal-body { padding: 28px; }
  .adm-form-group { margin-bottom: 20px; }
  .adm-form-label { display: block; font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: #666; margin-bottom: 8px; font-family: 'DM Mono', monospace; }
  .adm-form-input { width: 100%; padding: 10px 14px; border: 1px solid #ddd; border-radius: 2px; font-family: 'Syne', sans-serif; font-size: 14px; outline: none; box-sizing: border-box; }
  .adm-form-input:focus { border-color: #1a1a1a; }
  .adm-form-textarea { width: 100%; padding: 10px 14px; border: 1px solid #ddd; border-radius: 2px; font-family: 'Syne', sans-serif; font-size: 14px; resize: vertical; min-height: 80px; outline: none; box-sizing: border-box; }
  .adm-form-textarea:focus { border-color: #1a1a1a; }
  .adm-modal-footer { padding: 20px 28px; border-top: 1px solid #eee; display: flex; gap: 12px; justify-content: flex-end; flex-wrap: wrap; }
  .adm-tags-wrap { display: flex; flex-wrap: wrap; gap: 6px; padding: 8px; border: 1px solid #ddd; border-radius: 2px; min-height: 44px; }
  .adm-tag { background: #1a1a1a; color: #fff; padding: 3px 10px; border-radius: 20px; font-size: 12px; display: flex; align-items: center; gap: 6px; }
  .adm-tag-remove { cursor: pointer; opacity: 0.6; }
  .adm-tag-remove:hover { opacity: 1; }
  .adm-tag-input { border: none; outline: none; font-family: 'Syne', sans-serif; font-size: 13px; flex: 1; min-width: 80px; }

  /* ── MISC ── */
  .adm-loading { text-align: center; padding: 60px; color: #999; font-size: 14px; }
  .adm-empty { text-align: center; padding: 60px; color: #bbb; font-size: 14px; }

  /* ── MOBILE BOTTOM NAV ── */
  .adm-mobile-nav { display: none; }

  /* ── TABLET (max 1024px) ── */
  @media (max-width: 1024px) {
    .adm-sidebar { width: 64px; }
    .adm-logo { padding: 0 0 24px; display: flex; justify-content: center; }
    .adm-logo-text { display: none; }
    .adm-logo-sub { display: none; }
    .adm-nav-item { padding: 14px; justify-content: center; }
    .adm-nav-item span:last-child { display: none; }
    .adm-logout { padding: 12px; }
    .adm-logout-btn { font-size: 0; padding: 10px; letter-spacing: 0; }
    .adm-logout-btn::before { content: '⏻'; font-size: 16px; }
    .adm-stats { grid-template-columns: repeat(2, 1fr); }
    .adm-content { padding: 24px; }
    .adm-topbar { padding: 16px 24px; }
  }

  /* ── MOBILE (max 768px) ── */
  @media (max-width: 768px) {
    .adm-sidebar { display: none; }
    .adm-main { padding-bottom: 72px; }
    .adm-topbar { padding: 14px 16px; }
    .adm-topbar-title { font-size: 16px; }
    .adm-content { padding: 16px; }
    .adm-stats { grid-template-columns: repeat(2, 1fr); gap: 10px; margin-bottom: 24px; }
    .adm-stat-card { padding: 16px; }
    .adm-stat-value { font-size: 24px; }
    .adm-table th, .adm-table td { padding: 10px 12px; font-size: 12px; }
    .adm-product-img { width: 36px; height: 36px; }

    .adm-mobile-nav {
      display: flex;
      position: fixed;
      bottom: 0; left: 0; right: 0;
      height: 64px;
      background: #1a1a1a;
      border-top: 1px solid #2a2a2a;
      z-index: 200;
      align-items: stretch;
    }
    .adm-mobile-nav-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 3px;
      cursor: pointer;
      color: #555;
      font-size: 9px;
      letter-spacing: 1px;
      text-transform: uppercase;
      font-family: 'DM Mono', monospace;
      transition: color 0.2s;
      border: none;
      background: none;
      padding: 0;
    }
    .adm-mobile-nav-item.active { color: #e8c170; }
    .adm-mobile-nav-icon { font-size: 20px; }
    .adm-mobile-logout-btn {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 3px;
      cursor: pointer;
      color: #dc2626;
      font-size: 9px;
      letter-spacing: 1px;
      text-transform: uppercase;
      font-family: 'DM Mono', monospace;
      background: none;
      border: none;
      padding: 0;
    }
  }

  /* ── SMALL MOBILE (max 400px) ── */
  @media (max-width: 400px) {
    .adm-stats { grid-template-columns: 1fr 1fr; gap: 8px; }
    .adm-stat-value { font-size: 20px; }
    .adm-stat-label { font-size: 9px; }
    .adm-topbar-badge { display: none; }
  }
`;

function AdminDashboard({ onLogout, user }) {
  const [tab, setTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});
  const [tagInput, setTagInput] = useState("");

  useEffect(() => { fetchStats(); }, []);
  useEffect(() => {
    if (tab === "orders") fetchOrders();
    if (tab === "products") fetchProducts();
    if (tab === "users") fetchUsers();
  }, [tab]);

  const fetchStats = async () => {
    try { const res = await axios.get("/admin/stats"); setStats(res.data); }
    catch (err) { console.error("STATS ERR:", err.response?.data || err.message); }
  };
  const fetchOrders = async () => {
    setLoading(true);
    try { const res = await axios.get("/admin/orders"); setOrders(res.data); }
    catch (err) { console.error("ORDERS ERR:", err.response?.data || err.message); }
    setLoading(false);
  };
  const fetchProducts = async () => {
    setLoading(true);
    try { const res = await axios.get("/admin/products"); setProducts(res.data); }
    catch (err) { console.error("PRODUCTS ERR:", err.response?.data || err.message); }
    setLoading(false);
  };
  const fetchUsers = async () => {
    setLoading(true);
    try { const res = await axios.get("/admin/users"); setUsers(res.data); }
    catch (err) { console.error("USERS ERR:", err.response?.data || err.message); }
    setLoading(false);
  };
  const updateOrderStatus = async (id, status) => {
    try {
      await axios.put(`/admin/orders/${id}/status`, { status });
      setOrders(orders.map(o => o._id === id ? { ...o, status } : o));
    } catch (err) { alert("Failed to update status"); }
  };
  const openAddModal = () => {
    setForm({ name: "", price: "", image: "", description: "", tags: [], category: "", stock: "" });
    setTagInput("");
    setModal({ type: "add" });
  };
  const openEditModal = (product) => {
    setForm({ ...product, tags: product.tags || [] });
    setTagInput("");
    setModal({ type: "edit", product });
  };
  const saveProduct = async () => {
    try {
      if (modal.type === "add") {
        const res = await axios.post("/admin/products", form);
        setProducts([res.data, ...products]);
      } else {
        const res = await axios.put(`/admin/products/${modal.product._id}`, form);
        setProducts(products.map(p => p._id === modal.product._id ? res.data : p));
      }
      setModal(null);
    } catch (err) { alert("Failed to save product"); }
  };
  const deleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try { await axios.delete(`/admin/products/${id}`); setProducts(products.filter(p => p._id !== id)); }
    catch (err) { alert("Failed to delete"); }
  };
  const deleteUser = async (id) => {
    if (!window.confirm("Delete this user?")) return;
    try { await axios.delete(`/admin/users/${id}`); setUsers(users.filter(u => u._id !== id)); }
    catch (err) { alert("Failed to delete"); }
  };
  const addTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!form.tags.includes(tagInput.trim())) setForm({ ...form, tags: [...form.tags, tagInput.trim()] });
      setTagInput("");
    }
  };
  const removeTag = (tag) => setForm({ ...form, tags: form.tags.filter(t => t !== tag) });

  const nav = [
    { id: "overview", icon: "▦", label: "Overview" },
    { id: "orders",   icon: "◈", label: "Orders" },
    { id: "products", icon: "◉", label: "Products" },
    { id: "users",    icon: "◎", label: "Users" },
  ];

  const tabTitle = {
    overview: "Dashboard Overview",
    orders: "Order Management",
    products: "Product Management",
    users: "User Management",
  };

  return (
    <>
      <style>{styles}</style>
      <div className="adm">

        {/* SIDEBAR — hidden on mobile */}
        <aside className="adm-sidebar">
          <div className="adm-logo">
            <div>
              <div className="adm-logo-text">Skinify</div>
              <div className="adm-logo-sub">Admin Panel</div>
            </div>
          </div>
          <nav className="adm-nav">
            {nav.map(n => (
              <div key={n.id} className={`adm-nav-item ${tab === n.id ? "active" : ""}`} onClick={() => setTab(n.id)}>
                <span className="adm-nav-icon">{n.icon}</span>
                <span>{n.label}</span>
              </div>
            ))}
          </nav>
          <div className="adm-logout">
            <button className="adm-logout-btn" onClick={onLogout}>← Logout</button>
          </div>
        </aside>

        {/* MAIN */}
        <main className="adm-main">
          <div className="adm-topbar">
            <span className="adm-topbar-title">{tabTitle[tab]}</span>
            <span className="adm-topbar-badge">Admin</span>
          </div>

          <div className="adm-content">

            {/* OVERVIEW */}
            {tab === "overview" && (
              <>
                <div className="adm-stats">
                  {[
                    { label: "Total Revenue",  value: `₹${stats?.totalRevenue?.toLocaleString() || 0}`, gold: true },
                    { label: "Total Orders",   value: stats?.totalOrders   || 0 },
                    { label: "Total Products", value: stats?.totalProducts || 0 },
                    { label: "Total Users",    value: stats?.totalUsers    || 0 },
                  ].map((s, i) => (
                    <div key={i} className="adm-stat-card">
                      <div className="adm-stat-label">{s.label}</div>
                      <div className={`adm-stat-value ${s.gold ? "gold" : ""}`}>{s.value}</div>
                    </div>
                  ))}
                </div>
                <div className="adm-section-header"><span className="adm-section-title">Recent Orders</span></div>
                <div className="adm-table-wrap">
                  <table className="adm-table">
                    <thead><tr><th>Customer</th><th>Amount</th><th>Status</th><th>Date</th></tr></thead>
                    <tbody>
                      {!stats?.recentOrders?.length && <tr><td colSpan={4} className="adm-empty">No orders yet</td></tr>}
                      {stats?.recentOrders?.map(o => (
                        <tr key={o._id}>
                          <td>{o.userId?.name || "Guest"}<br /><span style={{ color:"#999", fontSize:"11px" }}>{o.userId?.email}</span></td>
                          <td>₹{o.totalAmount}</td>
                          <td><span className={`adm-status adm-status-${o.status}`}>{o.status}</span></td>
                          <td style={{ color:"#999", fontSize:"12px" }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {/* ORDERS */}
            {tab === "orders" && (
              <>
                <div className="adm-section-header"><span className="adm-section-title">{orders.length} Orders</span></div>
                <div className="adm-table-wrap">
                  {loading ? <div className="adm-loading">Loading...</div> : (
                    <table className="adm-table">
                      <thead><tr><th>ID</th><th>Customer</th><th>Items</th><th>Total</th><th>Status</th><th>Date</th></tr></thead>
                      <tbody>
                        {!orders.length && <tr><td colSpan={6} className="adm-empty">No orders found</td></tr>}
                        {orders.map(o => (
                          <tr key={o._id}>
                            <td style={{ fontFamily:"'DM Mono',monospace", fontSize:"11px", color:"#999" }}>#{o._id.slice(-6).toUpperCase()}</td>
                            <td>{o.userId?.name || "Guest"}<br /><span style={{ color:"#999", fontSize:"11px" }}>{o.userId?.email}</span></td>
                            <td>{o.products?.length || 0}</td>
                            <td style={{ fontWeight:600 }}>₹{o.totalAmount}</td>
                            <td>
                              <select className="adm-status-select" value={o.status} onChange={e => updateOrderStatus(o._id, e.target.value)}>
                                {["Placed","Shipped","Delivered","Cancelled"].map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                            </td>
                            <td style={{ color:"#999", fontSize:"12px" }}>{new Date(o.createdAt).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </>
            )}

            {/* PRODUCTS */}
            {tab === "products" && (
              <>
                <div className="adm-section-header">
                  <span className="adm-section-title">{products.length} Products</span>
                  <button className="adm-btn adm-btn-dark" onClick={openAddModal}>+ Add Product</button>
                </div>
                <div className="adm-table-wrap">
                  {loading ? <div className="adm-loading">Loading...</div> : (
                    <table className="adm-table">
                      <thead><tr><th>Img</th><th>Name</th><th>Price</th><th>Stock</th><th>Tags</th><th>Actions</th></tr></thead>
                      <tbody>
                        {!products.length && <tr><td colSpan={6} className="adm-empty">No products found</td></tr>}
                        {products.map(p => (
                          <tr key={p._id}>
                            <td><img src={p.image} alt={p.name} className="adm-product-img" onError={e => e.target.style.display="none"} /></td>
                            <td style={{ fontWeight:500 }}>{p.name}</td>
                            <td>₹{p.price}</td>
                            <td>{p.stock ?? "-"}</td>
                            <td>{p.tags?.slice(0,2).map(t => <span key={t} style={{ background:"#f3f4f6", padding:"2px 8px", borderRadius:"20px", fontSize:"11px", marginRight:"4px", display:"inline-block", marginBottom:"2px" }}>{t}</span>)}</td>
                            <td>
                              <div style={{ display:"flex", gap:"6px", flexWrap:"wrap" }}>
                                <button className="adm-btn adm-btn-success adm-btn-sm" onClick={() => openEditModal(p)}>Edit</button>
                                <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => deleteProduct(p._id)}>Del</button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </>
            )}

            {/* USERS */}
            {tab === "users" && (
              <>
                <div className="adm-section-header"><span className="adm-section-title">{users.length} Users</span></div>
                <div className="adm-table-wrap">
                  {loading ? <div className="adm-loading">Loading...</div> : (
                    <table className="adm-table">
                      <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th><th>Actions</th></tr></thead>
                      <tbody>
                        {!users.length && <tr><td colSpan={5} className="adm-empty">No users found</td></tr>}
                        {users.map(u => (
                          <tr key={u._id}>
                            <td style={{ fontWeight:500 }}>{u.name}</td>
                            <td style={{ color:"#666", fontSize:"12px" }}>{u.email}</td>
                            <td><span className={`adm-status adm-status-${u.role}`}>{u.role}</span></td>
                            <td style={{ color:"#999", fontSize:"12px" }}>{new Date(u.createdAt).toLocaleDateString()}</td>
                            <td>{u.role !== "admin" && <button className="adm-btn adm-btn-danger adm-btn-sm" onClick={() => deleteUser(u._id)}>Delete</button>}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </>
            )}

          </div>
        </main>

        {/* MOBILE BOTTOM NAV */}
        <div className="adm-mobile-nav">
          {nav.map(n => (
            <button key={n.id} className={`adm-mobile-nav-item ${tab === n.id ? "active" : ""}`} onClick={() => setTab(n.id)}>
              <span className="adm-mobile-nav-icon">{n.icon}</span>
              {n.label}
            </button>
          ))}
          <button className="adm-mobile-logout-btn" onClick={onLogout}>
            <span className="adm-mobile-nav-icon">⏻</span>
            Logout
          </button>
        </div>

      </div>

      {/* PRODUCT MODAL */}
      {modal && (
        <div className="adm-modal-overlay" onClick={() => setModal(null)}>
          <div className="adm-modal" onClick={e => e.stopPropagation()}>
            <div className="adm-modal-header">
              <span className="adm-modal-title">{modal.type === "add" ? "Add Product" : "Edit Product"}</span>
              <button className="adm-modal-close" onClick={() => setModal(null)}>×</button>
            </div>
            <div className="adm-modal-body">
              {[
                { label: "Product Name", key: "name", type: "text", placeholder: "e.g. Vitamin C Serum" },
                { label: "Price (₹)", key: "price", type: "number", placeholder: "e.g. 799" },
                { label: "Stock", key: "stock", type: "number", placeholder: "e.g. 100" },
                { label: "Image URL", key: "image", type: "text", placeholder: "https://..." },
                { label: "Category", key: "category", type: "text", placeholder: "e.g. Skincare" },
              ].map(f => (
                <div className="adm-form-group" key={f.key}>
                  <label className="adm-form-label">{f.label}</label>
                  <input className="adm-form-input" type={f.type} value={form[f.key] || ""} onChange={e => setForm({...form, [f.key]: e.target.value})} placeholder={f.placeholder} />
                </div>
              ))}
              <div className="adm-form-group">
                <label className="adm-form-label">Description</label>
                <textarea className="adm-form-textarea" value={form.description || ""} onChange={e => setForm({...form, description: e.target.value})} placeholder="Product description..." />
              </div>
              <div className="adm-form-group">
                <label className="adm-form-label">Tags — press Enter to add</label>
                <div className="adm-tags-wrap">
                  {form.tags?.map(t => (
                    <span key={t} className="adm-tag">{t} <span className="adm-tag-remove" onClick={() => removeTag(t)}>×</span></span>
                  ))}
                  <input className="adm-tag-input" value={tagInput} onChange={e => setTagInput(e.target.value)} onKeyDown={addTag} placeholder="acne, dry, oily..." />
                </div>
              </div>
            </div>
            <div className="adm-modal-footer">
              <button className="adm-btn" style={{ background:"#f3f4f6", color:"#666" }} onClick={() => setModal(null)}>Cancel</button>
              <button className="adm-btn adm-btn-dark" onClick={saveProduct}>{modal.type === "add" ? "Add Product" : "Save Changes"}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminDashboard;
