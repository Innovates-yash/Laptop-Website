# VOLTEX — How to Run This Project

## Prerequisites
- Node.js version: 18.x or higher
- PostgreSQL version: 14.x or higher
- npm version: 9.x or higher

## First Time Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Set up environment variables

The `.env` file should already exist. Verify it contains these values:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/voltex"
NEXTAUTH_SECRET="your-secret-key-here-minimum-32-characters-long"
NEXTAUTH_URL="http://localhost:3000"

# Payment (Optional - for testing payments)
RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"

# Cloudinary (Optional - for image uploads)
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Email (Optional - for sending emails)
RESEND_API_KEY="your_resend_api_key"
```

**Important:** Update the `DATABASE_URL` with your PostgreSQL credentials.

### 3. Set up the database

```bash
# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed the database with sample data
npx prisma db seed
```

### 4. Run the development server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

**Note:** If you see any errors after the fixes, delete the `.next` folder and restart:
```bash
# Windows Command Prompt
rmdir /s /q .next
npm run dev

# Mac/Linux
rm -rf .next
npm run dev
```

---

## Test Accounts (after seeding)

| Role     | Email                    | Password  |
|----------|--------------------------|-----------|
| Admin    | admin@voltex.com         | Admin@123 |
| Employee | john.doe@voltex.com      | Employee@123 |
| Employee | jane.smith@voltex.com    | Employee@123 |

---

## How the Website Works

### Customer Flow
1. Visit `/` to see the homepage with 3D floating laptop
2. Click "Products" in navbar to browse all laptops
3. Click any laptop card to see full detail page
4. Click "Add to Cart" to add items to cart
5. Visit `/cart` to review items
6. Select payment method (Razorpay or Stripe)
7. Complete payment (test mode)
8. Redirected to `/order-success` with order confirmation

### Employee Flow
1. Go to `/employee/login`
2. Login with employee credentials
3. Dashboard shows: sales summary, purchase summary, enquiries count
4. **Sales page** (`/employee/sales`): Log new sales, view all your sales records
5. **Purchases page** (not yet implemented): Log new purchases from suppliers
6. **Enquiries page** (not yet implemented): View and respond to customer enquiries

### Admin Flow
1. Go to `/login` (or `/employee/login`)
2. Login with admin credentials
3. Access `/employee/dashboard` (admin has same access as employees)
4. **Note:** Full admin panel (`/admin/dashboard`, `/admin/products`) not yet implemented

### 3D Features
- **Homepage hero**: 3D laptop floats and rotates, particle field with mouse interaction
- **Scroll animation**: Laptop moves right and scales down as you scroll
- **Product cards**: Each card has a live 3D preview that rotates faster on hover
- **Custom cursor**: Changes appearance when hovering over links, buttons, and 3D canvases
- **Page transitions**: Smooth fade/slide animations between pages
- **Performance**: Only renders 3D when in viewport, max 8 WebGL contexts, mobile fallbacks

---

## Common Issues & Fixes

### Database connection error
**Problem:** `Error: Can't reach database server`

**Solution:**
1. Make sure PostgreSQL is running
2. Check `DATABASE_URL` in `.env` matches your PostgreSQL credentials
3. Test connection: `npx prisma db push`

### "Module not found" error
**Problem:** Missing dependencies

**Solution:**
```bash
npm install
```

### Prisma client error
**Problem:** `@prisma/client did not initialize yet`

**Solution:**
```bash
npx prisma generate
```

### Auth not working
**Problem:** Login fails or redirects incorrectly

**Solution:**
1. Make sure `NEXTAUTH_SECRET` is set in `.env` and is at least 32 characters
2. Make sure `NEXTAUTH_URL` is set to `http://localhost:3000`
3. Restart the dev server after changing `.env`

### Seed data not showing
**Problem:** No products or users in database

**Solution:**
```bash
npx prisma db seed
```

Then verify in Prisma Studio:
```bash
npx prisma studio
```

### 3D models not loading
**Problem:** Product cards show emoji instead of 3D models

**Solution:** This is expected behavior! The site uses:
- Procedural 3D models (generated from code, not GLB files)
- Emoji fallback on mobile devices for performance
- The 3D laptop on homepage and product cards are fully functional

### PowerShell script execution error (Windows)
**Problem:** `running scripts is disabled on this system`

**Solution:** Use Command Prompt instead of PowerShell:
1. Press `Win + R`
2. Type `cmd` and press Enter
3. Navigate to project: `cd path\to\voltex`
4. Run: `npm run dev`

---

## Project Structure

```
/app                  → All pages (Next.js App Router)
  /api                → Backend API routes
  /employee           → Employee panel pages
  /admin              → Admin panel pages (not yet implemented)
/components
  /ui                 → Reusable UI components
  /3d                 → Three.js / React Three Fiber components
  /layout             → Navbar, Footer, PageTransition
  /payment            → Payment components (Razorpay, Stripe)
  /products           → Product-related components
/lib                  → Prisma client, auth config, utilities
/prisma               → Database schema and seed script
/public
  /models             → 3D model GLB files (optional)
/store                → Zustand state stores (cart, canvas)
/types                → TypeScript type definitions
```

---

## Available Scripts

```bash
# Development
npm run dev              # Start dev server at localhost:3000

# Build
npm run build            # Create production build
npm run start            # Start production server

# Database
npx prisma generate      # Generate Prisma client
npx prisma db push       # Push schema to database
npx prisma db seed       # Seed database with sample data
npx prisma studio        # Open Prisma Studio (database GUI)
npx prisma migrate dev   # Create and apply migrations

# Linting
npm run lint             # Run ESLint
```

---

## What's Working

✅ Homepage with 3D hero laptop and particle field
✅ Product listing with 3D product cards
✅ Product detail pages
✅ Shopping cart with Zustand persistence
✅ Customer registration and login
✅ Employee login and dashboard
✅ Employee sales tracking
✅ Contact form
✅ Payment integration (Razorpay & Stripe)
✅ Order success page
✅ Custom cursor (desktop only)
✅ Page transitions
✅ Responsive design (mobile/tablet/desktop)
✅ Performance optimizations (WebGL context management, reduced motion support)

## What's Not Yet Implemented

❌ Admin dashboard (`/admin/dashboard`)
❌ Admin product management (`/admin/products`)
❌ Employee purchases page (`/employee/purchases`)
❌ Employee enquiries page (`/employee/enquiries`)
❌ 360° product viewer with hotspots
❌ Product detail animated reveal
❌ Real GLB model loading (using procedural models instead)

---

## Troubleshooting Checklist

If something isn't working, go through this checklist:

- [ ] PostgreSQL is running
- [ ] `.env` file exists and has correct values
- [ ] `DATABASE_URL` matches your PostgreSQL credentials
- [ ] `NEXTAUTH_SECRET` is set (at least 32 characters)
- [ ] Ran `npm install`
- [ ] Ran `npx prisma generate`
- [ ] Ran `npx prisma db push`
- [ ] Ran `npx prisma db seed`
- [ ] Dev server is running (`npm run dev`)
- [ ] No errors in terminal
- [ ] Browser console shows no red errors (F12 → Console)

---

## Getting Help

If you encounter issues:

1. Check the browser console (F12 → Console tab) for errors
2. Check the terminal where `npm run dev` is running for errors
3. Verify database connection: `npx prisma studio`
4. Check that all environment variables are set correctly in `.env`
5. Try restarting the dev server

---

**Last Updated:** April 7, 2026
**Status:** All critical errors fixed, 3D animations functional, ready for use
