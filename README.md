# ⚡ VOLTEX - Premium Laptop E-Commerce Platform

<div align="center">

![VOLTEX](https://img.shields.io/badge/VOLTEX-E--Commerce-00e5ff?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![React Three Fiber](https://img.shields.io/badge/React_Three_Fiber-3D-orange?style=for-the-badge)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=for-the-badge&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14-blue?style=for-the-badge&logo=postgresql)

A modern, high-performance e-commerce platform for premium laptops featuring stunning 3D visualizations, real-time animations, and seamless payment integration.

[Live Demo](#) • [Documentation](#documentation) • [Features](#features) • [Quick Start](#quick-start)

</div>

---

## 🎯 Features

### 🎨 3D Visualization & Animations
- **Interactive 3D Hero Laptop** - Floating animation with particle field and mouse interaction
- **Live 3D Product Cards** - Real-time 3D previews with hover effects
- **Scroll-Triggered Animations** - GSAP-powered smooth transitions
- **Custom Cursor** - Context-aware cursor that changes on hover
- **Page Transitions** - Smooth fade/slide animations between pages
- **Performance Optimized** - WebGL context management, lazy loading, reduced motion support

### 🛒 E-Commerce Features
- **Full Shopping Cart** - Add, remove, update quantities with Zustand state management
- **Product Catalog** - Browse laptops with filtering and search
- **Product Details** - Detailed specifications, images, and 3D previews
- **Secure Checkout** - Multi-step checkout process
- **Order Management** - Track orders and view order history

### 💳 Payment Integration
- **Razorpay** - Indian payment gateway with UPI, cards, wallets
- **Stripe** - International payment processing
- **Test Mode** - Fully functional test environment

### 👥 Multi-Role Authentication
- **Customer Portal** - Registration, login, order tracking
- **Employee Dashboard** - Sales tracking, order management
- **Admin Panel** - Product management, user management (partial)
- **NextAuth.js** - Secure authentication with JWT

### 📊 Employee Features
- **Dashboard** - Sales overview, recent activity, statistics
- **Sales Management** - Log sales, view sales history
- **Real-time Updates** - Live data synchronization

### 📱 Responsive Design
- **Mobile-First** - Optimized for all screen sizes
- **Touch-Friendly** - Gesture support for mobile devices
- **Progressive Enhancement** - Graceful degradation for older browsers

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18.x or higher
- **PostgreSQL** 14.x or higher
- **npm** 9.x or higher

### Installation

```bash
# Clone the repository
git clone https://github.com/Innovates-yash/Laptop-Website.git
cd Laptop-Website/voltex

# Install dependencies
npm install

# Setup database
npx prisma generate
npx prisma db push
npx prisma db seed

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔑 Test Accounts

After running `npx prisma db seed`:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@voltex.com | Admin@123 |
| **Employee** | john.doe@voltex.com | Employee@123 |
| **Employee** | jane.smith@voltex.com | Employee@123 |

---

## ⚙️ Environment Setup

Create a `.env` file in the `voltex` directory:

```env
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/voltex"

# Authentication
NEXTAUTH_SECRET="your-secret-key-minimum-32-characters-long"
NEXTAUTH_URL="http://localhost:3000"

# Payment (Optional - for testing)
RAZORPAY_KEY_ID="your_razorpay_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_key_secret"
STRIPE_SECRET_KEY="your_stripe_secret_key"
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="your_stripe_publishable_key"

# Cloudinary (Optional - for image uploads)
CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_api_key"
CLOUDINARY_API_SECRET="your_api_secret"

# Email (Optional - for notifications)
RESEND_API_KEY="your_resend_api_key"
```

**Note:** Update `DATABASE_URL` with your PostgreSQL credentials.

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript 5.3
- **Styling:** Tailwind CSS
- **3D Graphics:** React Three Fiber, Three.js
- **Animations:** GSAP, Framer Motion
- **State Management:** Zustand
- **Forms:** React Hook Form + Zod

### Backend
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** NextAuth.js
- **API:** Next.js API Routes

### Payments
- **Razorpay:** Indian payment gateway
- **Stripe:** International payments

### DevOps
- **Version Control:** Git
- **Package Manager:** npm
- **Deployment:** Vercel (recommended)

---

## 📁 Project Structure

```
voltex/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication endpoints
│   │   ├── employee/             # Employee endpoints
│   │   ├── payment/              # Payment endpoints
│   │   ├── products/             # Product endpoints
│   │   └── webhooks/             # Payment webhooks
│   ├── cart/                     # Shopping cart page
│   ├── contact/                  # Contact page
│   ├── employee/                 # Employee portal
│   │   ├── dashboard/            # Employee dashboard
│   │   ├── login/                # Employee login
│   │   └── sales/                # Sales management
│   ├── login/                    # Customer login
│   ├── order-success/            # Order confirmation
│   ├── products/                 # Product pages
│   │   └── [slug]/               # Product detail
│   ├── register/                 # Customer registration
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Homepage
│   └── globals.css               # Global styles
├── components/
│   ├── 3d/                       # Three.js components
│   │   ├── HeroLaptop.tsx        # Hero 3D laptop
│   │   ├── ProductCard3D.tsx     # 3D product cards
│   │   └── ProceduralLaptop.tsx  # Procedural laptop model
│   ├── layout/                   # Layout components
│   │   ├── Navbar.tsx            # Navigation bar
│   │   ├── Footer.tsx            # Footer
│   │   └── PageTransition.tsx    # Page transitions
│   ├── payment/                  # Payment components
│   │   ├── RazorpayButton.tsx    # Razorpay integration
│   │   ├── StripeForm.tsx        # Stripe form
│   │   └── StripeWrapper.tsx     # Stripe provider
│   ├── products/                 # Product components
│   │   └── ProductFilters.tsx    # Product filters
│   └── ui/                       # UI components
│       ├── CustomCursor.tsx      # Custom cursor
│       ├── LoadingScreen.tsx     # Loading screen
│       └── Skeletons.tsx         # Skeleton loaders
├── lib/
│   ├── auth.ts                   # NextAuth configuration
│   └── prisma.ts                 # Prisma client
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── seed.ts                   # Database seeding
├── store/
│   ├── cartStore.ts              # Cart state management
│   └── canvasStore.ts            # Canvas state management
├── types/
│   └── next-auth.d.ts            # NextAuth types
├── public/                       # Static assets
├── .env                          # Environment variables
├── .env.example                  # Environment template
├── .gitignore                    # Git ignore rules
├── next.config.js                # Next.js configuration
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
└── package.json                  # Dependencies
```

---

## 📚 Documentation

- **[START.md](START.md)** - Quick 4-step setup guide
- **[WINDOWS-SETUP.md](WINDOWS-SETUP.md)** - Windows-specific instructions
- **[HOWTORUN.md](HOWTORUN.md)** - Complete setup and troubleshooting guide
- **[QUICK-START.md](QUICK-START.md)** - 3-minute quick start
- **[FIXES-COMPLETE.md](FIXES-COMPLETE.md)** - Recent bug fixes and improvements
- **[ERROR-FIXES-APPLIED.md](ERROR-FIXES-APPLIED.md)** - Technical fix documentation

---

## 🎮 Usage

### Customer Flow
1. Browse products on homepage or products page
2. Click product card to view details
3. Add items to cart
4. Proceed to checkout
5. Select payment method (Razorpay/Stripe)
6. Complete payment
7. View order confirmation

### Employee Flow
1. Login at `/employee/login`
2. View dashboard with sales statistics
3. Log new sales in Sales page
4. View sales history
5. Track performance metrics

### Admin Flow
1. Login with admin credentials
2. Access employee dashboard
3. Manage products (coming soon)
4. View all orders (coming soon)

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Manual Deployment

```bash
# Build for production
npm run build

# Start production server
npm start
```

---

## 🧪 Testing

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Open Prisma Studio (database GUI)
npx prisma studio
```

---

## 🐛 Troubleshooting

### Database Connection Error
```bash
# Verify PostgreSQL is running
# Update DATABASE_URL in .env
npx prisma db push
```

### Module Not Found
```bash
npm install
npx prisma generate
```

### Port Already in Use
```bash
# Kill process on port 3000
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
```

### 3D Models Not Loading
- This is expected! The project uses procedural 3D models (generated from code)
- No GLB files needed
- Emoji fallbacks on mobile for performance

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Yash**
- GitHub: [@Innovates-yash](https://github.com/Innovates-yash)
- Repository: [Laptop-Website](https://github.com/Innovates-yash/Laptop-Website)

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- React Three Fiber for 3D capabilities
- Prisma for the excellent ORM
- Vercel for hosting platform
- All open-source contributors

---

## 📊 Project Status

✅ **Core Features:** Complete
✅ **3D Animations:** Complete
✅ **Payment Integration:** Complete
✅ **Authentication:** Complete
✅ **Employee Dashboard:** Complete
🚧 **Admin Panel:** In Progress
🚧 **Advanced Analytics:** Planned

---

## 🔮 Roadmap

- [ ] Complete admin panel
- [ ] Advanced product filtering
- [ ] Wishlist functionality
- [ ] Product reviews and ratings
- [ ] Email notifications
- [ ] Advanced analytics dashboard
- [ ] Mobile app (React Native)
- [ ] AI-powered product recommendations

---

<div align="center">

**Built with ⚡ by VOLTEX Team**

If you found this project helpful, please give it a ⭐!

[Report Bug](https://github.com/Innovates-yash/Laptop-Website/issues) • [Request Feature](https://github.com/Innovates-yash/Laptop-Website/issues)

</div>
