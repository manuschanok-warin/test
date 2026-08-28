import { HospitalRepository } from '../repositories/hospitalRepository.js';
import { PatientRepository } from '../repositories/patientRepository.js';
import { fetchPatientFromHis } from './hisClient.js';
import type { Patient, PatientSearchFilters } from '../types.js';

export class PatientService {
  static async searchPatient(hospitalId: number, filters: PatientSearchFilters): Promise<Patient[]> {
    const hospital = HospitalRepository.findById(hospitalId);
    if (!hospital) {
      return [];
    }

    const dbPatients = PatientRepository.searchAllByHospital(hospitalId, filters);

    // Hospital-scoped access is mandatory: a staff member must only see records
    // belonging to their own hospital. We do not sync external HIS records into a
    // different hospital's dataset because the HIS payload alone does not carry a
    // trusted hospital ownership flag.
    void fetchPatientFromHis;
    return dbPatients;
  }
}
