# E-Commerce Website

A full-featured e-commerce storefront built with **Next.js 15**, **TypeScript**, and **Tailwind CSS**. Connects to a NestJS REST API backend.

## Tech Stack

- **Framework**: Next.js 15 (App Router) + React 19
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS + shadcn/ui (Radix UI primitives)
- **State**: Zustand (cart & favorites, persisted to localStorage)
- **Icons**: Lucide React + React Icons
- **Carousel**: Embla Carousel
- **Toasts**: Sonner
- **Dark Mode**: next-themes

## Features

- **OTP Authentication** — passwordless login via email OTP, cookie-based sessions, middleware-protected routes
- **Product Browsing** — search, filter by category/subcategory/price/size/sort, product detail pages
- **Shopping Cart** — add/remove/update items, stock validation, persistent drawer
- **Favorites / Wishlist** — persistent across sessions
- **Checkout & Orders** — coupon validation, order creation, order tracking, order history
- **Reviews** — view and submit product reviews
- **Home Page** — banner carousel, special combos, crazy deals, bestsellers, new arrivals, category showcase
- **Responsive** — mobile bottom navigation bar, desktop navbar

## Project Structure

```
app/                    # Next.js App Router pages & server actions
├── actions/            # auth, product, order, coupon, review
├── product/[id]/       # Product detail + reviews
├── category/[id]/      # Category listing
├── shop/               # Filtered shop page
├── checkout/           # Checkout flow
├── order/              # Order creation & detail
├── profile/            # User profile & order history
├── login/              # OTP login
└── track-order/        # Order tracking

components/             # Reusable UI components
├── home/               # Homepage sections
├── product/            # Product detail components
├── shop/               # Filter sidebar & button
├── ui/                 # shadcn/ui primitives
├── Navbar.tsx
├── CartDrawer.tsx
├── FavoritesDrawer.tsx
└── SearchModal.tsx

store/                  # Zustand stores (cart, favorites)
lib/                    # API client, config, utils
```

## Getting Started

### Prerequisites

- Node.js 20+
- Backend API running (see [Backend](#backend))

### Install & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:3005
```

For production, set:

```env
NEXT_PUBLIC_API_URL=https://backendecom.tanvirlab.com
```

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm start` | Start production server (port 3002) |
| `npm run lint` | Run ESLint |

## Backend

This frontend requires the companion NestJS backend API.

- **Production API**: `https://backendecom.tanvirlab.com`
- **Local default**: `http://localhost:3005`

Key API endpoints:

| Endpoint | Description |
|---|---|
| `POST /auth/send-otp` | Send login OTP |
| `POST /auth/verify-otp` | Verify OTP & create session |
| `GET /products` | List/search/filter products |
| `GET /categories` | Category navigation |
| `GET /offers/type/:type` | Promotional offers |
| `POST /orders` | Create order |
| `GET /coupons/validate` | Validate discount coupon |
| `GET /users/profile/:id` | User profile |

## Image Sources

Configured in `next.config.mjs`:

- `http://localhost:3001/uploads/**` (local dev)
- `http://backendecom.tanvirlab.com:3005/uploads/**` (production)
- `res.cloudinary.com` (CDN)
- `placehold.co` (placeholders)
