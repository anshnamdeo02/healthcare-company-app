# Healthcare Company App

A production-ready full-stack healthcare web application with patient and doctor authentication, role-based access control, encrypted data storage, and integrated email notifications.

## Tech Stack

### Frontend
- **React 19** (Vite)
- **TailwindCSS v4**
- **React Router v6**
- **Axios** (HTTP client)
- **React Hook Form + Zod** (form validation)

### Backend
- **Node.js** + **Express.js**
- **PostgreSQL** + **Prisma ORM**
- **JWT** authentication
- **bcryptjs** password hashing
- **AES-256-GCM** encryption (Aadhaar)
- **Multer** + **Cloudinary** (file uploads)
- **Nodemailer** (SMTP email)
- **Helmet** + **express-rate-limit** + **CORS**

## Project Structure

```
healthcare-company-app/
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── api/           # Axios instance
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # Auth context
│   │   ├── pages/         # Page components
│   │   ├── App.jsx        # Route definitions
│   │   └── main.jsx       # Entry point
│   ├── index.html
│   └── vite.config.js
│
├── server/                 # Express Backend
│   ├── prisma/
│   │   ├── schema.prisma  # Database schema
│   │   └── seed.js        # Sample data
│   ├── src/
│   │   ├── config/        # DB, Cloudinary, Email config
│   │   ├── controllers/   # Route handlers
│   │   ├── middleware/     # Auth, upload, validation, error handling
│   │   ├── routes/        # API route definitions
│   │   ├── services/      # Business logic
│   │   ├── utils/         # Encryption, JWT, masking
│   │   ├── validators/    # Zod schemas
│   │   ├── app.js         # Express app setup
│   │   └── server.js      # Entry point
│   └── .env.example
│
└── README.md
```

## Prerequisites

- **Node.js** 18+ (recommended: 20 or 22 LTS)
- **PostgreSQL** 13+ running locally or remotely
- **Cloudinary** account (for file uploads)
- **SMTP** email credentials (Gmail, SendGrid, Mailtrap, etc.)

## Setup Instructions

### 1. Clone the Repository

```bash
cd healthcare-company-app
```

### 2. Setup the Backend

```bash
cd server

# Install dependencies
npm install

# Copy environment file and configure it
cp .env.example .env
# Edit .env with your actual database URL, JWT secret, Cloudinary keys, SMTP credentials

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init

# Seed sample data
npm run prisma:seed

# Start development server
npm run dev
```

The server will start at `http://localhost:5000`.

### 3. Setup the Frontend

```bash
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

The client will start at `http://localhost:5173`.

### 4. Environment Variables

Copy `server/.env.example` to `server/.env` and fill in:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for JWT signing (min 32 chars) |
| `JWT_EXPIRES_IN` | Token expiry (e.g., `7d`) |
| `AES_ENCRYPTION_KEY` | 64-character hex string (32 bytes) for Aadhaar encryption |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `SMTP_HOST` | SMTP server host |
| `SMTP_PORT` | SMTP port (587 or 465) |
| `SMTP_USER` | SMTP username/email |
| `SMTP_PASS` | SMTP password/app password |
| `COMPANY_EMAIL` | Email to receive registration notifications |
| `CLIENT_URL` | Frontend URL (default: `http://localhost:5173`) |
| `PORT` | Server port (default: `5000`) |

## Test Credentials (Seed Data)

| Role | Email | Password | Status |
|---|---|---|---|
| Admin | admin@healthcare.com | Admin@123 | Active |
| Patient | rahul@example.com | Patient@123 | Active |
| Patient | ananya@example.com | Patient@123 | Active |
| Doctor | priya@hospital.com | Doctor@123 | APPROVED |
| Doctor | ankur@hospital.com | Doctor@123 | PENDING |

## Key Features

### Security
- **Password hashing** with bcrypt (12 salt rounds)
- **AES-256-GCM** encryption for Aadhaar numbers
- **JWT** authentication with role-based access
- **Helmet** security headers
- **Rate limiting** on login endpoints (5 attempts / 15 min)
- **CORS** configured for frontend origin only
- **Aadhaar masking** in all API responses (XXXX-XXXX-1234)
- All secrets in `.env` — never exposed in responses

### Authentication
- Patient signup/login with full validation
- Doctor signup with file uploads (photo + certificate)
- Doctor accounts require admin approval before login
- Forgot/reset password with email link
- Admin login (seeded account only)

### Files
- Upload via Multer (memory storage)
- Validated: JPG, PNG, PDF only, max 5MB
- Stored securely in Cloudinary
- URLs saved in database

### Email
- HTML-formatted notification emails on every registration
- Patient emails include all details (Aadhaar masked)
- Doctor emails include details + document URLs
- Password reset emails with time-limited links

### Dashboard
- Patient greeting with profile data
- Timeline-based prescription history
- Follow-up tracking with status indicators
- Real data fetched via JWT-protected APIs

## Available Scripts

### Server
| Script | Description |
|---|---|
| `npm run dev` | Start server with auto-reload |
| `npm start` | Start production server |
| `npm run prisma:generate` | Generate Prisma client |
| `npm run prisma:migrate` | Run database migrations |
| `npm run prisma:seed` | Seed sample data |
| `npm run prisma:studio` | Open Prisma Studio (DB GUI) |

### Client
| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |

## API Documentation

See [API_DOCS.md](./API_DOCS.md) for complete API reference.

## Deployment

This app can be deployed for **free** using:
- **Frontend**: Vercel (never sleeps, fast CDN)
- **Backend**: Render (free tier)
- **Database**: Neon PostgreSQL (free 3GB)

📖 **See [DEPLOYMENT.md](./DEPLOYMENT.md) for complete step-by-step deployment guide**

Quick links:
- [Vercel](https://vercel.com) - Frontend hosting
- [Render](https://render.com) - Backend hosting
- [Neon](https://neon.tech) - PostgreSQL database

