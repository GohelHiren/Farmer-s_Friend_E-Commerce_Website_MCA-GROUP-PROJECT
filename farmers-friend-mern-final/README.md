# Farmer's Friend — MERN (Final)

## 🌾 Project Abstract
**Farmer’s Friend** is a MERN stack web application for a digital farmer’s marketplace focused on Gujarat. Farmers can buy **fertilizers, seeds, pesticides, and organics** with detailed information and **real product images**. The platform supports **user accounts** (browse, cart, checkout, orders) and a **separate admin dashboard** to manage products, orders, users, and view **revenue insights with charts**.

## ✨ Features
- **User Website**
  - Market (products with images), Product details, Cart, Checkout, Orders
  - Register/Login (JWT)
- **Admin Dashboard** (`/admin`)
  - Stats cards (Products, Orders, Users, Revenue)
  - Charts: Orders Trend (line), Sales by Category (pie), Revenue by Day (bar)
  - Products CRUD (image URL or Cloudinary-ready), Orders management, Users list

## 🧱 Tech Stack
- **Server**: Node.js 18 LTS, Express, MongoDB (Mongoose), JWT, Jest + Supertest
- **Client**: React (Vite), Tailwind CSS, Recharts
- **CI**: GitHub Actions (Node 18)

## 🚀 Setup
### 1) Server
```bash
cd server
cp .env.example .env
# (optional) edit MONGODB_URI if needed
npm install
npm run seed
npm run dev
```
API: http://localhost:5000

### 2) Client
```bash
cd client
npm install
npm run dev
```
Web: http://localhost:5173

### 3) Logins
- **Admin:** `admin@farmersfriend.com` / `admin123`
- **User:** Register from the website

## 🌱 Seed Data
Run `npm run seed` in **server** to insert:
- Categories: Fertilizers, Seeds, Pesticides, Organic, Tools
- Gujarat-specific products (with **real images**)
- Admin user + demo user
- Sample orders for charts

## 📸 Screenshots (sample images)
**Market Page**  
![Market](https://5.imimg.com/data5/SELLER/Default/2022/10/YN/EM/OU/43039134/urea-fertilizer-500x500.jpg)

**Product Details**  
![Product](https://5.imimg.com/data5/SELLER/Default/2021/2/KK/IS/QN/117316248/dap-fertilizer-50kg-bag.jpg)

**Admin Dashboard (Stats + Charts)**  
![Charts](https://dummyimage.com/800x400/eeeeee/111111&text=Dashboard+Charts)

## 🧪 Tests (server)
```bash
cd server
npm test
```

## 🔁 GitHub Actions CI
`.github/workflows/node.js.yml` runs server tests on every push to `main` using **Node 18**.

## 🔧 Future Improvements
- Payments (Razorpay/Stripe), delivery slots, multi-language (Gujarati), Cloudinary image uploads.
