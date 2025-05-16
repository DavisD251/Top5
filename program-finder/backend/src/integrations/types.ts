import { Program } from '../models/Program';

/**
 * Interface for external program sources (APIs)
 */
export interface ExternalProgramSource {
  /**
   * Search for programs based on location and keyword
   * @param zip ZIP code to search near
   * @param keyword Keyword to search for
   * @returns Array of programs matching the search criteria
   */
  searchPrograms(zip: string, keyword: string): Promise<Program[]>;
  
  /**
   * Get a specific program by ID
   * @param id Program ID
   * @returns Program details or null if not found
   */
  getProgramById(id: string): Promise<Program | null>;
}

/**
 * Common configuration for API integrations
 */
export interface ApiConfig {
  /** Whether to use mock data instead of real API calls */
  useMockData: boolean;
  /** API key for authentication */
  apiKey?: string;
  /** Private token for authentication */
  privateToken?: string;
  /** Client secret for authentication */
  clientSecret?: string;
  /** Base URL for the API */
  baseUrl: string;
} 