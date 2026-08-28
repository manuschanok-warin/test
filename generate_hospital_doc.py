from pathlib import Path
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, PageBreak, ListFlowable, ListItem

OUTPUT = Path('/Users/manuschanok/Desktop/Hospital_Middleware_Documentation.pdf')

content = [
    Paragraph('Hospital Middleware Documentation', style=getSampleStyleSheet()['Title']),
    Spacer(1, 18),
    Paragraph('Project: Hospital Middleware', style=getSampleStyleSheet()['Heading2']),
    Paragraph('Prepared for: Back-end Developer assignment', style=getSampleStyleSheet()['BodyText']),
    Spacer(1, 12),
    Paragraph('Overview', style=getSampleStyleSheet()['Heading1']),
    Paragraph('This project implements a TypeScript back-end service for a hospital patient middleware that searches and displays patient information from the Hospital Information System (HIS), while enforcing hospital-scoped access for staff members. The middleware stores patient data in a local database and restricts each staff user to data belonging only to the hospital to which they are assigned.'),
    Spacer(1, 12),
    Paragraph('Objectives', style=getSampleStyleSheet()['Heading2']),
    Paragraph('1. Support patient lookup by national ID or passport ID from HIS-style data.\n2. Maintain hospital-level segregation of staff and patient records.\n3. Provide staff creation and login APIs.\n4. Restrict patient search to records in the same hospital as the authenticated staff member.\n5. Deliver a testable, maintainable TypeScript API with documentation and setup guidance.'),
    Spacer(1, 12),
    Paragraph('System Design', style=getSampleStyleSheet()['Heading1']),
    Paragraph('The system contains three primary entities: Hospital, Staff, and Patient. Each Staff belongs to one Hospital. Each Patient belongs to one Hospital. A staff user can only query patients whose hospital_id matches their own hospital_id.'),
    Paragraph('Core components:', style=getSampleStyleSheet()['Heading2']),
    ListFlowable([
        ListItem(Paragraph('API layer: Express routes for staff and patient operations.')),
        ListItem(Paragraph('Service layer: authentication and patient search logic.')),
        ListItem(Paragraph('Repository layer: database access and query logic.')),
        ListItem(Paragraph('Database layer: SQLite schema for Hospital, Staff, and Patient.')),
        ListItem(Paragraph('HIS integration layer: wrapper for hospital search by ID.')),
    ], bulletType='bullet'),
    Spacer(1, 12),
    Paragraph('Database Schema', style=getSampleStyleSheet()['Heading1']),
    Paragraph('1. hospitals', style=getSampleStyleSheet()['Heading2']),
    Paragraph('Columns: id, name, code, created_at'),
    Paragraph('2. patients', style=getSampleStyleSheet()['Heading2']),
    Paragraph('Columns: id, hospital_id, first_name_th, middle_name_th, last_name_th, first_name_en, middle_name_en, last_name_en, date_of_birth, patient_hn, national_id, passport_id, phone_number, email, gender, created_at, updated_at'),
    Paragraph('3. staff', style=getSampleStyleSheet()['Heading2']),
    Paragraph('Columns: id, username, password_hash, hospital_id, created_at'),
    Paragraph('Relationship: staff.hospital_id -> hospitals.id and patients.hospital_id -> hospitals.id'),
    Spacer(1, 12),
    Paragraph('Patient Data Fields', style=getSampleStyleSheet()['Heading1']),
    Paragraph('The patient model supports the HIS response fields and additional local persistence details: first_name_th, middle_name_th, last_name_th, first_name_en, middle_name_en, last_name_en, date_of_birth, patient_hn, national_id, passport_id, phone_number, email, gender.'),
    Spacer(1, 12),
    Paragraph('APIs', style=getSampleStyleSheet()['Heading1']),
    Paragraph('Create Staff', style=getSampleStyleSheet()['Heading2']),
    Paragraph('Route: POST /staff/create\nInput: username, password, hospital\nResult: creates staff account and binds to the specified hospital.'),
    Paragraph('Staff Login', style=getSampleStyleSheet()['Heading2']),
    Paragraph('Route: POST /staff/login\nInput: username, password, hospital\nResult: validates credentials and returns an authenticated token for later access.'),
    Paragraph('Patient Search', style=getSampleStyleSheet()['Heading2']),
    Paragraph('Route: GET /patient/search\nAuthentication: required (Bearer token)\nQuery parameters: optional fields such as first_name, last_name, national_id, passport_id, patient_hn, phone, email, date_of_birth, gender\nRule: returns only patients for the authenticated staff member’s hospital.'),
    Spacer(1, 12),
    Paragraph('Example Requests', style=getSampleStyleSheet()['Heading1']),
    Paragraph('Create staff example:', style=getSampleStyleSheet()['Heading2']),
    Paragraph('{"username":"staff_a","password":"secret123","hospital":"Hospital A"}'),
    Paragraph('Login example:', style=getSampleStyleSheet()['Heading2']),
    Paragraph('{"username":"staff_a","password":"secret123","hospital":"Hospital A"}'),
    Paragraph('Patient search example:', style=getSampleStyleSheet()['Heading2']),
    Paragraph('/patient/search?national_id=110170000001'),
    Spacer(1, 12),
    Paragraph('Security and Authorization Rules', style=getSampleStyleSheet()['Heading1']),
    Paragraph('1. Staff must authenticate before using patient search.\n2. The staff token is bound to a hospital_id.\n3. All patient queries are restricted to records where patients.hospital_id = staff.hospital_id.\n4. Records from another hospital are never returned.\n5. Username and password are validated before authorization is granted.'),
    Spacer(1, 12),
    Paragraph('Setup and Run Guide', style=getSampleStyleSheet()['Heading1']),
    Paragraph('Install dependencies:', style=getSampleStyleSheet()['Heading2']),
    Paragraph('npm install'),
    Paragraph('Copy environment config:', style=getSampleStyleSheet()['Heading2']),
    Paragraph('cp .env.example .env'),
    Paragraph('Initialize DB:', style=getSampleStyleSheet()['Heading2']),
    Paragraph('npm run db:init'),
    Paragraph('Start the app:', style=getSampleStyleSheet()['Heading2']),
    Paragraph('npm run dev'),
    Paragraph('Docker Compose:', style=getSampleStyleSheet()['Heading2']),
    Paragraph('docker compose up --build'),
    Spacer(1, 12),
    Paragraph('Testing', style=getSampleStyleSheet()['Heading1']),
    Paragraph('Test command: pytest -q'),
    Paragraph('Result: 7 passed in 4.26s'),
    Paragraph('Covered scenarios include positive and negative flows: successful create staff, successful login, patient search with valid auth, patient search without auth, wrong credentials, cross-hospital access blocked, patient not found.'),
    Spacer(1, 12),
    Paragraph('Files in the project', style=getSampleStyleSheet()['Heading1']),
    Paragraph('Core application files include src/server.ts, src/routes/staffRoutes.ts, src/routes/patientRoutes.ts, src/services/authService.ts, src/services/patientService.ts, src/db/schema.ts, src/repositories/*.ts, and tests/test_hospital_middleware.py.'),
    Spacer(1, 12),
    Paragraph('Conclusion', style=getSampleStyleSheet()['Heading1']),
    Paragraph('The project fulfills the requested hospital middleware use case by combining staff authentication, hospital boundary enforcement, data persistence, HIS integration readiness, and a reproducible test suite. It is structured to be extendable to real production APIs while remaining simple to run and review.'),
]

styles = getSampleStyleSheet()
styles.add(ParagraphStyle(name='BodyText', parent=styles['BodyText'], fontSize=10, leading=14))
styles['Title'].fontSize = 22
styles['Heading1'].fontSize = 16
styles['Heading2'].fontSize = 12

doc = SimpleDocTemplate(str(OUTPUT), pagesize=A4, rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40)
doc.build(content)
print(f'PDF generated: {OUTPUT}')
