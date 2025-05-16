import { getDb } from '../db';
import { Program } from '../models/Program';
import { externalProgramSources } from '../integrations';

export class ProgramService {
  static async findByLocationAndKeyword(zip: string, keyword: string): Promise<Program[]> {
    // Fetch programs from database
    const db = await getDb();
    const dbPrograms = await db.all(
      `SELECT * FROM programs WHERE zip_code = ? AND organization LIKE ?`,
      [zip, `%${keyword}%`]
    );
    
    // Fetch programs from external sources
    const externalPromises = Object.values(externalProgramSources).map(source => 
      source.searchPrograms(zip, keyword).catch(err => {
        console.error(`Error fetching programs from external source:`, err);
        return [];
      })
    );
    
    const externalResults = await Promise.all(externalPromises);
    const externalPrograms = externalResults.flat();
    
    // Combine results from all sources
    return [...dbPrograms, ...externalPrograms];
  }

  static async getById(id: string): Promise<Program | null> {
    // Check if this is an external source ID
    for (const [source, api] of Object.entries(externalProgramSources)) {
      if (id.startsWith(`${source}-`)) {
        return api.getProgramById(id);
      }
    }
    
    // Otherwise, fetch from database
    const db = await getDb();
    const result = await db.get(`SELECT * FROM programs WHERE id = ?`, [id]);
    return result ?? null;
  }
}
