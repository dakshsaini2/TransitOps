# 🚚 TransitOps – Smart Transport Operations Platform

A full-stack Transport Management System (TMS) built for an **8-hour hackathon** using **FastAPI** and **React**. The platform digitizes transport operations by managing vehicles, drivers, trips, maintenance, fuel expenses, and operational analytics through a modern web dashboard.

---

## 📖 Overview

TransitOps helps logistics companies replace spreadsheets and manual record keeping with a centralized digital platform.

The system enables administrators, dispatchers, and managers to efficiently manage transport operations while enforcing business rules and providing real-time insights.

---

## ✨ Features

### 🔐 Authentication & Authorization
- JWT Authentication
- Role-Based Access Control (Admin, Dispatcher, Fleet Manager)
- Secure Password Hashing
- Login & Logout

### 🚛 Vehicle Management
- Add, Update, Delete Vehicles
- Vehicle Status
  - Available
  - In Transit
  - Maintenance
- Vehicle Search & Filters

### 👨‍✈️ Driver Management
- Driver Registration
- License Details
- License Expiry Tracking
- Driver Availability Status

### 📦 Trip Management
- Create Trips
- Assign Driver
- Assign Vehicle
- Route Management
- Trip Status
- Delivery Tracking

### 🛠 Maintenance Management
- Schedule Maintenance
- Maintenance History
- Cost Tracking
- Vehicle Service Records

### ⛽ Fuel & Expense Management
- Fuel Logs
- Expense Tracking
- Cost Reports
- Monthly Expenses

### 📊 Dashboard & Analytics
- Total Vehicles
- Active Drivers
- Trips Completed
- Revenue Overview
- Fuel Consumption
- Maintenance Cost
- Interactive Charts

### 📄 Reports
- CSV Export
- PDF Reports
- Operational Summary

---

# 🏗 Tech Stack

## Backend

- FastAPI
- SQLAlchemy
- Alembic
- SQLite
- JWT Authentication
- Pydantic
- Uvicorn

## Frontend

- React
- Vite
- Tailwind CSS
- Axios
- React Router
- Recharts

## Database

- SQLite

---

# 📂 Project Structure

```
TransitOps/
│
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── auth/
│   │   ├── database/
│   │   ├── models/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── utils/
│   │   └── main.py
│   │
│   ├── uploads/
│   ├── alembic/
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

# ⚙ Installation

## Clone Repository

```bash
git clone https://github.com/yourusername/TransitOps.git

cd TransitOps
```

---

# Backend Setup

### Create Virtual Environment

```bash
python -m venv venv
```

### Activate

Windows

```bash
venv\Scripts\activate
```

Linux/Mac

```bash
source venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run Backend

```bash
uvicorn app.main:app --reload
```

Backend runs on

```
http://localhost:8000
```

---

# Frontend Setup

Move into frontend

```bash
cd frontend
```

Install packages

```bash
npm install
```

Run

```bash
npm run dev
```

Frontend runs on

```
http://localhost:5173
```

---

# API Documentation

FastAPI automatically generates API documentation.

Swagger UI

```
http://localhost:8000/docs
```

ReDoc

```
http://localhost:8000/redoc
```

---

# Database

Default database

```
SQLite
```

Migration

```bash
alembic upgrade head
```

---

# Security

- JWT Authentication
- Password Hashing (bcrypt)
- Protected APIs
- Role-Based Authorization
- Input Validation
- Secure Environment Variables

---

# Dashboard

The dashboard provides:

- Vehicle Overview
- Driver Overview
- Active Trips
- Maintenance Alerts
- Fuel Expenses
- Revenue Analytics
- Recent Activities
- Charts & Reports

---

# Future Improvements

- Live GPS Tracking
- Route Optimization
- Email Notifications
- SMS Alerts
- AI-Based Predictive Maintenance
- Mobile Application
- Barcode/QR Scanning
- Cloud Deployment
- Multi-Tenant Support

---

# Screenshots

```
Add screenshots here

docs/images/dashboard.png

docs/images/login.png

docs/images/vehicles.png

docs/images/trips.png
```

---

# Contributors

- **Daksh Saini**
- **Ankit Tangariya**
- **Devansh Saini**
- **Akash Bisht**
- Hackathon Team

---

# License

This project is developed for educational and hackathon purposes.

---

# Acknowledgements

- FastAPI
- React
- SQLAlchemy
- Tailwind CSS
- Vite
- Open Source Community

---

## ⭐ Support

If you like this project, don't forget to **⭐ Star** the repository.

Happy Coding! 🚀# TransitOps
