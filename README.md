# 🚛 TransitOps - Smart Transport Operations Platform

TransitOps is a full-stack fleet management and transport operations platform developed for a hackathon. It helps organizations manage vehicles, drivers, trips, maintenance, fuel, expenses, and analytics through a centralized dashboard.

---

## 📌 Features

### 🔐 Authentication & Authorization
- Secure Login with Email & Password
- JWT Authentication
- Role-Based Access Control (RBAC)
- Protected Routes

### 🚗 Vehicle Management
- Add, Edit, Delete Vehicles
- Unique Registration Number Validation
- Vehicle Status Management
- Vehicle Search & Filters

### 👨‍✈️ Driver Management
- Driver CRUD Operations
- License Expiry Validation
- Driver Availability Tracking
- Safety Score Management

### 🚚 Trip Management
- Create & Manage Trips
- Vehicle and Driver Assignment
- Cargo Weight Validation
- Trip Lifecycle
  - Draft
  - Dispatched
  - Completed
  - Cancelled
- Automatic Vehicle & Driver Status Updates

### 🔧 Maintenance
- Vehicle Maintenance Records
- Automatic Vehicle Status Update (In Shop)
- Maintenance History

### ⛽ Fuel & Expense Management
- Fuel Log Tracking
- Maintenance Expenses
- Toll & Other Operational Expenses
- Total Operational Cost Calculation

### 📊 Dashboard & Reports
- Active Vehicles
- Available Vehicles
- Vehicles in Maintenance
- Active Trips
- Drivers On Duty
- Fleet Utilization
- Fuel Efficiency
- Operational Cost
- Vehicle ROI
- CSV Export

---

# 🛠 Tech Stack

## Frontend
- React 18
- Vite
- React Router DOM
- Axios
- Tailwind CSS
- React Hook Form
- Chart.js
- React Toastify

## Backend
- Node.js
- Express.js
- JWT Authentication
- bcrypt.js
- Express Validator

## Database
- MySQL

---

# 📂 Project Structure

```
TransitOps/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── services/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   ├── config/
│   ├── utils/
│   ├── app.js
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

# ⚙️ Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/TransitOps.git
cd TransitOps
```

---

## Backend Setup

Navigate to backend folder

```bash
cd backend
```

Install dependencies

```bash
npm install
```

Create a `.env` file

```env
PORT=5000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=transitops
DB_USER=root
DB_PASSWORD=your_password

JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=1d
```

Run backend

```bash
npm run dev
```

Backend will run on

```
http://localhost:5000
```

---

## Frontend Setup

Navigate to frontend

```bash
cd frontend
```

Install dependencies

```bash
npm install
```

Run development server

```bash
npm run dev
```

Frontend will run on

```
http://localhost:5173
```

---

# 🗄 Database

Create MySQL database

```sql
CREATE DATABASE transitops;
```

Import the provided SQL schema (if available).

---

# 🔄 Workflow

1. Login
2. Add Vehicles
3. Add Drivers
4. Create Trip
5. Dispatch Trip
6. Complete Trip
7. Add Fuel Log
8. Add Expenses
9. Schedule Maintenance
10. View Dashboard & Reports

---

# 📊 Business Rules

- Vehicle registration number must be unique.
- Retired or In Shop vehicles cannot be assigned to trips.
- Drivers with expired licenses cannot be assigned.
- Suspended drivers cannot be assigned.
- Cargo weight must not exceed vehicle capacity.
- Dispatching a trip marks both vehicle and driver as **On Trip**.
- Completing a trip restores both vehicle and driver to **Available**.
- Cancelling a dispatched trip restores vehicle and driver status.
- Active maintenance automatically changes vehicle status to **In Shop**.
- Closing maintenance restores vehicle status unless it is retired.

---

# 🚀 Future Enhancements

- PDF Report Export
- Email Notifications
- Vehicle Document Upload
- Dark Mode
- Advanced Analytics
- Live GPS Tracking
- Search & Advanced Filters

---

# 👥 Team

Developed as part of a Hackathon project.
-**Daksh Saini**
-**Ankit Tangariya**
-**Akash Bisht**
-**Devansh Muthmaare**
---

# 📄 License

This project is intended for educational and hackathon purposes.
