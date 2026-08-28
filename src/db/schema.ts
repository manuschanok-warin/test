import { db } from './database.js';

export function initDatabase(): void {
  db.exec(`
    CREATE TABLE IF NOT EXISTS hospitals (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      code TEXT NOT NULL UNIQUE,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hospital_id INTEGER NOT NULL,
      first_name_th TEXT,
      middle_name_th TEXT,
      last_name_th TEXT,
      first_name_en TEXT,
      middle_name_en TEXT,
      last_name_en TEXT,
      date_of_birth TEXT,
      patient_hn TEXT,
      national_id TEXT,
      passport_id TEXT,
      phone_number TEXT,
      email TEXT,
      gender TEXT,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
    );

    CREATE TABLE IF NOT EXISTS staff (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      hospital_id INTEGER NOT NULL,
      created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (hospital_id) REFERENCES hospitals(id)
    );

    CREATE INDEX IF NOT EXISTS idx_patients_hospital_id ON patients(hospital_id);
    CREATE INDEX IF NOT EXISTS idx_patients_national_id ON patients(national_id);
    CREATE INDEX IF NOT EXISTS idx_patients_passport_id ON patients(passport_id);
    CREATE INDEX IF NOT EXISTS idx_patients_hn ON patients(patient_hn);
    CREATE INDEX IF NOT EXISTS idx_patients_email ON patients(email);
    CREATE INDEX IF NOT EXISTS idx_patients_phone_number ON patients(phone_number);
    CREATE INDEX IF NOT EXISTS idx_patients_last_name ON patients(last_name_th, first_name_th);
  `);
}

export function seedHospitals(): void {
  const insertHospital = db.prepare(`
    INSERT OR IGNORE INTO hospitals (name, code)
    VALUES (?, ?)
  `);

  insertHospital.run('Hospital A', 'HOSP-A');
  insertHospital.run('Hospital B', 'HOSP-B');
}

export function seedPatients(): void {
  const insertPatient = db.prepare(`
    INSERT OR IGNORE INTO patients (
      hospital_id, first_name_th, middle_name_th, last_name_th,
      first_name_en, middle_name_en, last_name_en, date_of_birth,
      patient_hn, national_id, passport_id, phone_number, email, gender
    ) VALUES (
      ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
    )
  `);

  const hospitalAId = db.prepare('SELECT id FROM hospitals WHERE name = ?').get('Hospital A') as { id: number } | undefined;
  const hospitalBId = db.prepare('SELECT id FROM hospitals WHERE name = ?').get('Hospital B') as { id: number } | undefined;

  if (!hospitalAId || !hospitalBId) return;

  insertPatient.run(
    hospitalAId.id,
    'สมชาย',
    '',
    'ใจดี',
    'Somchai',
    '',
    'Jaidee',
    '1990-05-12',
    'HN-A-001',
    '110170000001',
    null,
    '0812345678',
    'somchai@example.com',
    'male'
  );

  insertPatient.run(
    hospitalAId.id,
    'สุดา',
    'พร',
    'รัตนกุล',
    'Suda',
    'Porn',
    'Rattanakul',
    '1988-08-11',
    'HN-A-002',
    '110170000002',
    'P1234567',
    '0856789123',
    'suda@example.com',
    'female'
  );

  insertPatient.run(
    hospitalBId.id,
    'ภคิน',
    'ทิพย์',
    'ศรีสวัสดิ์',
    'Pakin',
    'Tip',
    'Srisawat',
    '1995-12-24',
    'HN-B-001',
    '110170000099',
    'B9876543',
    '0998877665',
    'pakin@example.com',
    'male'
  );
}

export function ensureSeedData(): void {
  initDatabase();
  seedHospitals();
  seedPatients();
}
