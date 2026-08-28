# Hospital Middleware

A TypeScript backend for a hospital patient lookup middleware with staff authentication, hospital scoping, and patient search logic.

## Features

- Staff creation and login
- Hospital-scoped patient search
- Hospital API integration layer for HIS records
- SQLite-backed persistence
- Docker Compose configuration for app and database services
- Pytest-based API tests

## Project structure

- `src/server.ts` — HTTP server entry point
- `src/routes/` — staff and patient route handlers
- `src/repositories/` — database access layer
- `src/services/` — HIS lookup logic
- `src/db/` — SQLite setup and seed data
- `tests/` — API tests

## Local setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Copy environment file:
   ```bash
   cp .env.example .env
   ```

3. Initialize database:
   ```bash
   npm run db:init
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

The service listens on port 3000 by default.

## API reference

### Create staff

Request:
```http
POST /staff/create
Content-Type: application/json

{
  "username": "staff_a",
  "password": "secret123",
  "hospital": "Hospital A"
}
```

Response:
```json
{
  "message": "Staff created successfully",
  "staff": {
    "id": 1,
    "username": "staff_a",
    "hospital": "Hospital A"
  }
}
```

### Staff login

Request:
```http
POST /staff/login
Content-Type: application/json

{
  "username": "staff_a",
  "password": "secret123",
  "hospital": "Hospital A"
}
```

Response:
```json
{
  "message": "Login successful",
  "token": "<token>",
  "staff": {
    "id": 1,
    "username": "staff_a",
    "hospital": "Hospital A"
  }
}
```

### Patient search

Request:
```http
GET /patient/search?national_id=110170000001
Authorization: Bearer <token>
```

Response:
```json
[
  {
    "id": 1,
    "first_name_th": "สมชาย",
    "middle_name_th": "",
    "last_name_th": "ใจดี",
    "first_name_en": "Somchai",
    "middle_name_en": "",
    "last_name_en": "Jaidee",
    "date_of_birth": "1990-05-12",
    "patient_hn": "HN-001",
    "national_id": "110170000001",
    "passport_id": null,
    "phone_number": "0812345678",
    "email": "somchai@example.com",
    "gender": "male"
  }
]
```

## Database design

### hospitals
- `id` (PK)
- `name` (unique)
- `code` (unique)
- `created_at`

### patients
- `id` (PK)
- `hospital_id` (FK -> hospitals.id)
- `first_name_th` 
- `middle_name_th`
- `last_name_th`
- `first_name_en`
- `middle_name_en`
- `last_name_en`
- `date_of_birth`
- `patient_hn`
- `national_id`
- `passport_id`
- `phone_number`
- `email`
- `gender`
- `created_at`
- `updated_at`

### staff
- `id` (PK)
- `username`
- `password_hash`
- `hospital_id` (FK -> hospitals.id)
- `created_at`

This structure preserves the staff-to-hospital-to-patient relationship required by the assignment.

## Docker

Run the application with Docker Compose:

```bash
docker compose up --build
```

The app will be exposed on port 3000.

## Running tests

```bash
pytest -q
```
