# Hospital Middleware Documentation

## 1. Project Overview

This project implements a TypeScript backend service for a hospital patient middleware. The middleware is responsible for searching and displaying patient information from a Hospital Information System (HIS), while ensuring that staff can only access patients from the hospital assigned to them.

The system includes:

- Hospital-scoped staff authentication
- Patient search logic with filter support
- Database persistence for hospitals, staff, and patients
- HIS integration abstraction
- Test coverage for positive and negative scenarios

## 2. Technology Stack

- TypeScript
- Node.js
- Express.js
- SQLite via better-sqlite3
- Docker / Docker Compose
- Pytest for automated API tests

## 3. Core Business Requirements

### 3.1 Hospital API Search

The hospital HIS provides a route:

`GET https://hospital-a.api.co.th/patient/search/:id`

The `id` path can represent either:

- national_id
- passport_id

The response includes patient details such as:

- first_name_th
- middle_name_th
- last_name_th
- first_name_en
- middle_name_en
- last_name_en
- date_of_birth
- patient_hn
- national_id
- passport_id
- phone_number
- email
- gender

### 3.2 Staff-to-Hospital Restriction

Each staff member belongs to exactly one hospital. Patient searches must return only records belonging to the same hospital as the authenticated staff member.

Example:

- Staff A is assigned to Hospital A
- Staff A cannot search Hospital B patients
- Staff A cannot access Hospital B patient records even if the national ID or passport is known

## 4. Database Design

### 4.1 hospitals

| Field | Type | Description |
| --- | --- | --- |
| id | INTEGER PK | Hospital identifier |
| name | TEXT | Hospital name |
| code | TEXT | Unique hospital code |
| created_at | TEXT | Creation timestamp |

### 4.2 patients

| Field | Type | Description |
| --- | --- | --- |
| id | INTEGER PK | Patient identifier |
| hospital_id | INTEGER FK | Linked hospital |
| first_name_th | TEXT | Thai first name |
| middle_name_th | TEXT | Thai middle name |
| last_name_th | TEXT | Thai last name |
| first_name_en | TEXT | English first name |
| middle_name_en | TEXT | English middle name |
| last_name_en | TEXT | English last name |
| date_of_birth | TEXT | Date of birth |
| patient_hn | TEXT | Patient hospital number |
| national_id | TEXT | Thai national ID |
| passport_id | TEXT | Passport number |
| phone_number | TEXT | Phone number |
| email | TEXT | Email address |
| gender | TEXT | Gender |
| created_at | TEXT | Creation timestamp |
| updated_at | TEXT | Last update timestamp |

### 4.3 staff

| Field | Type | Description |
| --- | --- | --- |
| id | INTEGER PK | Staff identifier |
| username | TEXT | Unique username |
| password_hash | TEXT | Hashed password |
| hospital_id | INTEGER FK | Hospital assignment |
| created_at | TEXT | Creation timestamp |

### Relationship

- `staff.hospital_id` -> `hospitals.id`
- `patients.hospital_id` -> `hospitals.id`

This correctly expresses the chain:

`Staff -> Hospital -> Patient`

## 5. System Architecture

The backend is organized into layers:

- API routes
- Services
- Repositories
- Database schema
- Integration adapter for HIS request/response handling

### Architecture idea

- Route layer handles HTTP input/output
- Service layer contains business logic and validation
- Repository layer abstracts database interaction
- HIS adapter handles remote backend data retrieval

## 6. API Specifications

### 6.1 Create Staff

Route:

`POST /staff/create`

Request body:

```json
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

### 6.2 Staff Login

Route:

`POST /staff/login`

Request body:

```json
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

### 6.3 Patient Search

Route:

`GET /patient/search`

Authentication:

- Required
- Must send `Authorization: Bearer <token>`

Optional query filters:

- first_name
- last_name
- national_id
- passport_id
- patient_hn
- phone
- email
- date_of_birth
- gender

Example request:

```http
GET /patient/search?national_id=110170000001
Authorization: Bearer <token>
```

Example response:

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

## 7. Security Rules

The following rules are enforced:

1. Authentication is required before patient search.
2. Staff token is linked to the assigned hospital.
3. Search results are filtered by `hospital_id`.
4. A staff member can never see data from another hospital.
5. Invalid username or password is rejected.

## 8. Test Coverage

The project includes pytest-based tests covering both successful and failed scenarios.

### Positive scenarios

- Create staff succeeds
- Login succeeds
- Patient search succeeds for valid staff member
- Staff can search within own hospital

### Negative scenarios

- Wrong username/password
- Access without authentication
- Cross-hospital access denied
- Search with invalid identifier returns empty result
- Not found patient returns empty list

## 9. Run Instructions

### Local setup

```bash
npm install
cp .env.example .env
npm run db:init
npm run dev
```

### Docker

```bash
docker compose up --build
```

### Run tests

```bash
pytest -q
```

## 10. Project File Summary

Main files:

- src/server.ts
- src/routes/staffRoutes.ts
- src/routes/patientRoutes.ts
- src/services/authService.ts
- src/services/patientService.ts
- src/services/hisClient.ts
- src/db/schema.ts
- src/repositories/patientRepository.ts
- src/repositories/staffRepository.ts
- src/repositories/hospitalRepository.ts
- tests/test_hospital_middleware.py

## 11. Conclusion

This project satisfies the assignment by implementing a hospital-aware backend service in TypeScript with proper separation of concerns, secure staff authorization, hospital-scoped patient access, and test coverage for both success and failure flows.
