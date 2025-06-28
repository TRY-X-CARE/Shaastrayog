# ShaastraYog

## Overview
ShaastraYog is a wellness e-commerce platform built with Next.js, React, Express, and MongoDB. It offers products, classes, and personalized wellness services.

## Backend
- **backend/server.js**: Express server setup, connects to MongoDB, handles API routing.
- **backend/models/**: Mongoose schemas defining data structures for Product and User.
- **backend/routes/**: API endpoints, e.g., payment processing in `payment.js`.
- **backend/test-payment.js**: Script for testing payment functionality.

## Frontend
- **app/**: Next.js app directory containing pages and subdirectories for different site sections.
  - `admin/`: Admin dashboard pages and layouts.
  - `about/`, `contact/`, `login/`, `register/`, `profile/`: Informational and user account pages.
  - `cart/`, `checkout/`, `order-success/`: Shopping flow pages.
  - `product/[id]/`: Dynamic product detail pages.
  - `shop/`: Product listing page.
- **app/page.tsx**: Homepage with splash screen, carousel, featured products, and testimonials.
- **app/layout.tsx & app/globals.css**: Global layout and styles.

## Components
- **components/**: React components organized by feature.
  - `admin/`: Admin UI components like headers and layouts.
  - `auth/`: Authentication providers and components.
  - `cart/`: Cart context provider and components.
  - `layout/`: Site layout components including header, footer, and client layout.
  - `product/`: Product card component for displaying product info.
  - `providers.tsx`: Wraps app with theme, auth, cart providers, and toast notifications.
  - `splash-screen.tsx`: Splash screen component.
  - `ui/`: UI primitives and widgets (buttons, carousel, accordion, dialogs, forms, etc.).

## Hooks
- **hooks/**: Custom React hooks for managing authentication (`use-auth`), cart state (`use-cart`), and toast notifications (`use-toast`).

## Lib
- **lib/**: Utility files.
  - `data.ts`: Static data for product categories and featured products.
  - `types.ts`: TypeScript type definitions.
  - `utils.ts`: Helper utility functions.

## Config & Assets
- Config files: `next.config.js`, `tailwind.config.ts`, `tsconfig.json`, `postcss.config.js`, `package.json`.
- Public assets:
  - **public/images/**: Static images used in the app.
  - **public/videos/**: Video assets like mobile_splash and splash videos.

## Running the Project
```bash
npm install
npm run dev       # Start development server
npm run build     # Build for production
npm start         # Start production server

.
├── .gitignore
├── components.json
├── next.config.js
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.ts
├── tsconfig.json
├── app
│   ├── about
│   │   └── page.tsx
│   ├── admin
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── api
│   │   ├── auth
│   │   │   └── [...nextauth]
│   │   └── order
│   │       └── route.ts
│   ├── cart
│   │   └── page.tsx
│   ├── checkout
│   │   └── page.tsx
│   ├── contact
│   │   └── page.tsx
│   ├── login
│   │   └── page.tsx
│   ├── order-success
│   │   └── page.tsx
│   ├── page.tsx
│   ├── product
│   │   └── [id]
│   │       ├── ProductClient.tsx
│   │       └── page.tsx
│   ├── profile
│   │   └── page.tsx
│   ├── register
│   │   └── page.tsx
│   ├── shop
│   │   └── page.tsx
│   ├── globals.css
│   └── layout.tsx
├── backend
│   ├── models
│   │   ├── Product.js
│   │   └── User.js
│   ├── routes
│   │   └── payment.js
│   ├── server.js
│   └── test-payment.js
├── components
│   ├── admin
│   │   ├── AdminHeader.tsx
│   │   └── AdminLayout.tsx
│   ├── auth
│   │   └── auth-provider.tsx
│   ├── cart
│   │   └── cart-provider.tsx
│   ├── layout
│   │   ├── ClientLayout.tsx
│   │   ├── footer.tsx
│   │   └── header.tsx
│   ├── product
│   │   └── product-card.tsx
│   ├── providers.tsx
│   ├── splash-screen.tsx
│   └── ui
│       ├── accordion.tsx
│       ├── alert-dialog.tsx
│       ├── alert.tsx
│       ├── aspect-ratio.tsx
│       ├── avatar.tsx
│       ├── badge.tsx
│       ├── breadcrumb.tsx
│       ├── button.tsx
│       ├── calendar.tsx
│       ├── card.tsx
│       ├── carousel.tsx
│       ├── chart.tsx
│       ├── checkbox.tsx
│       ├── collapsible.tsx
│       ├── command.tsx
│       ├── context-menu.tsx
│       ├── dialog.tsx
│       ├── drawer.tsx
│       ├── dropdown-menu.tsx
│       ├── form.tsx
│       ├── hover-card.tsx
│       ├── input-otp.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── menubar.tsx
│       ├── navigation-menu.tsx
│       ├── pagination.tsx
│       ├── popover.tsx
│       ├── progress.tsx
│       ├── radio-group.tsx
│       ├── resizable.tsx
│       ├── scroll-area.tsx
│       ├── select.tsx
│       ├── separator.tsx
│       ├── sheet.tsx
│       ├── skeleton.tsx
│       ├── slider.tsx
│       ├── sonner.tsx
│       ├── switch.tsx
│       ├── table.tsx
│       ├── tabs.tsx
│       ├── textarea.tsx
│       ├── toast.tsx
│       ├── toaster.tsx
│       ├── toggle-group.tsx
│       ├── toggle.tsx
│       └── tooltip.tsx
├── hooks
│   ├── use-auth.tsx
│   ├── use-cart.tsx
│   └── use-toast.tsx
├── lib
│   ├── data.ts
│   ├── types.ts
│   └── utils.ts
├── out
├── public
│   ├── images
│   │   ├── 1.png
│   │   ├── 2.png
│   │   └── 1609px-Atharva-Veda_samhita_page_471_illustration.png
│   └── videos
│       ├── mobile_splash.mp4
│       └── splash.mp4
