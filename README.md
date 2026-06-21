# 🛒 TeyzixMarket — Multi-Vendor Service Marketplace

A full-stack freelance marketplace platform where customers can browse
services, hire providers, and track project progress.
Similar to Fiverr and Upwork.

---

## 🔗 Live Demo
- 🌐 Frontend: teyzix-market.vercel.app
- ⚙️ Backend:  "teyzix-market-production.up.railway.app"

---

## 🛠️ Tech Stack

### Frontend
- React.js + Vite
- Tailwind CSS
- Axios
- React Router DOM

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- JWT + Cookie Authentication
- Cloudinary (Image Upload)
- Bcrypt (Password Hashing)

---

## ✨ Features

- ✅ User Authentication (Register/Login/Logout)
- ✅ Role Based Access Control
  - 👤 Customer — Browse, Request, Review
  - 💼 Provider — Create Services, Manage Projects
  - 🛡️ Admin — Manage Users, Services, Requests
- ✅ Service Listings (Create/Edit/Delete)
- ✅ Service Search & Filter by Category
- ✅ Service Request System
- ✅ Project Status Tracking
  - Pending → Accepted → In Progress → Completed → Delivered
- ✅ Reviews & Ratings System
- ✅ Provider Profile & Portfolio
- ✅ Image Upload via Cloudinary
- ✅ Responsive Design (Mobile/Tablet/Desktop)
- ✅ Customer Dashboard
- ✅ Provider Dashboard
- ✅ Admin Dashboard

---

## 🚀 Installation & Setup

