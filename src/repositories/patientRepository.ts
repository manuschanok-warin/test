import { db } from '../db/database.js';
import type { Patient, PatientSearchFilters } from '../types.js';

export class PatientRepository {
  static createMany(hospitalId: number, patients: Array<Omit<Patient, 'id' | 'created_at' | 'updated_at' | 'hospital_id'>>): void {
    const stmt = db.prepare(`
      INSERT INTO patients (
        hospital_id, first_name_th, middle_name_th, last_name_th,
        first_name_en, middle_name_en, last_name_en, date_of_birth,
        patient_hn, national_id, passport_id, phone_number, email, gender
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertMany = db.transaction((items: typeof patients) => {
      for (const patient of items) {
        stmt.run(
          hospitalId,
          patient.first_name_th ?? null,
          patient.middle_name_th ?? null,
          patient.last_name_th ?? null,
          patient.first_name_en ?? null,
          patient.middle_name_en ?? null,
          patient.last_name_en ?? null,
          patient.date_of_birth ?? null,
          patient.patient_hn ?? null,
          patient.national_id ?? null,
          patient.passport_id ?? null,
          patient.phone_number ?? null,
          patient.email ?? null,
          patient.gender ?? null
        );
      }
    });

    insertMany(patients);
  }

  static searchAllByHospital(hospitalId: number, filters: PatientSearchFilters = {}): Patient[] {
    const clauses: string[] = ['hospital_id = ?'];
    const params: unknown[] = [hospitalId];

    if (filters.first_name) {
      clauses.push('LOWER(COALESCE(first_name_th, "") || " " || COALESCE(first_name_en, "")) LIKE ?');
      params.push(`%${filters.first_name.toLowerCase()}%`);
    }

    if (filters.last_name) {
      clauses.push('LOWER(COALESCE(last_name_th, "") || " " || COALESCE(last_name_en, "")) LIKE ?');
      params.push(`%${filters.last_name.toLowerCase()}%`);
    }

    if (filters.national_id) {
      clauses.push('national_id = ?');
      params.push(filters.national_id);
    }

    if (filters.passport_id) {
      clauses.push('passport_id = ?');
      params.push(filters.passport_id);
    }

    if (filters.patient_hn) {
      clauses.push('patient_hn = ?');
      params.push(filters.patient_hn);
    }

    if (filters.phone) {
      clauses.push('phone_number = ?');
      params.push(filters.phone);
    }

    if (filters.email) {
      clauses.push('email = ?');
      params.push(filters.email);
    }

    if (filters.date_of_birth) {
      clauses.push('date_of_birth = ?');
      params.push(filters.date_of_birth);
    }

    if (filters.gender) {
      clauses.push('gender = ?');
      params.push(filters.gender);
    }

    const whereSql = clauses.join(' AND ');
    const sql = `SELECT * FROM patients WHERE ${whereSql} ORDER BY created_at DESC`;
    return db.prepare(sql).all(...params) as Patient[];
  }
}
