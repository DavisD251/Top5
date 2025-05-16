import { eventbriteService } from '../integrations/eventbrite';
import { config, validateEnvironment } from '../config/env';

// Validate environment
validateEnvironment();

async function testEventbriteSearch() {
  console.log('Testing Eventbrite API integration...');
  console.log('API Key:', config.eventbrite.apiKey ? 'Set' : 'Not set');
  console.log('Private Token:', config.eventbrite.privateToken ? 'Set' : 'Not set');
  console.log('Using Mock Data:', config.eventbrite.useMockData ? 'Yes' : 'No');
  
  try {
    // Test search
    console.log('\nSearching for youth programs in zip code 19801...');
    const results = await eventbriteService.searchPrograms('19801', 'youth');
    
    console.log(`Found ${results.length} events`);
    
    if (results.length > 0) {
      console.log('\nFirst result:');
      console.log('ID:', results[0].id);
      console.log('Name:', results[0].name);
      console.log('Organization:', results[0].organization);
      console.log('Description:', results[0].description?.substring(0, 100) + '...');
      
      // Test getting event by ID
      const eventId = results[0].id.replace('eventbrite-', '');
      console.log(`\nFetching event details for ID: ${eventId}`);
      
      const event = await eventbriteService.getProgramById(eventId);
      if (event) {
        console.log('Event details fetched successfully');
      } else {
        console.log('Failed to fetch event details');
      }
    }
  } catch (error) {
    console.error('Error testing Eventbrite API:', error);
  }
}

// Run the test
testEventbriteSearch()
  .then(() => console.log('Test completed'))
  .catch(error => console.error('Test failed:', error)); 