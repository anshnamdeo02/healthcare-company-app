const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorHandler');

// Import routes
const patientRoutes = require('./routes/patient.routes');
const doctorRoutes = require('./routes/doctor.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

// ─── Security Middleware ──────────────────────────────────────────
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// ─── Body Parsers ─────────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Health Check ─────────────────────────────────────────────────
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Healthcare API is running',
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes (versioned) ──────────────────────────────────────
app.use('/api/v1/patient', patientRoutes);
app.use('/api/v1/doctor', doctorRoutes);
app.use('/api/v1/admin', adminRoutes);

// ─── 404 Handler ──────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.originalUrl} not found`,
  });
});

// ─── Global Error Handler (MUST be last) ──────────────────────────
app.use(errorHandler);

module.exports = app;
