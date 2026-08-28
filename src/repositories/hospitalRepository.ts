import { db } from '../db/database.js';
import type { Hospital } from '../types.js';

export class HospitalRepository {
  static findByName(name: string): Hospital | undefined {
    return db.prepare('SELECT * FROM hospitals WHERE name = ?').get(name) as Hospital | undefined;
  }

  static findById(id: number): Hospital | undefined {
    return db.prepare('SELECT * FROM hospitals WHERE id = ?').get(id) as Hospital | undefined;
  }

  static create(name: string, code: string): Hospital {
    const result = db.prepare('INSERT INTO hospitals (name, code) VALUES (?, ?)').run(name, code);
    return db.prepare('SELECT * FROM hospitals WHERE id = ?').get(result.lastInsertRowid) as Hospital;
  }
}
