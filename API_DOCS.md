# Healthcare API Documentation

**Base URL:** `http://localhost:5000/api/v1`

All responses follow the format:
```json
{
  "success": true|false,
  "message": "Description",
  "data": { ... }
}
```

---

## Health Check

### `GET /api/v1/health`
Check if the API is running.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Healthcare API is running",
  "timestamp": "2026-03-01T00:00:00.000Z"
}
```

---

## Patient Endpoints

### `POST /api/v1/patient/signup`
Register a new patient.

**Body:**
```json
{
  "name": "Rahul Sharma",
  "age": 32,
  "gender": "Male",
  "mobile": "9876543210",
  "email": "rahul@example.com",
  "address": "123, MG Road, New Delhi",
  "emergencyContact": "9876543211",
  "aadhaar": "123456789012",
  "password": "Patient@123",
  "confirmPassword": "Patient@123"
}
```

**Validation Rules:**
- `name`: 2-100 characters
- `age`: integer, 1-150
- `gender`: Male | Female | Other
- `mobile`: 10-digit Indian number starting with 6-9
- `email`: valid email, unique
- `aadhaar`: exactly 12 digits
- `password`: min 8 chars, 1 uppercase, 1 lowercase, 1 number

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Patient registered successfully.",
  "data": {
    "id": "uuid",
    "name": "Rahul Sharma",
    "age": 32,
    "gender": "Male",
    "mobile": "9876543210",
    "email": "rahul@example.com",
    "address": "123, MG Road, New Delhi",
    "emergencyContact": "9876543211",
    "aadhaar": "XXXX-XXXX-9012",
    "createdAt": "2026-03-01T00:00:00.000Z"
  }
}
```

**Side Effect:** Sends HTML notification email to company email.

---

### `POST /api/v1/patient/login`
Authenticate a patient. **Rate limited:** 5 attempts per 15 minutes.

**Body:**
```json
{
  "email": "rahul@example.com",
  "password": "Patient@123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Login successful.",
  "data": {
    "token": "eyJhbGciOi...",
    "patient": {
      "id": "uuid",
      "name": "Rahul Sharma",
      "email": "rahul@example.com",
      "aadhaar": "XXXX-XXXX-9012"
    }
  }
}
```

---

### `POST /api/v1/patient/forgot-password`
Request a password reset email.

**Body:**
```json
{
  "email": "rahul@example.com"
}
```

**Response:** `200 OK` (always returns success to prevent email enumeration)
```json
{
  "success": true,
  "message": "If an account with this email exists, a password reset link has been sent."
}
```

---

### `POST /api/v1/patient/reset-password`
Reset password using the emailed token.

**Body:**
```json
{
  "token": "reset-jwt-token",
  "password": "NewPassword@1",
  "confirmPassword": "NewPassword@1"
}
```

**Response:** `200 OK`

---

### `GET /api/v1/patient/dashboard`
Get patient dashboard data.

**Auth:** Bearer token (patient role)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "profile": {
      "id": "uuid",
      "name": "Rahul Sharma",
      "aadhaar": "XXXX-XXXX-9012",
      "..."
    },
    "currentSymptoms": [
      { "id": 1, "name": "Persistent cough", "severity": "moderate", "reportedAt": "2026-02-20" }
    ],
    "currentFollowUp": {
      "doctorName": "Dr. Priya Mehta",
      "scheduledDate": "2026-03-10",
      "status": "scheduled"
    },
    "prescriptionsCount": 3,
    "followupsCount": 3
  }
}
```

---

### `GET /api/v1/patient/prescriptions`
Get patient prescription history.

**Auth:** Bearer token (patient role)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "doctorName": "Dr. Priya Mehta",
      "date": "2026-01-15",
      "diagnosis": "Upper Respiratory Infection",
      "medications": [
        { "name": "Amoxicillin 500mg", "dosage": "3 times daily", "duration": "7 days" }
      ],
      "notes": "Rest and hydration recommended."
    }
  ]
}
```

---

### `GET /api/v1/patient/followups`
Get patient follow-up history.

**Auth:** Bearer token (patient role)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "doctorName": "Dr. Priya Mehta",
      "scheduledDate": "2026-01-25",
      "status": "completed",
      "notes": "Patient recovered well."
    }
  ]
}
```

---

## Doctor Endpoints

### `POST /api/v1/doctor/signup`
Register a new doctor. Uses `multipart/form-data` for file uploads.

**Form Fields:**
| Field | Type | Required |
|---|---|---|
| name | text | Yes |
| age | number | Yes |
| gender | text (Male/Female/Other) | Yes |
| email | email | Yes |
| specialization | text | Yes |
| registrationNumber | text | Yes |
| registrationState | text | Yes |
| hospital | text | Yes |
| experience | number | Yes |
| patientsTreated | number | Yes |
| password | text | Yes |
| confirmPassword | text | Yes |
| photo | file (jpg/png/pdf, max 5MB) | No |
| certificate | file (jpg/png/pdf, max 5MB) | No |

**Response:** `201 Created`
```json
{
  "success": true,
  "message": "Doctor registration submitted successfully. Your account is pending admin approval.",
  "data": {
    "id": "uuid",
    "name": "Dr. Priya Mehta",
    "email": "priya@hospital.com",
    "specialization": "General Medicine",
    "approvalStatus": "PENDING"
  }
}
```

**Side Effect:** Sends HTML notification email to company email with doctor details and document URLs.

---

### `POST /api/v1/doctor/login`
Authenticate a doctor. **Rate limited.** Only works if `approvalStatus === APPROVED`.

**Body:**
```json
{
  "email": "priya@hospital.com",
  "password": "Doctor@123"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOi...",
    "doctor": {
      "id": "uuid",
      "name": "Dr. Priya Mehta",
      "specialization": "General Medicine",
      "approvalStatus": "APPROVED"
    }
  }
}
```

**Error (PENDING):** `403 Forbidden`
```json
{
  "success": false,
  "message": "Your account is pending approval. Please wait for admin verification."
}
```

---

## Admin Endpoints

### `POST /api/v1/admin/login`
Authenticate admin.

**Body:**
```json
{
  "email": "admin@healthcare.com",
  "password": "Admin@123"
}
```

**Response:** `200 OK`

---

### `PATCH /api/v1/admin/doctor/:id/approve`
Approve a doctor registration.

**Auth:** Bearer token (admin role)

**URL Param:** `id` — Doctor UUID

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Doctor approved successfully.",
  "data": {
    "id": "uuid",
    "name": "Dr. Ankur Singh",
    "email": "ankur@hospital.com",
    "approvalStatus": "APPROVED"
  }
}
```

---

## Error Responses

### Validation Error: `400`
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Enter a valid email address" }
  ]
}
```

### Unauthorized: `401`
```json
{
  "success": false,
  "message": "Authentication required. Please provide a valid token."
}
```

### Forbidden: `403`
```json
{
  "success": false,
  "message": "You do not have permission to perform this action."
}
```

### Conflict: `409`
```json
{
  "success": false,
  "message": "A patient with this email already exists."
}
```

### Rate Limited: `429`
```json
{
  "success": false,
  "message": "Too many login attempts. Please try again after 15 minutes."
}
```
