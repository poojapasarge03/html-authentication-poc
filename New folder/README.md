# MERN + MySQL Auth & CRUD

## Quick Start

### 1. Database
Make sure MySQL is running locally.

### 2. Backend
```bash
cd backend
npm install
# Edit .env with your MySQL credentials and email settings
npm run dev
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

App runs at: http://localhost:5173  
API runs at: http://localhost:5000

---

## API Endpoints

### Auth — `/api/auth`
| Method | Path | Description |
|--------|------|-------------|
| POST | `/register` | Register user |
| POST | `/login` | Login |
| GET | `/me` | Get current user (protected) |
| POST | `/forgot-password` | Send reset email |
| POST | `/reset-password/:token` | Reset password |

### Items — `/api/items` (all protected)
| Method | Path | Description |
|--------|------|-------------|
| GET | `/` | Get all items |
| GET | `/stats` | Get dashboard stats |
| POST | `/` | Create item |
| PUT | `/:id` | Update item |
| DELETE | `/:id` | Delete item |

---

## Environment Variables (backend/.env)
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=mern_auth_db
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
CLIENT_URL=http://localhost:5173
```

> For Gmail, use an [App Password](https://myaccount.google.com/apppasswords) instead of your real password.
