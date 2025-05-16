import { Program } from '../../models/Program';
import { ExternalProgramSource } from '../types';
import { EventbriteClient, EventbriteEvent } from './EventbriteClient';
import { config } from '../../config/env';
import { getNestedProperty } from '../api-utils';

/**
 * Service for fetching programs from Eventbrite
 */
export class EventbriteService implements ExternalProgramSource {
  private readonly client: EventbriteClient;
  
  constructor() {
    this.client = new EventbriteClient({
      baseUrl: 'https://www.eventbriteapi.com/v3',
      apiKey: config.eventbrite.apiKey,
      privateToken: config.eventbrite.privateToken,
      useMockData: config.eventbrite.useMockData
    });
  }
  
  /**
   * Search for programs on Eventbrite
   * @param zip ZIP code to search near
   * @param keyword Keyword to search for
   * @returns Array of programs matching search criteria
   */
  async searchPrograms(zip: string, keyword: string): Promise<Program[]> {
    console.log(`Searching Eventbrite events near ${zip} with keyword "${keyword}"`);
    
    const response = await this.client.searchEvents(zip, keyword);
    
    if (!response || !response.events || response.events.length === 0) {
      console.log('No events found on Eventbrite');
      return [];
    }
    
    console.log(`Found ${response.events.length} events on Eventbrite`);
    
    // Map Eventbrite events to our Program model
    return response.events.map(event => this.mapEventToProgram(event));
  }
  
  /**
   * Get a specific program from Eventbrite by ID
   * @param id Eventbrite event ID (without the 'eventbrite-' prefix)
   * @returns Program details or null if not found
   */
  async getProgramById(id: string): Promise<Program | null> {
    // Remove 'eventbrite-' prefix if present
    const eventbriteId = id.startsWith('eventbrite-') ? id.replace('eventbrite-', '') : id;
    
    console.log(`Fetching Eventbrite event with ID: ${eventbriteId}`);
    
    const event = await this.client.getEvent(eventbriteId);
    
    if (!event) {
      console.log(`Event with ID ${eventbriteId} not found on Eventbrite`);
      return null;
    }
    
    return this.mapEventToProgram(event);
  }
  
  /**
   * Map an Eventbrite event to our Program model
   * @param event Event from Eventbrite API
   * @returns Program object
   */
  private mapEventToProgram(event: EventbriteEvent): Program {
    const zipCode = getNestedProperty<string>(event, 'venue.address.postal_code', '');
    
    return {
      id: `eventbrite-${event.id}`,
      name: event.name.text,
      description: getNestedProperty<string>(event, 'description.text', ''),
      organization: getNestedProperty<string>(event, 'organizer.name', 'Unknown organizer'),
      services: 'Event',
      type: getNestedProperty<string>(event, 'category.name', 'Event'),
      ages: event.is_family_friendly ? 'Family friendly' : 'All ages',
      zip_code: zipCode,
      start_date: getNestedProperty<string>(event, 'start.local', ''),
      end_date: getNestedProperty<string>(event, 'end.local', ''),
      url: event.url,
      venue_name: getNestedProperty<string>(event, 'venue.name', ''),
      source: 'eventbrite'
    };
  }
} 