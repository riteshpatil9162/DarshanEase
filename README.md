# DarshanEase

**Online Temple Darshan Ticket Booking — Full Stack MERN Application**

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js (Vite), React Router DOM, Axios, Bootstrap, React Toastify |
| Backend | Node.js, Express.js |
| Database | MongoDB with Mongoose |
| Auth | JWT + bcryptjs |
| Payment | Razorpay |

---

## Project Structure

```
DarshanEase/
├── server/                     # Backend
│   ├── config/db.js
│   ├── controllers/            # authController, templeController, slotController, bookingController, donationController, paymentController
│   ├── models/                 # User, Temple, DarshanSlot, Booking, Donation
│   ├── routes/                 # authRoutes, templeRoutes, slotRoutes, bookingRoutes, donationRoutes, paymentRoutes
│   ├── middleware/             # authMiddleware, roleMiddleware
│   ├── utils/                  # razorpay.js, seed.js
│   ├── server.js
│   └── .env
│
├── client/                     # Frontend
│   └── src/
│       ├── context/AuthContext.jsx
│       ├── services/api.js
│       ├── components/         # Navbar, Footer, TempleCard, SlotCard, BookingModal, Skeleton
│       ├── pages/              # Home, Temples, TempleDetails, MyBookings, Login, Register, AdminDashboard
│       └── App.jsx
│
└── package.json                # Root (runs both servers)
```

---

## Getting Started

### 1. Clone & Install

```bash
git clone <repo>
cd DarshanEase

# Install root deps (concurrently)
npm install

# Install server & client deps
npm run install-all
```

### 2. Configure Environment

**server/.env**
```
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/darshanease
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d
RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXXXX
RAZORPAY_KEY_SECRET=XXXXXXXXXXXXXXXXXXXXXXXX
NODE_ENV=development
```

**client/.env**
```
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXXXX
```

### 3. Seed Sample Data (optional)

```bash
npm run seed
```

This creates 6 temples, demo slots, and 3 users:
- Admin: `admin@darshanease.com` / `admin123`
- Organizer: `organizer@darshanease.com` / `organizer123`
- User: `user@darshanease.com` / `user1234`

### 4. Run Development Servers

```bash
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

---

## Features

- User Registration / Login with JWT
- Role-based access (USER / ADMIN / ORGANIZER)
- Browse & search temples
- View available darshan slots by date
- Book darshan tickets with Razorpay payment
- Free darshan booking (no payment)
- Donation to temples via Razorpay
- Booking history with cancellation
- Admin: Temple CRUD + Slot CRUD + All bookings view
- Responsive design (mobile, tablet, desktop)
- Loading skeletons + toast notifications

---

## API Endpoints

| Method | Route | Access |
|--------|-------|--------|
| POST | `/api/auth/register` | Public |
| POST | `/api/auth/login` | Public |
| GET | `/api/auth/me` | Private |
| GET | `/api/temples` | Public |
| POST | `/api/temples` | Admin |
| PUT | `/api/temples/:id` | Admin |
| DELETE | `/api/temples/:id` | Admin |
| GET | `/api/slots/:templeId` | Public |
| POST | `/api/slots` | Admin/Organizer |
| PUT | `/api/slots/:id` | Admin/Organizer |
| DELETE | `/api/slots/:id` | Admin/Organizer |
| POST | `/api/bookings` | Private |
| GET | `/api/bookings/user` | Private |
| GET | `/api/bookings` | Admin |
| DELETE | `/api/bookings/:id` | Private |
| POST | `/api/donations` | Private |
| GET | `/api/donations` | Private |
| POST | `/api/payment/order` | Private |
| POST | `/api/payment/verify` | Private |

---

## Deployment

- **Frontend**: Vercel / Netlify
- **Backend**: Render / Railway
- **Database**: MongoDB Atlas