### 1. Clone Repository
\`\`\`bash
git clone https://github.com/esharajpoot156-max/Teyzix-Market.git
cd Teyzix-Market
\`\`\`

### 2. Backend Setup
\`\`\`bash
cd Backend
npm install
\`\`\`

Create `.env` file in Backend folder:
\`\`\`
MONGO_URI= mongodb+srv://esharajpoot156_db_user:task123@cluster0.69akoxu.mongodb.net/myDatabase?retryWrites=true&w=majority
JWT_SECRET= hasjhduyasudkjnejkw
PORT=5000
CLOUDINARY_CLOUD_NAME= dhhscwhg0
CLOUDINARY_API_KEY= 416885528175211
CLOUDINARY_API_SECRET= Atvh1Ob3CEkQuQkMANs1SRqtfxo
\`\`\`

\`\`\`bash
npm run dev
\`\`\`

### 3. Frontend Setup
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

---

## 📁 Project Structure

\`\`\`
Teyzix-Market/
├── Backend/
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── service.controller.js
│   │   ├── request.controller.js
│   │   ├── review.controller.js
│   │   └── profile.controller.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── upload.middleware.js
│   ├── models/
│   │   ├── user.model.js
│   │   ├── service.model.js
│   │   ├── request.model.js
│   │   ├── review.model.js
│   │   └── profile.model.js
│   ├── routes/
│   │   ├── auth.route.js
│   │   ├── user.route.js
│   │   ├── service.route.js
│   │   ├── request.route.js
│   │   ├── review.route.js
│   │   └── profile.route.js
│   ├── utilis/
│   │   ├── db.js
│   │   └── cloudinary.js
│   └── index.js
│
└── frontend/
    └── src/
        ├── api/
        │   └── axiosInstance.js
        ├── components/
        │   └── Navbar.jsx
        ├── context/
        │   └── AuthContext.jsx
        ├── pages/
        │   ├── auth/
        │   │   ├── Login.jsx
        │   │   └── Register.jsx
        │   ├── customer/
        │   │   ├── BrowseServices.jsx
        │   │   ├── ServiceDetail.jsx
        │   │   └── Dashboard.jsx
        │   ├── provider/
        │   │   ├── Dashboard.jsx
        │   │   └── CreateService.jsx
        │   ├── admin/
        │   │   └── Dashboard.jsx
        │   └── Profile.jsx
        └── routes/
            └── AppRoutes.jsx
\`\`\`

---

## 📡 API Documentation

### 🔐 Auth Routes
| Method | Endpoint           | Description   | Access  |
|--------|--------------------|---------------|---------|
| POST   | /api/auth/register | Register user | Public  |
| POST   | /api/auth/login    | Login user    | Public  |
| POST   | /api/auth/logout   | Logout user   | Private |

### 👤 User Routes
| Method | Endpoint        | Description    | Access   |
|--------|-----------------|----------------|----------|
| GET    | /api/users/:id  | Get profile    | Public   |
| PUT    | /api/users/:id  | Update profile | Private  |
| DELETE | /api/users/:id  | Delete account | Private  |
| GET    | /api/users      | Get all users  | Admin    |

### 🛠️ Service Routes
| Method | Endpoint           | Description      | Access   |
|--------|--------------------|------------------|----------|
| GET    | /api/services      | Get all services | Public   |
| POST   | /api/services      | Create service   | Provider |
| GET    | /api/services/:id  | Get one service  | Public   |
| PUT    | /api/services/:id  | Update service   | Provider |
| DELETE | /api/services/:id  | Delete service   | Provider |

### 📋 Request Routes
| Method | Endpoint                | Description           | Access   |
|--------|-------------------------|-----------------------|----------|
| POST   | /api/requests           | Create request        | Customer |
| GET    | /api/requests/my        | My requests           | Customer |
| GET    | /api/requests/provider  | Provider requests     | Provider |
| PUT    | /api/requests/:id       | Update status         | Provider |
| GET    | /api/requests           | All requests          | Admin    |

### ⭐ Review Routes
| Method | Endpoint          | Description    | Access   |
|--------|-------------------|----------------|----------|
| POST   | /api/reviews      | Create review  | Customer |
| GET    | /api/reviews/:id  | Get reviews    | Public   |
| DELETE | /api/reviews/:id  | Delete review  | Customer |

### 👤 Profile Routes
| Method | Endpoint                      | Description      | Access  |
|--------|-------------------------------|------------------|---------|
| GET    | /api/profiles/:userId         | Get profile      | Public  |
| PUT    | /api/profiles                 | Update profile   | Private |
| POST   | /api/profiles/portfolio       | Add portfolio    | Private |
| DELETE | /api/profiles/portfolio/:id   | Delete portfolio | Private |

---

## 🗄️ Database Schema

### User Model
\`\`\`
username    String  required
email       String  required unique
password    String  required (hashed)
role        String  customer/provider/admin
phoneNumber String
img         String  (Cloudinary URL)
isSeller    Boolean
\`\`\`

### Service Model
\`\`\`
providerId    ObjectId  ref: User
title         String    required
description   String    required
category      String    enum
price         Number    required
deliveryTime  Number    required
tags          [String]
images        [String]  Cloudinary URLs
rating        Number    default: 0
totalReviews  Number    default: 0
isActive      Boolean   default: true
\`\`\`

### Request Model
\`\`\`
customerId    ObjectId  ref: User
providerId    ObjectId  ref: User
serviceId     ObjectId  ref: Service
requirements  String    required
budget        Number    required
deadline      Date      required
status        String    Pending/Accepted/In Progress/Completed/Delivered
acceptedAt    Date
deliveredAt   Date
\`\`\`

### Review Model
\`\`\`
customerId  ObjectId  ref: User
providerId  ObjectId  ref: User
serviceId   ObjectId  ref: Service
requestId   ObjectId  ref: Request
rating      Number    1-5
comment     String    required
\`\`\`

### Profile Model
\`\`\`
userId       ObjectId  ref: User
bio          String
skills       [String]
experience   String
portfolio    [{title, description, image}]
socialLinks  {linkedin, github, website}
\`\`\`

---

## 🔒 Security Features

- JWT Authentication with HTTP-only Cookies
- Password Hashing with Bcrypt
- Role Based Access Control
- CORS Protection
- Input Validation

---

## 👩‍💻 Developer Info

| Field      | Detail                        |
|------------|-------------------------------|
| Developer  | Esha Rajpoot                  |
| Internship | Teyzix Core — June Batch 2026 |
| Task ID    | FSWD-1                        |
| Domain     | Full Stack Web Development    |

---

## 📞 Contact

- GitHub: https://github.com/esharajpoot156-max
- Email: esharajpoot156@gmail.com