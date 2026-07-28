# E-Commerce Store Backend API

This is the backend API for the e-commerce store application built with Next.js 13+ App Router, MongoDB, and NextAuth.js.

## API Endpoints

## Authentication

- `POST /api/register` - Register a new user
- `POST /api/login` - Login user
- `POST /api/logout` - Logout user
- `GET /api/session` - Get current user session

## User Profile

- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

## Products

- `GET /api/products` - Get all products (with pagination and filters)
- `GET /api/products/:id` - Get a single product
- `POST /api/products` - Create a new product (admin only)
- `PUT /api/products/:id` - Update a product (admin only)
- `DELETE /api/products/:id` - Delete a product (admin only)

## Shopping Cart

- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart` - Update item quantity in cart
- `DELETE /api/cart` - Remove item from cart

## Wishlist

- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist` - Add item to wishlist
- `DELETE /api/wishlist` - Remove item from wishlist

## Orders

- `GET /api/orders` - Get user's orders
- `POST /api/orders` - Create a new order
- `GET /api/orders/:id` - Get a single order
- `PUT /api/orders/:id` - Update order status (admin only)

## Admin Panel

- `GET /api/admin/users` - Get all users (admin only)
- `PUT /api/admin/users` - Update user role (admin only)
- `DELETE /api/admin/users` - Delete a user (admin only)

- `GET /api/admin/products` - Get all products (admin only)
- `POST /api/admin/products` - Create a new product (admin only)
- `PUT /api/admin/products` - Update a product (admin only)
- `DELETE /api/admin/products` - Delete a product (admin only)

- `GET /api/admin/orders` - Get all orders (admin only)
- `PUT /api/admin/orders` - Update order status (admin only)

## Database Seeding

To seed the database with sample data, run:

```bash
npm run seed
```

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_SECRET=your_nextauth_secret