import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';

import { config } from '../config.js';
import { HospitalRepository } from '../repositories/hospitalRepository.js';
import { StaffRepository } from '../repositories/staffRepository.js';
import type { Hospital, Staff, StaffAuthPayload } from '../types.js';

export class AuthService {
  static async createStaff(username: string, password: string, hospitalName: string): Promise<{ staff: Staff; hospital: Hospital }> {
    const normalizedUsername = username.trim();
    const normalizedHospital = hospitalName.trim();

    if (!normalizedUsername || !password || !normalizedHospital) {
      throw new Error('Username, password, and hospital are required');
    }

    const hospital = HospitalRepository.findByName(normalizedHospital) ?? HospitalRepository.create(normalizedHospital, this.generateHospitalCode(normalizedHospital));
    const existing = StaffRepository.findByUsernameAndHospital(normalizedUsername, hospital.id);
    if (existing) {
      throw new Error('Staff already exists in this hospital');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const staff = StaffRepository.create(normalizedUsername, passwordHash, hospital.id);
    return { staff, hospital };
  }

  static async loginStaff(username: string, password: string, hospitalName: string): Promise<{ token: string; staff: Staff; hospital: Hospital }> {
    const normalizedUsername = username.trim();
    const normalizedHospital = hospitalName.trim();

    if (!normalizedUsername || !password || !normalizedHospital) {
      throw new Error('Username, password, and hospital are required');
    }

    const hospital = HospitalRepository.findByName(normalizedHospital);
    if (!hospital) {
      throw new Error('Hospital not found');
    }

    const staff = StaffRepository.findByUsernameAndHospital(normalizedUsername, hospital.id);
    if (!staff) {
      throw new Error('Invalid username or password');
    }

    const isValid = await bcrypt.compare(password, staff.password_hash);
    if (!isValid) {
      throw new Error('Invalid username or password');
    }

    const payload: StaffAuthPayload = {
      staffId: staff.id,
      username: staff.username,
      hospitalId: hospital.id,
      hospitalName: hospital.name,
    };

    const token = crypto.createHmac('sha256', config.jwtSecret).update(`${staff.id}:${staff.username}:${hospital.id}:${Date.now()}`).digest('hex');
    return { token, staff, hospital };
  }

  private static generateHospitalCode(name: string): string {
    return `H-${name.toUpperCase().replace(/[^A-Z0-9]/g, '-')}`.slice(0, 20);
  }
}
