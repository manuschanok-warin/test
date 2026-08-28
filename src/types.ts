export interface Hospital {
  id: number;
  name: string;
  code: string;
  created_at: string;
}

export interface Staff {
  id: number;
  username: string;
  password_hash: string;
  hospital_id: number;
  created_at: string;
}

export interface Patient {
  id: number;
  hospital_id: number;
  first_name_th: string | null;
  middle_name_th: string | null;
  last_name_th: string | null;
  first_name_en: string | null;
  middle_name_en: string | null;
  last_name_en: string | null;
  date_of_birth: string | null;
  patient_hn: string | null;
  national_id: string | null;
  passport_id: string | null;
  phone_number: string | null;
  email: string | null;
  gender: string | null;
  created_at: string;
  updated_at: string;
}

export type PatientSearchFilters = {
  first_name?: string;
  last_name?: string;
  national_id?: string;
  passport_id?: string;
  patient_hn?: string;
  phone?: string;
  email?: string;
  date_of_birth?: string;
  gender?: string;
};

export type StaffAuthPayload = {
  staffId: number;
  username: string;
  hospitalId: number;
  hospitalName: string;
};
