# Skinify 🌿
### AI-Powered Skincare & Wellness E-Commerce Platform

> Upload a photo. Let AI detect your skin concern. Shop products made for you.

![Skinify](https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1200&auto=format&fit=crop&q=80)

---

## ✨ Features

- **AI Skin Analysis** — Upload a face, hair, or body photo; Claude AI detects your concern and recommends matching products
- **Smart Product Recommendations** — Products filtered by AI-detected concern (acne, dryness, hairfall, etc.)
- **Category Browsing** — Browse by Skincare, Haircare, or Weight Loss
- **Cart & Checkout** — Full cart management with quantity controls, COD and Prepaid order types
- **Order History** — View all past orders with status and product breakdown
- **JWT Authentication** — Secure login/register with protected routes
- **ImageKit CDN** — Fast, optimized image delivery for all product and user images
- **Luxury Dark UI** — Editorial aesthetic with Cormorant Garamond typography and gold accents

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js (Vite) |
| Styling | Custom CSS — Cormorant Garamond + DM Sans |
| HTTP Client | Axios |
| Backend | Node.js + Express.js |
| Database | MongoDB (Mongoose) |
| Authentication | JWT (jsonwebtoken) |
| AI Engine | Anthropic Claude API |
| Image CDN | ImageKit.io |
| State Management | React Context API |

---

## 📁 Project Structure

```
skinify/
│
├── client/                     # React frontend (Vite)
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js        # Axios instance with base URL
│   │   ├── assets/
│   │   │   └── logo.png
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Navbar.css
│   │   │   └── ProductCard.jsx
│   │   ├── context/
│   │   │   └── CartContext.jsx
│   │   └── pages/
│   │       ├── Home.jsx
│   │       ├── Home.css
│   │       ├── Products.jsx
│   │       ├── AIUpload.jsx
│   │       ├── Cart.jsx
│   │       ├── Checkout.jsx
│   │       ├── Orders.jsx
│   │       ├── Login.jsx
│   │       └── Register.jsx
│   └── index.html
│
└── server/                     # Node.js + Express backend
    ├── models/
    │   ├── User.js
    │   ├── Product.js
    │   └── Order.js
    ├── routes/
    │   ├── auth.js
    │   ├── products.js
    │   ├── orders.js
    │   ├── ai.js
    │   └── imagekit.js
    ├── middleware/
    │   └── authMiddleware.js
    └── index.js
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- Anthropic API key
- ImageKit account (Public Key, Private Key, URL Endpoint)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/skinify.git
cd skinify
```

---

### 2. Setup the Backend

```bash
cd server
npm install
```

Create a `.env` file in `/server`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
ANTHROPIC_API_KEY=your_anthropic_api_key
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
```

Start the backend:

```bash
npm run dev
```

---

### 3. Setup the Frontend

```bash
cd client
npm install
```

Create a `.env` file in `/client`:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm run dev
```

App runs at `http://localhost:5173`

---

## 🤖 How the AI Works

1. User uploads an image on the `/ai` page
2. Image is uploaded to **ImageKit CDN** for storage
3. Base64 image is sent to `/api/ai/analyze`
4. Backend forwards the image to **Anthropic Claude API** with a structured prompt
5. Claude returns a detected concern (e.g. `acne`, `dryness`, `hairfall`)
6. Backend queries **MongoDB** for products matching that concern
7. Frontend renders the concern label + matched product grid

```js
// Example Claude prompt
"Analyze this skin/hair image. Return only JSON: { concern: string }"
```

---

## 🗺 Routes

| Route | Description |
|-------|-------------|
| `GET /api/products` | Fetch all products |
| `GET /api/products?category=Skincare` | Filter by category |
| `POST /api/auth/register` | Register new user |
| `POST /api/auth/login` | Login, returns JWT |
| `POST /api/ai/analyze` | AI skin analysis |
| `POST /api/orders` | Place an order (protected) |
| `GET /api/orders/my` | Get user's orders (protected) |
| `GET /api/imagekit/auth` | ImageKit auth token |

---

## 📦 Sample Product Schema

```js
{
  name: "Niacinamide Serum 10%",
  price: 499,
  image: "https://ik.imagekit.io/...",
  category: "Skincare",      // Skincare | Haircare | Weight Loss
  concern: "acne"            // Matched by AI analysis
}
```

---

## 🖥 Pages Overview

| Page | Path | Description |
|------|------|-------------|
| Home | `/home` | Hero slider + best sellers + footer |
| Products | `/products` | Category-filtered product catalog |
| AI Recommend | `/ai` | Upload image → AI analysis → recommendations |
| Cart | `/cart` | Cart with qty controls + order summary |
| Checkout | `/checkout` | Address form + COD/Prepaid toggle |
| Orders | `/orders` | Order history with status badges |
| Login | `/login` | JWT authentication |
| Register | `/register` | New user registration |

---

## 🔐 Authentication Flow

```
Register → POST /api/auth/register → MongoDB stores hashed password
Login    → POST /api/auth/login    → Returns JWT token
          → Stored in localStorage
          → Sent as Authorization: Bearer <token> on protected routes
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Background | `#0e0e0e` |
| Card | `#161616` |
| Border | `#2a2a2a` |
| Gold Accent | `#c8a97e` |
| Text Primary | `#f0ece4` |
| Text Muted | `#888888` |
| Display Font | Cormorant Garamond |
| Body Font | DM Sans |

---

## 📸 Screenshots

> _Add your own screenshots here after running the project locally._

---

## 🚀 Deployment

| Service | Platform |
|---------|----------|
| Frontend | Vercel / Netlify |
| Backend | Render / Railway |
| Database | MongoDB Atlas |
| Images | ImageKit.io CDN |

---

## 📄 License

This project is built for academic purposes as part of the BSc Computer Science final year project at R.D. & S.H. National College, Bandra, Mumbai (2025–2026).

---

## 👤 Author

**Aryan Ramvilas Vishwakarma**
- GitHub: [@your-username](https://github.com/your-username)
- Project Guide: Prof. Vipul Saluja
- Institution: R.D. & S.H. National College, Bandra, Mumbai

---

<p align="center">Made with 🤎 in Mumbai</p>
