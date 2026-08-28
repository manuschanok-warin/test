import { db } from '../db/database.js';
import type { Staff } from '../types.js';

export class StaffRepository {
  static findByUsernameAndHospital(username: string, hospitalId: number): Staff | undefined {
    return db.prepare('SELECT * FROM staff WHERE username = ? AND hospital_id = ?').get(username, hospitalId) as Staff | undefined;
  }

  static findById(id: number): Staff | undefined {
    return db.prepare('SELECT * FROM staff WHERE id = ?').get(id) as Staff | undefined;
  }

  static create(username: string, passwordHash: string, hospitalId: number): Staff {
    const result = db.prepare('INSERT INTO staff (username, password_hash, hospital_id) VALUES (?, ?, ?)').run(username, passwordHash, hospitalId);
    return db.prepare('SELECT * FROM staff WHERE id = ?').get(result.lastInsertRowid) as Staff;
  }
}
