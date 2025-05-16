// Export types
export * from './types';

// Export utility functions
export * from './api-utils';

// Export Eventbrite integration
export * from './eventbrite';

// Export a collection of all available external program sources
import { ExternalProgramSource } from './types';
import { eventbriteService } from './eventbrite';

export const externalProgramSources: Record<string, ExternalProgramSource> = {
  eventbrite: eventbriteService
}; 