import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400;500&display=swap');

  .co-page {
    min-height: 100vh;
    background: #0e0e0e;
    padding: 108px 6vw 80px;
    font-family: 'DM Sans', sans-serif;
    color: #f0ece4;
  }

  .co-tag {
    font-size: 10px;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: #c8a97e;
    display: block;
    margin-bottom: 12px;
  }

  .co-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(32px, 4vw, 52px);
    font-weight: 300;
    color: #f0ece4;
    margin-bottom: 52px;
  }

  .co-title::after {
    content: '';
    display: block;
    width: 40px;
    height: 1px;
    background: #c8a97e;
    margin-top: 16px;
  }

  /* Layout */
  .co-layout {
    display: grid;
    grid-template-columns: 1fr 360px;
    gap: 2px;
    align-items: start;
  }

  @media (max-width: 860px) {
    .co-layout { grid-template-columns: 1fr; }
  }

  .co-form-side {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  /* Section card */
  .co-section {
    background: #161616;
    border: 1px solid #2a2a2a;
    padding: 32px 36px;
  }

  @media (max-width: 540px) {
    .co-section { padding: 24px 18px; }
  }

  .co-section-title {
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #c8a97e;
    margin-bottom: 28px;
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .co-section-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #2a2a2a;
  }

  /* Form fields */
  .co-2col {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }

  @media (max-width: 540px) {
    .co-2col { grid-template-columns: 1fr; }
  }

  .co-field { margin-bottom: 18px; }
  .co-field:last-child { margin-bottom: 0; }

  .co-label {
    display: block;
    font-size: 9px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #555;
    margin-bottom: 8px;
  }

  .co-input {
    width: 100%;
    padding: 13px 16px;
    background: #111;
    border: 1px solid #2a2a2a;
    color: #f0ece4;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 300;
    outline: none;
    transition: border-color 0.25s ease, background 0.25s ease;
    border-radius: 1px;
    box-sizing: border-box;
  }

  .co-input::placeholder { color: #2e2e2e; }
  .co-input:focus { border-color: #c8a97e; background: #131313; }
  .co-input.err { border-color: rgba(231,76,60,0.55); }

  .co-err {
    font-size: 10px;
    color: #e74c3c;
    margin-top: 5px;
    letter-spacing: 0.5px;
  }

  /* Payment toggle */
  .pay-toggle {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1px;
    background: #2a2a2a;
    border: 1px solid #2a2a2a;
    margin-bottom: 0;
  }

  .pay-opt {
    background: #111;
    padding: 20px 20px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 13px;
    position: relative;
    transition: background 0.2s ease;
    user-select: none;
  }

  .pay-opt:hover { background: #141414; }
  .pay-opt.on    { background: #1a1a1a; }

  .pay-opt.on::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: #c8a97e;
  }

  .pay-radio {
    width: 17px; height: 17px;
    border: 1px solid #3a3a3a;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: border-color 0.2s;
  }

  .pay-opt.on .pay-radio { border-color: #c8a97e; }

  .pay-dot {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: #c8a97e;
    transform: scale(0);
    transition: transform 0.2s ease;
  }

  .pay-opt.on .pay-dot { transform: scale(1); }

  .pay-info { display: flex; flex-direction: column; gap: 3px; }

  .pay-name {
    font-size: 12px;
    font-weight: 500;
    letter-spacing: 1px;
    color: #777;
    transition: color 0.2s;
  }

  .pay-opt.on .pay-name { color: #f0ece4; }

  .pay-desc { font-size: 10px; color: #444; font-weight: 300; }

  /* COD / Prepaid notice */
  .pay-notice {
    margin-top: 14px;
    padding: 14px 16px;
    font-size: 12px;
    color: #777;
    line-height: 1.7;
    display: flex;
    gap: 10px;
    align-items: flex-start;
    border: 1px solid;
    animation: fadeNotice 0.3s ease;
  }

  @keyframes fadeNotice {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .pay-notice.cod-notice {
    background: rgba(200,169,126,0.04);
    border-color: rgba(200,169,126,0.18);
  }

  .pay-notice.pre-notice {
    background: rgba(100,180,100,0.04);
    border-color: rgba(100,180,100,0.18);
    color: #6a6a6a;
  }

  /* ── Summary panel ── */
  .co-summary {
    background: #161616;
    border: 1px solid #2a2a2a;
    padding: 36px 30px;
    position: sticky;
    top: 88px;
  }

  .co-sum-lbl {
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #666;
    margin-bottom: 24px;
  }

  .co-items {
    display: flex;
    flex-direction: column;
    gap: 14px;
    margin-bottom: 22px;
    max-height: 260px;
    overflow-y: auto;
    padding-right: 2px;
  }

  .co-items::-webkit-scrollbar { width: 2px; }
  .co-items::-webkit-scrollbar-thumb { background: #2a2a2a; }

  .co-item {
    display: flex;
    align-items: center;
    gap: 13px;
  }

  .co-item-img {
    width: 50px; height: 50px;
    object-fit: cover; flex-shrink: 0;
  }

  .co-item-body { flex: 1; }

  .co-item-name {
    font-size: 12px;
    color: #888;
    line-height: 1.5;
    margin-bottom: 2px;
  }

  .co-item-qty { font-size: 10px; color: #444; }

  .co-item-price {
    font-family: 'Cormorant Garamond', serif;
    font-size: 16px;
    color: #c8a97e;
    white-space: nowrap;
  }

  .co-hr { height: 1px; background: #222; margin: 14px 0; }

  .co-fee {
    display: flex;
    justify-content: space-between;
    font-size: 12px;
    color: #4a4a4a;
    margin-bottom: 10px;
  }

  .co-total-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin: 20px 0 28px;
  }

  .co-total-row span:first-child {
    font-size: 10px;
    letter-spacing: 3px;
    text-transform: uppercase;
    color: #888;
  }

  .co-total-row span:last-child {
    font-family: 'Cormorant Garamond', serif;
    font-size: 34px;
    font-weight: 300;
    color: #c8a97e;
  }

  .co-btn {
    width: 100%;
    padding: 17px;
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
  }

  .co-btn:hover:not(:disabled) { background: #d4b98a; transform: translateY(-1px); }
  .co-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

  .co-secure {
    margin-top: 14px;
    text-align: center;
    font-size: 10px;
    letter-spacing: 1.5px;
    color: #2a2a2a;
    text-transform: uppercase;
  }

  /* ── Success ── */
  .co-done {
    text-align: center;
    padding: 100px 20px;
    max-width: 460px;
    margin: 0 auto;
    animation: fadeUp 0.5s ease;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .co-done-ring {
    width: 68px; height: 68px;
    border: 1px solid rgba(200,169,126,0.3);
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    margin: 0 auto 28px;
    font-size: 26px;
    color: #c8a97e;
  }

  .co-done h2 {
    font-family: 'Cormorant Garamond', serif;
    font-size: 42px; font-weight: 300;
    color: #f0ece4; margin-bottom: 14px;
  }

  .co-done p {
    font-size: 13px; color: #555;
    line-height: 1.8; margin-bottom: 36px;
  }

  .co-done-btn {
    padding: 14px 40px;
    background: transparent;
    border: 1px solid #c8a97e;
    color: #c8a97e;
    font-family: 'DM Sans', sans-serif;
    font-size: 10px; letter-spacing: 3px;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .co-done-btn:hover { background: #c8a97e; color: #0e0e0e; }
`;

const INIT = { name: "", email: "", phone: "", address: "", city: "", pincode: "", state: "" };

function Checkout() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm]       = useState(INIT);
  const [errors, setErrors]   = useState({});
  const [payType, setPayType] = useState("prepaid");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const total     = cart.reduce((a, i) => a + i.price * i.qty, 0);
  const itemCount = cart.reduce((a, i) => a + i.qty, 0);

  const set = (k, v) => {
    setForm(f => ({ ...f, [k]: v }));
    setErrors(e => ({ ...e, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.name.trim())                     e.name    = "Required";
    if (!/\S+@\S+\.\S+/.test(form.email))      e.email   = "Valid email required";
    if (!/^\d{10}$/.test(form.phone))           e.phone   = "10-digit number";
    if (!form.address.trim())                   e.address = "Required";
    if (!form.city.trim())                      e.city    = "Required";
    if (!/^\d{6}$/.test(form.pincode))          e.pincode = "6-digit pincode";
    if (!form.state.trim())                     e.state   = "Required";
    setErrors(e);
    return !Object.keys(e).length;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      await fetch("https://skinify-backend-wmf4.onrender.com/api/orders", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
  body: JSON.stringify({
    products: cart.map(i => ({ productId: i._id, quantity: i.qty })),
    totalAmount: total,
    orderType: payType,
    paymentStatus: payType === "cod" ? "cod" : "pending",
    shippingAddress: form,
  }),
});

      if (clearCart) clearCart();
      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Order failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // ── Success screen ─────────────────────────────────────────
  if (success) return (
    <>
      <style>{styles}</style>
      <div className="co-page">
        <div className="co-done">
          <div className="co-done-ring">✓</div>
          <h2>Order Placed!</h2>
          <p>
            {payType === "cod"
              ? "Your order is confirmed. Keep cash ready upon delivery."
              : "Your order has been received and is being prepared."}
            <br />
            A confirmation will be sent to{" "}
            <span style={{ color: "#c8a97e" }}>{form.email}</span>.
          </p>
          <button className="co-done-btn" onClick={() => navigate("/orders")}>
            View My Orders
          </button>
        </div>
      </div>
    </>
  );

  // ── Field component ────────────────────────────────────────
  const Field = ({ id, label, placeholder, type = "text", maxLen }) => (
    <div className="co-field">
      <label className="co-label">{label}</label>
      <input
        className={`co-input${errors[id] ? " err" : ""}`}
        type={type}
        placeholder={placeholder}
        value={form[id]}
        maxLength={maxLen}
        onChange={e => set(id, e.target.value)}
      />
      {errors[id] && <p className="co-err">{errors[id]}</p>}
    </div>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="co-page">
        <span className="co-tag">Final Step</span>
        <h1 className="co-title">Checkout</h1>

        <div className="co-layout">

          {/* ── LEFT: Form ── */}
          <div className="co-form-side">

            {/* Contact */}
            <div className="co-section">
              <p className="co-section-title">Contact Details</p>
              <div className="co-2col">
                <Field id="name"  label="Full Name"     placeholder="Aryan Sharma" />
                <Field id="phone" label="Phone Number"  placeholder="9876543210" maxLen={10} />
              </div>
              <Field id="email" label="Email Address" placeholder="you@example.com" type="email" />
            </div>

            {/* Address */}
            <div className="co-section">
              <p className="co-section-title">Shipping Address</p>
              <Field id="address" label="Street Address" placeholder="Flat 4B, Sunshine Apts, MG Road" />
              <div className="co-2col">
                <Field id="city"    label="City"    placeholder="Mumbai" />
                <Field id="pincode" label="Pincode" placeholder="400001" maxLen={6} />
              </div>
              <Field id="state" label="State" placeholder="Maharashtra" />
            </div>

            {/* Payment type */}
            <div className="co-section">
              <p className="co-section-title">Payment Method</p>

              <div className="pay-toggle">
                {[
                  { val: "prepaid", name: "Prepaid",          desc: "Pay online at checkout" },
                  { val: "cod",     name: "Cash on Delivery",  desc: "Pay when it arrives"   },
                ].map(opt => (
                  <div
                    key={opt.val}
                    className={`pay-opt${payType === opt.val ? " on" : ""}`}
                    onClick={() => setPayType(opt.val)}
                  >
                    <div className="pay-radio">
                      <div className="pay-dot" />
                    </div>
                    <div className="pay-info">
                      <span className="pay-name">{opt.name}</span>
                      <span className="pay-desc">{opt.desc}</span>
                    </div>
                  </div>
                ))}
              </div>

              {payType === "cod" && (
                <div className="pay-notice cod-notice">
                  <span>ℹ️</span>
                  <span>Keep exact cash ready at delivery. COD charges may apply on orders below ₹499.</span>
                </div>
              )}

              {payType === "prepaid" && (
                <div className="pay-notice pre-notice">
                  <span>💳</span>
                  <span>Payment gateway will be integrated soon. Your order will be saved as pending.</span>
                </div>
              )}
            </div>

          </div>

          {/* ── RIGHT: Summary ── */}
          <div className="co-summary">
            <p className="co-sum-lbl">
              Order Summary — {itemCount} item{itemCount !== 1 ? "s" : ""}
            </p>

            <div className="co-items">
              {cart.map(item => (
                <div key={item._id} className="co-item">
                  <img src={item.image} alt={item.name} className="co-item-img" />
                  <div className="co-item-body">
                    <p className="co-item-name">{item.name}</p>
                    <p className="co-item-qty">× {item.qty}</p>
                  </div>
                  <span className="co-item-price">₹{item.price * item.qty}</span>
                </div>
              ))}
            </div>

            <div className="co-hr" />

            <div className="co-fee">
              <span>Subtotal</span>
              <span>₹{total}</span>
            </div>
            <div className="co-fee">
              <span>Shipping</span>
              <span style={{ color: "#c8a97e" }}>Free</span>
            </div>
            <div className="co-fee">
              <span>Payment</span>
              <span>{payType === "cod" ? "Cash on Delivery" : "Prepaid"}</span>
            </div>

            <div className="co-hr" />

            <div className="co-total-row">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <button
              className="co-btn"
              onClick={handleSubmit}
              disabled={loading || !cart.length}
            >
              {loading
                ? "Placing Order..."
                : payType === "cod"
                ? "Place Order (COD)"
                : "Place Order"}
            </button>

            <p className="co-secure">🔒 Secure Checkout</p>
          </div>

        </div>
      </div>
    </>
  );
}

export default Checkout;
