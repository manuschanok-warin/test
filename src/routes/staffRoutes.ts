import { Router } from 'express';
import { z } from 'zod';

import { AuthService } from '../services/authService.js';

const router = Router();

const createStaffSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  hospital: z.string().min(1),
});

const loginStaffSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
  hospital: z.string().min(1),
});

router.post('/create', async (req, res) => {
  try {
    const payload = createStaffSchema.parse(req.body);
    const result = await AuthService.createStaff(payload.username, payload.password, payload.hospital);
    res.status(201).json({
      message: 'Staff created successfully',
      staff: {
        id: result.staff.id,
        username: result.staff.username,
        hospital: result.hospital.name,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(400).json({ message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const payload = loginStaffSchema.parse(req.body);
    const result = await AuthService.loginStaff(payload.username, payload.password, payload.hospital);
    const tokenPayload = {
      staffId: result.staff.id,
      username: result.staff.username,
      hospitalId: result.hospital.id,
      hospitalName: result.hospital.name,
    };

    req.app.locals.tokens = req.app.locals.tokens ?? {};
    req.app.locals.tokens[result.token] = tokenPayload;

    res.status(200).json({
      message: 'Login successful',
      token: result.token,
      staff: {
        id: result.staff.id,
        username: result.staff.username,
        hospital: result.hospital.name,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    res.status(401).json({ message });
  }
});

export default router;
