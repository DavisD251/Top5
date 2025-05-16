export * from './EventbriteClient';
export * from './EventbriteService';

// Create a singleton instance of the EventbriteService
import { EventbriteService } from './EventbriteService';
export const eventbriteService = new EventbriteService(); 