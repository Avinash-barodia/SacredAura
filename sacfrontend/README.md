# 🌿 SacredAura — Full-Stack E-Commerce Platform

SacredAura is a full-stack e-commerce web application for premium spiritual and wellness products. Built with React 19, Node.js/Express 5, and MongoDB, it features a complete shopping experience with admin controls, payment gateway integration, and real-time order management.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Overview](#-api-overview)
- [Admin Panel](#-admin-panel)
- [Scripts Reference](#-scripts-reference)

---

## ✨ Features

### 🛍️ Customer Features
- **Product Browsing** — Shop page with category filters, search, price sorting, and rating filters
- **Product Detail** — Full product page with image gallery, description, ratings & reviews
- **Shopping Cart** — Add/remove items, adjust quantities, persistent cart via context
- **Wishlist** — Save products for later
- **Checkout** — Multi-step checkout with saved address selection and new address form
- **Payment Methods** — Cash on Delivery (COD) and online payment via **Razorpay** (UPI, Cards, Netbanking)
- **Order Tracking** — View order history with live status updates (Pending → Confirmed → Shipped → Delivered)
- **Order Success Page** — Confirmation page with order ID after successful placement

### 🔐 Authentication & Account
- **JWT-based Authentication** — Secure login/signup with HttpOnly cookies
- **Forgot Password** — Email-based password reset flow via OTP/link
- **Reset Password** — Secure token-based password update
- **Account Settings** — Update profile info and change password
- **Saved Addresses** — Add, view, and manage multiple delivery addresses

### 🛠️ Admin Panel
- **Dashboard** — Overview of site statistics
- **Product Management** — Add, edit, delete products with Cloudinary image uploads
- **Category Management** — Create and manage product categories
- **Order Management** — View all orders and update order status
- **Homepage Management** — Edit featured products, hero banners, and live homepage sections
- **Site Settings** — Configure global site settings (branding, policies, etc.)
- **Protected Routes** — Admin routes secured via role-based access control

### 🏠 Homepage Sections
- **Hero Banner** — Dynamic hero section with call-to-action
- **Category Showcase** — Featured category cards linking to filtered shop
- **Premium Showcase** — Highlighted premium products
- **Promo Banners** — Promotional image banners
- **Customer Reviews** — Testimonials section
- **FAQ** — Frequently asked questions page

### 📄 Static Pages
- About Us
- Contact
- Terms & Conditions
- Privacy Policy
- Refund Policy
- Shipping Policy

---

## 🧰 Tech Stack

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **React** | 19.x | UI framework |
| **Vite** | 8.x | Build tool & dev server |
| **React Router DOM** | 6.x | Client-side routing |
| **MUI (Material UI)** | 7.x | UI components |
| **Framer Motion** | 12.x | Animations |
| **Axios** | 0.27.x | HTTP client |
| **React Icons** | 5.x | Icon library |
| **Lucide React** | 0.574.x | Additional icons |
| **Sentry** | 10.x | Frontend error monitoring |

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | 24.x | Runtime |
| **Express** | 5.x | Web framework |
| **MongoDB** | Atlas | Database |
| **Mongoose** | 9.x | ODM |
| **JSON Web Token** | 9.x | Authentication |
| **bcryptjs** | 3.x | Password hashing |
| **Cloudinary** | 2.x | Image hosting & uploads |
| **Multer** | 2.x | File upload middleware |
| **Razorpay** | 2.x | Payment gateway |
| **Nodemailer** | 8.x | Email (password reset) |
| **express-rate-limit** | 8.x | API rate limiting |
| **cookie-parser** | 1.x | Cookie handling |
| **Sentry** | 10.x | Backend error monitoring & profiling |
| **dotenv** | 17.x | Environment variable management |

---

## 📁 Project Structure

```
SacredAura/
├── sacbackend/                  # Node.js + Express API
│   ├── controllers/             # Business logic
│   │   ├── authController.js    # Login, signup, password reset
│   │   ├── productController.js # CRUD + Cloudinary image upload
│   │   ├── orderController.js   # Order placement & status updates
│   │   ├── paymentController.js # Razorpay order creation & verification
│   │   ├── cartController.js
│   │   ├── wishlistController.js
│   │   ├── addressController.js
│   │   ├── categoryController.js
│   │   ├── couponController.js
│   │   ├── settingsController.js
│   │   └── userController.js
│   ├── models/                  # Mongoose schemas
│   │   ├── User.js
│   │   ├── Product.js
│   │   ├── Order.js
│   │   ├── Cart.js
│   │   ├── Wishlist.js
│   │   ├── Address.js
│   │   ├── Category.js
│   │   ├── Coupon.js
│   │   └── SiteSettings.js
│   ├── routes/                  # API route definitions
│   ├── middleware/              # Auth middleware
│   ├── config/                  # DB & cloud config
│   ├── uploads/                 # Temporary file uploads
│   └── server.js                # Express app entry point
│
└── sacfrontend/                 # React + Vite app
    ├── public/                  # Static assets (favicon, manifest)
    ├── index.html               # Vite root HTML template
    ├── vite.config.js           # Vite configuration
    └── src/
        ├── Admin/               # Admin panel pages
        │   ├── AdminDashboard.jsx
        │   ├── AdminProduct.jsx
        │   ├── AdminCategory.jsx
        │   ├── AdminOrders.jsx
        │   ├── AdminHomeProducts.jsx
        │   └── AdminLiveHomePage.jsx
        ├── components/          # Reusable UI components
        │   ├── Hero.jsx
        │   ├── HomeCategorySection.jsx
        │   ├── PremiumShowcase.jsx
        │   ├── PromoBanners.jsx
        │   ├── CustomerReviews.jsx
        │   ├── ProtectedAdminRoute.jsx
        │   └── ...policy pages
        ├── context/             # Global state management
        │   ├── AuthContext.jsx  # User auth state
        │   └── CartContext.jsx  # Shopping cart state
        ├── Header/              # Navbar & Footer
        ├── Homepage/            # Home & Login/Signup pages
        ├── pages/               # Customer-facing pages
        │   ├── Shop.jsx
        │   ├── ProductDetail.jsx
        │   ├── Cart.jsx
        │   ├── Checkout.jsx
        │   ├── OrderSuccess.jsx
        │   ├── MyOrders.jsx
        │   ├── Wishlist.jsx
        │   ├── AccountSettings.jsx
        │   ├── SavedAddresses.jsx
        │   ├── ForgotPassword.jsx
        │   └── ResetPassword.jsx
        ├── utils/               # API client (axios instance)
        ├── App.jsx              # Root router component
        └── main.jsx             # Vite entry point
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+ (tested on v24)
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account (for image uploads)
- Razorpay account (for payments)

### 1. Clone the repository
```bash
git clone https://github.com/your-username/SacredAura.git
cd SacredAura
```

### 2. Set up the Backend
```bash
cd sacbackend
npm install
```

Create a `.env` file in `sacbackend/`:
```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password
SENTRY_DSN=your_sentry_dsn
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

Start the backend:
```bash
node server.js
# Server running on port 5000
# MongoDB Connected
```

### 3. Set up the Frontend
```bash
cd sacfrontend
npm install
```

Create a `.env` file in `sacfrontend/` (optional — for payment & monitoring):
```env
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
VITE_SENTRY_DSN=your_sentry_dsn
```

Start the frontend:
```bash
npm start
# Vite dev server running at http://localhost:3000
```

---

## 🔑 Environment Variables

> ⚠️ **Important:** Vite requires all frontend env vars to be prefixed with `VITE_` (not `REACT_APP_`). They are accessed via `import.meta.env.VITE_*`.

| Variable | Location | Description |
|---|---|---|
| `MONGO_URI` | Backend | MongoDB Atlas connection string |
| `JWT_SECRET` | Backend | Secret key for JWT signing |
| `CLOUDINARY_CLOUD_NAME` | Backend | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Backend | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Backend | Cloudinary API secret |
| `RAZORPAY_KEY_ID` | Backend | Razorpay key ID |
| `RAZORPAY_KEY_SECRET` | Backend | Razorpay secret key |
| `EMAIL_USER` | Backend | Gmail address for sending emails |
| `EMAIL_PASS` | Backend | Gmail app password |
| `SENTRY_DSN` | Backend | Sentry DSN for backend monitoring |
| `FRONTEND_URL` | Backend | Frontend URL for CORS (production) |
| `VITE_RAZORPAY_KEY_ID` | Frontend | Razorpay key for Razorpay.js SDK |
| `VITE_SENTRY_DSN` | Frontend | Sentry DSN for frontend monitoring |

---

## 📡 API Overview

All API endpoints are prefixed with `/api`.

| Resource | Base Route | Description |
|---|---|---|
| Auth | `/api/auth` | Register, login, logout, forgot/reset password |
| Products | `/api/products` | CRUD, search, filter, image upload |
| Categories | `/api/categories` | Category CRUD |
| Cart | `/api/cart` | Add, update, remove cart items |
| Wishlist | `/api/wishlist` | Add/remove/get wishlist |
| Orders | `/api/orders` | Place orders, get order history, update status |
| Payment | `/api/payment` | Create Razorpay order, verify payment signature |
| Addresses | `/api/address` | Add, get user addresses |
| Coupons | `/api/coupons` | Manage discount coupons |
| Users | `/api/users` | User profile management |
| Settings | `/api/settings` | Site-wide settings (admin) |

### Rate Limiting
- Order placement is rate-limited to **20 requests per 15 minutes** per IP.

---

## 🛡️ Admin Panel

Access the admin panel at `/admin`. Admin routes are protected via JWT role-based access control.

| Admin Page | Route | Description |
|---|---|---|
| Dashboard | `/admin` | Site overview & stats |
| Products | `/admin` → Products tab | Add/edit/delete products with image upload |
| Categories | `/admin` → Categories tab | Manage product categories |
| Orders | `/admin/orders` | View & update all orders |
| Homepage | `/admin` → Homepage tab | Manage featured/homepage products |
| Live Preview | `/admin` → Live tab | Preview homepage layout |

---

## 📝 Scripts Reference

### Frontend (`sacfrontend/`)
| Command | Description |
|---|---|
| `npm start` | Start Vite dev server at `http://localhost:3000` |
| `npm run dev` | Alias for `npm start` |
| `npm run build` | Build production bundle to `build/` |
| `npm run preview` | Preview production build locally |

### Backend (`sacbackend/`)
| Command | Description |
|---|---|
| `node server.js` | Start the API server on port 5000 |

---

## 🔧 Notable Architecture Decisions

- **Vite over CRA** — Migrated from Create React App to Vite for Node.js v24 compatibility and dramatically faster dev server startup
- **JWT + HttpOnly Cookies** — Secure auth with CSRF protection via cookie-based token storage
- **Cloudinary** — All product images are hosted on Cloudinary, not stored locally
- **Razorpay** — Payment signature verification is done server-side to prevent tampering
- **Rate Limiting** — Order API is rate-limited to prevent abuse
- **Sentry** — Both frontend and backend are instrumented for error tracking and performance profiling
- **Context API** — Global cart and auth state managed via React Context (no Redux needed)

---

## 📄 License

This project is private and proprietary.
