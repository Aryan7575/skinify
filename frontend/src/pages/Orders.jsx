import { useEffect, useState } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=DM+Sans:wght@300;400;500&display=swap');

  .orders-page {
    min-height: 100vh;
    background: #0e0e0e;
    padding: 108px 6vw 80px;
    font-family: 'DM Sans', sans-serif;
    color: #f0ece4;
  }

  .orders-tag {
    font-size: 10px;
    letter-spacing: 4px;
    text-transform: uppercase;
    color: #c8a97e;
    display: block;
    margin-bottom: 12px;
  }

  .orders-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(32px, 4vw, 52px);
    font-weight: 300;
    color: #f0ece4;
    margin-bottom: 52px;
  }

  .orders-title::after {
    content: '';
    display: block;
    width: 40px;
    height: 1px;
    background: #c8a97e;
    margin-top: 16px;
  }

  .orders-empty {
    text-align: center;
    padding: 100px 20px;
    border: 1px solid #2a2a2a;
    background: #161616;
  }

  .orders-empty-icon {
    font-size: 36px;
    margin-bottom: 16px;
    opacity: 0.2;
  }

  .orders-empty p {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-style: italic;
    color: #444;
  }

  .orders-list {
    display: flex;
    flex-direction: column;
    gap: 1px;
    background: #2a2a2a;
    border: 1px solid #2a2a2a;
  }

  .order-card {
    background: #161616;
    padding: 28px 32px;
    transition: background 0.2s ease;
  }

  .order-card:hover { background: #1a1a1a; }

  .order-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 12px;
  }

  .order-id {
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #555;
  }

  .order-date {
    font-size: 12px;
    color: #444;
    margin-top: 4px;
  }

  .order-status {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 14px;
    font-size: 9px;
    letter-spacing: 2.5px;
    text-transform: uppercase;
    border: 1px solid #2a2a2a;
    color: #c8a97e;
    border-color: #c8a97e44;
    background: rgba(200,169,126,0.06);
  }

  .order-status::before {
    content: '';
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #c8a97e;
    display: block;
  }

  .order-products {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding-top: 16px;
    border-top: 1px solid #1e1e1e;
  }

  .order-product-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
  }

  .order-product-name {
    color: #888;
    font-weight: 300;
  }

  .order-product-qty {
    font-size: 11px;
    color: #444;
    margin-left: 8px;
  }

  .order-product-price {
    font-family: 'Cormorant Garamond', serif;
    font-size: 16px;
    color: #c8a97e;
  }

  .order-total-row {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #2a2a2a;
  }

  .order-total-label {
    font-size: 10px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #555;
  }

  .order-total-value {
    font-family: 'Cormorant Garamond', serif;
    font-size: 24px;
    font-weight: 300;
    color: #f0ece4;
  }
`;

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("https://skinify-backend-wmf4.onrender.com/api/orders/my", {
  headers: { Authorization: `Bearer ${token}` },
});
        const data = await res.json();
        setOrders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div className="orders-page">
        <span className="orders-tag">Account</span>
        <h1 className="orders-title">My Orders</h1>

        {loading ? (
          <div className="orders-empty">
            <p style={{ fontStyle: "normal", fontSize: "13px", color: "#444", letterSpacing: "2px" }}>
              Loading...
            </p>
          </div>
        ) : orders.length === 0 ? (
          <div className="orders-empty">
            <div className="orders-empty-icon">✦</div>
            <p>No orders yet</p>
          </div>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <div>
                    <p className="order-id">Order #{order._id?.slice(-8).toUpperCase()}</p>
                    <p className="order-date">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric", month: "long", year: "numeric"
                      })}
                    </p>
                  </div>
                  <span className="order-status">{order.status || "Processing"}</span>
                </div>

                <div className="order-products">
                  {order.products?.map((item, i) => (
                    <div key={i} className="order-product-row">
                      <span className="order-product-name">
                        {item.productId?.name || "Product"}
                        <span className="order-product-qty">× {item.quantity}</span>
                      </span>
                      <span className="order-product-price">
                        ₹{(item.productId?.price || 0) * item.quantity}
                      </span>
                    </div>
                  ))}
                  <div className="order-total-row">
                    <span className="order-total-label">Total Paid</span>
                    <span className="order-total-value">₹{order.totalAmount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default Orders;
