import axios from 'axios';
import { ApiConfig } from '../types';
import { makeApiRequest } from '../api-utils';

export interface EventbriteEvent {
  id: string;
  name: {
    text: string;
    html: string;
  };
  description?: {
    text: string;
    html: string;
  };
  url: string;
  start?: {
    timezone: string;
    local: string;
    utc: string;
  };
  end?: {
    timezone: string;
    local: string;
    utc: string;
  };
  organization_id?: string;
  organizer?: {
    id: string;
    name: string;
  };
  venue?: {
    id: string;
    name: string;
    address?: {
      city: string;
      country: string;
      postal_code: string;
      address_1: string;
      address_2?: string;
    };
  };
  category?: {
    id: string;
    name: string;
  };
  is_family_friendly?: boolean;
}

export interface EventbriteResponse {
  events?: EventbriteEvent[];
  pagination?: {
    page_count: number;
    page_size: number;
    page_number: number;
    has_more_items: boolean;
  };
}

/**
 * Client for interacting with the Eventbrite API
 */
export class EventbriteClient {
  private readonly baseUrl: string;
  private readonly authToken: string;
  private readonly useMockData: boolean;

  constructor(config: ApiConfig) {
    this.baseUrl = config.baseUrl;
    this.authToken = config.privateToken || config.apiKey || '';
    this.useMockData = config.useMockData;
  }

  /**
   * Search for events using the Eventbrite API
   * @param zip ZIP code to search near
   * @param keyword Keyword to search for
   * @returns Response containing events and pagination info
   */
  async searchEvents(zip: string, keyword: string): Promise<EventbriteResponse | null> {
    if (this.useMockData) {
      console.log('Using mock data for Eventbrite event search');
      return this.getMockEventSearchResponse(zip, keyword);
    }

    const url = `${this.baseUrl}/events/search/`;
    const params = {
      'location.address': zip,
      'q': keyword,
      'expand': 'venue,organizer',
      'categories': '115' // Family & Education category
    };

    return makeApiRequest<EventbriteResponse>(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.authToken}`,
        'Content-Type': 'application/json'
      },
      params
    });
  }

  /**
   * Get a specific event by ID
   * @param id Event ID
   * @returns Event details or null if not found
   */
  async getEvent(id: string): Promise<EventbriteEvent | null> {
    if (this.useMockData) {
      console.log(`Using mock data for Eventbrite event ${id}`);
      return this.getMockEvent(id);
    }

    const url = `${this.baseUrl}/events/${id}/`;
    const params = {
      'expand': 'venue,organizer'
    };

    return makeApiRequest<EventbriteEvent>(url, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.authToken}`,
        'Content-Type': 'application/json'
      },
      params
    });
  }

  /**
   * Generate a mock event for testing
   * @param id Event ID
   * @returns Mock Eventbrite event
   */
  private getMockEvent(id: string): EventbriteEvent {
    return {
      id: id,
      name: {
        text: "Youth Innovation Workshop",
        html: "<p>Youth Innovation Workshop</p>"
      },
      description: {
        text: "A workshop for youth to learn about innovation and entrepreneurship",
        html: "<p>A workshop for youth to learn about innovation and entrepreneurship</p>"
      },
      url: "https://eventbrite.com/events/sample",
      start: {
        timezone: "America/New_York",
        local: "2025-06-15T10:00:00",
        utc: "2025-06-15T14:00:00Z"
      },
      end: {
        timezone: "America/New_York",
        local: "2025-06-15T16:00:00",
        utc: "2025-06-15T20:00:00Z"
      },
      organizer: {
        id: "org-123",
        name: "Youth Innovation Center"
      },
      venue: {
        id: "venue-123",
        name: "Community Center",
        address: {
          city: "Wilmington",
          country: "US",
          postal_code: "19801",
          address_1: "123 Main St"
        }
      },
      category: {
        id: "115",
        name: "Education"
      },
      is_family_friendly: true
    };
  }

  /**
   * Generate a mock event search response for testing
   * @param zip ZIP code used in search
   * @param keyword Keyword used in search
   * @returns Mock Eventbrite search response
   */
  private getMockEventSearchResponse(zip: string, keyword: string): EventbriteResponse {
    const mockEvents: EventbriteEvent[] = [
      {
        id: "12345",
        name: {
          text: "Youth Summer Camp",
          html: "<p>Youth Summer Camp</p>"
        },
        description: {
          text: "A summer camp for youth to learn about nature and outdoor activities",
          html: "<p>A summer camp for youth to learn about nature and outdoor activities</p>"
        },
        url: "https://eventbrite.com/events/sample-1",
        start: {
          timezone: "America/New_York",
          local: "2025-07-10T09:00:00",
          utc: "2025-07-10T13:00:00Z"
        },
        end: {
          timezone: "America/New_York",
          local: "2025-07-14T16:00:00",
          utc: "2025-07-14T20:00:00Z"
        },
        organizer: {
          id: "org-456",
          name: "City Youth Programs"
        },
        venue: {
          id: "venue-456",
          name: "City Park",
          address: {
            city: "Wilmington",
            country: "US",
            postal_code: zip,
            address_1: "456 Park Ave"
          }
        },
        is_family_friendly: true
      },
      {
        id: "23456",
        name: {
          text: "Teen Tech Workshop",
          html: "<p>Teen Tech Workshop</p>"
        },
        description: {
          text: "Learn coding, robotics, and app development in this hands-on workshop",
          html: "<p>Learn coding, robotics, and app development in this hands-on workshop</p>"
        },
        url: "https://eventbrite.com/events/sample-2",
        start: {
          timezone: "America/New_York",
          local: "2025-06-20T10:00:00",
          utc: "2025-06-20T14:00:00Z"
        },
        end: {
          timezone: "America/New_York",
          local: "2025-06-20T15:00:00",
          utc: "2025-06-20T19:00:00Z"
        },
        organizer: {
          id: "org-789",
          name: "Tech Futures"
        },
        venue: {
          id: "venue-789",
          name: "Innovation Center",
          address: {
            city: "Wilmington",
            country: "US",
            postal_code: zip,
            address_1: "789 Tech Blvd"
          }
        },
        category: {
          id: "101",
          name: "Technology"
        },
        is_family_friendly: true
      }
    ];

    // Filter by keyword if provided
    let filteredEvents = mockEvents;
    if (keyword && keyword.trim() !== '') {
      const lowercaseKeyword = keyword.toLowerCase();
      filteredEvents = mockEvents.filter(event => 
        event.name.text.toLowerCase().includes(lowercaseKeyword) || 
        (event.description?.text.toLowerCase().includes(lowercaseKeyword)) ||
        (event.organizer && event.organizer.name.toLowerCase().includes(lowercaseKeyword))
      );
    }

    return {
      events: filteredEvents,
      pagination: {
        page_count: 1,
        page_size: filteredEvents.length,
        page_number: 1,
        has_more_items: false
      }
    };
  }
} 