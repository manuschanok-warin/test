import { Router } from 'express';
import { z } from 'zod';

import { HospitalRepository } from '../repositories/hospitalRepository.js';
import { PatientService } from '../services/patientService.js';
import type { StaffAuthPayload } from '../types.js';

const router = Router();

const patientSearchSchema = z.object({
  first_name: z.string().optional(),
  last_name: z.string().optional(),
  national_id: z.string().optional(),
  passport_id: z.string().optional(),
  patient_hn: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  date_of_birth: z.string().optional(),
  gender: z.string().optional(),
}).passthrough();

const requireAuth = (req: any, res: any, next: any): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || typeof authHeader !== 'string' || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Authentication required' });
    return;
  }

  const token = authHeader.replace('Bearer ', '').trim();
  const expected = req.app.locals?.tokens?.[token];
  if (!expected) {
    res.status(401).json({ message: 'Invalid token' });
    return;
  }

  req.user = expected;
  next();
};

router.get('/search', requireAuth, async (req, res) => {
  try {
    const query = patientSearchSchema.parse(req.query);
    const user = req.user as StaffAuthPayload;
    const hospital = HospitalRepository.findById(user.hospitalId);

    if (!hospital) {
      res.status(404).json({ message: 'Hospital not found for this staff member' });
      return;
    }

    const patients = await PatientService.searchPatient(hospital.id, query);
    res.status(200).json(patients);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ message });
  }
});

export default router;
