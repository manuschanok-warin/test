import { config } from '../config.js';
import type { Patient } from '../types.js';

export type HisPatientRecord = Omit<Patient, 'id' | 'hospital_id' | 'created_at' | 'updated_at'>;

const mockPatients: HisPatientRecord[] = [
  {
    first_name_th: 'สมชาย',
    middle_name_th: '',
    last_name_th: 'ใจดี',
    first_name_en: 'Somchai',
    middle_name_en: '',
    last_name_en: 'Jaidee',
    date_of_birth: '1990-05-12',
    patient_hn: 'HN-001',
    national_id: '110170000001',
    passport_id: null,
    phone_number: '0812345678',
    email: 'somchai@example.com',
    gender: 'male',
  },
  {
    first_name_th: 'สุดา',
    middle_name_th: 'พร',
    last_name_th: 'รัตนกุล',
    first_name_en: 'Suda',
    middle_name_en: 'Porn',
    last_name_en: 'Rattanakul',
    date_of_birth: '1988-08-11',
    patient_hn: 'HN-002',
    national_id: '110170000002',
    passport_id: 'P1234567',
    phone_number: '0856789123',
    email: 'suda@example.com',
    gender: 'female',
  },
];

export async function fetchPatientFromHis(id: string): Promise<HisPatientRecord[] | null> {
  if (config.useMockHis) {
    const normalized = id.trim();
    if (!normalized) {
      return [];
    }

    const matches = mockPatients.filter((patient) => {
      return patient.national_id === normalized || patient.passport_id === normalized;
    });

    return matches.length > 0 ? matches : [];
  }

  const response = await fetch(`${config.hisBaseUrl}/patient/search/${encodeURIComponent(id)}`);
  if (!response.ok) {
    return null;
  }

  const payload = (await response.json()) as HisPatientRecord[] | HisPatientRecord;
  if (Array.isArray(payload)) {
    return payload;
  }

  return payload ? [payload] : [];
}
