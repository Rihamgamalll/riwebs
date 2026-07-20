# Riham's Beauty — Full Stack E-commerce (Local Development)

A complete, production-ready skincare e-commerce platform built with React, Node.js/Express, and MySQL.

## Tech Stack

- **Frontend**: React 18, Vite, TypeScript, Tailwind CSS, React Router, Axios, Lucide React
- **Backend**: Node.js, Express.js, MySQL (mysql2), JWT Authentication, bcrypt
- **Database**: MySQL with full schema, indexes, and sample data

## Features

### Customer Features
- Home page with animated hero, product sections (Popular, New Arrivals, Best Sellers, Offers), Categories, Shop by Skin Type
- Products page with sidebar filters (skin type, product type, skin concern, price, category, in-stock), sorting, search
- Product details with multiple images, description, ingredients, how-to-use, reviews, similar products
- Shopping cart with quantity management and coupon codes
- Checkout with full shipping form and payment methods (COD, Vodafone Cash, InstaPay)
- Authentication (register/login with JWT + bcrypt)
- My Account, My Orders, Favorites
- Categories, About Us, Contact Us

### Admin Dashboard
- Dashboard stats (orders, sales, customers, top products, low stock)
- Product management (CRUD with image upload)
- Order management (search, filter, status updates)
- Customer list
- Coupon management (CRUD)
- Category management (CRUD)

### Security
- JWT authentication with 7-day expiry
- bcrypt password hashing
- Role-based access control (user/admin)
- Input validation on all endpoints
- SQL injection protection (parameterized queries via mysql2)
- CORS configuration
- Error handling middleware

## Project Structure

```
project/
├── backend/
│   ├── controllers/     # Route controllers
│   ├── routes/           # Express route definitions
│   ├── middleware/       # Auth, admin, upload, validation, error
│   ├── config/           # Database configuration
│   ├── uploads/products/ # Uploaded product images
│   ├── utils/            # JWT utilities
│   ├── app.js            # Express app entry point
│   ├── package.json      # Backend dependencies
│   ├── schema.sql        # MySQL database schema + sample data
│   └── .env.example      # Backend environment variables
├── src/
│   ├── components/       # Reusable UI components
│   ├── context/          # Auth and Cart context providers
│   ├── lib/              # API client, Supabase, utilities
│   ├── pages/            # Page components
│   ├── types/            # TypeScript types and constants
│   ├── App.tsx           # Main app with routing
│   └── main.tsx          # Entry point
├── .env.example          # Frontend environment variables
└── package.json          # Frontend dependencies
```

## Prerequisites

- **Node.js** 18+
- **MySQL** 8.0+ (or MariaDB 10.5+)

## Installation & Setup

### 1. Database Setup

Start MySQL, then import the schema:

```bash
# Log into MySQL
mysql -u root -p

# Import the schema
mysql -u root -p < backend/schema.sql
```

Or run it from MySQL Workbench / phpMyAdmin by opening `backend/schema.sql` and executing it.

This creates the `rihams_beauty` database with all tables, indexes, and sample data (including an admin user, 10 products, 8 categories, and a sample coupon).

### 2. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MySQL credentials if needed
npm run dev
```

The backend runs on `http://localhost:5000`.

### 3. Frontend Setup

```bash
# From the project root
npm install
cp .env.example .env
npm run dev
```

The frontend runs on `http://localhost:5173`.

### 4. Admin Access

A default admin account is created in the schema:
- **Email**: `admin@rihamsbeauty.com`
- **Password**: `admin123`

Use these credentials to log in and access the Admin Dashboard at `/admin`.

## Environment Variables

### Backend (`backend/.env`)
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=rihams_beauty
PORT=5000
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:5173
```

### Frontend (`.env`)
```
VITE_API_URL=http://localhost:5000/api
```

## API Endpoints

### Auth
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login
- `GET /api/auth/profile` — Get current user profile (auth required)
- `PUT /api/auth/profile` — Update profile (auth required)

### Products
- `GET /api/products` — List products (supports query params: search, category, skin_type, product_type, concern, min_price, max_price, in_stock, sort, limit, offset)
- `GET /api/products/section/:section` — Get products by section (popular, new, bestseller, offers)
- `GET /api/products/:slug` — Get product by slug
- `GET /api/products/:slug/similar` — Get similar products
- `POST /api/products` — Create product (admin)
- `PUT /api/products/:id` — Update product (admin)
- `DELETE /api/products/:id` — Delete product (admin)

### Categories
- `GET /api/categories` — List all categories
- `POST /api/categories` — Create category (admin)
- `PUT /api/categories/:id` — Update category (admin)
- `DELETE /api/categories/:id` — Delete category (admin)

### Orders
- `GET /api/orders` — List orders (user sees own, admin sees all)
- `GET /api/orders/:id` — Get order by ID
- `POST /api/orders` — Create order
- `PUT /api/orders/:id/status` — Update order status (admin)
- `DELETE /api/orders/:id` — Delete order (admin)

### Favorites
- `GET /api/favorites` — List user's favorites (auth required)
- `POST /api/favorites` — Add favorite (auth required)
- `DELETE /api/favorites/:productId` — Remove favorite (auth required)
- `GET /api/favorites/check/:productId` — Check if product is favorited (auth required)

### Reviews
- `GET /api/reviews/:productId` — List reviews for a product
- `POST /api/reviews/:productId` — Add review (auth required)
- `DELETE /api/reviews/:id` — Delete review (auth required, owner or admin)

### Coupons
- `GET /api/coupons` — List all coupons (admin)
- `GET /api/coupons/active` — List active coupons
- `GET /api/coupons/validate/:code` — Validate a coupon code
- `POST /api/coupons` — Create coupon (admin)
- `PUT /api/coupons/:id` — Update coupon (admin)
- `DELETE /api/coupons/:id` — Delete coupon (admin)

### Admin
- `GET /api/admin/dashboard` — Dashboard stats (admin)
- `GET /api/admin/customers` — List all customers (admin)
- `GET /api/admin/notifications` — List notifications (admin)
- `PUT /api/admin/notifications/:id/read` — Mark notification as read (admin)

### Upload
- `POST /api/upload/product` — Upload product image (admin, multipart/form-data)

### Contact
- `POST /api/contact` — Send contact message

## Order Flow

When a customer confirms an order:
1. Order is saved with auto-generated order number (RB-XXXX format)
2. Product stock is automatically decremented (transaction-safe)
3. A notification is created in the admin dashboard
4. A WhatsApp message is generated with full order details

## NPM Install Commands

```bash
# Backend
cd backend && npm install

# Frontend
npm install
```

## Running the Project

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
npm run dev
```

## License

Created for Riham's Beauty.
