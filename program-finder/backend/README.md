# Backend API

This is the backend API for the In My Hood program finder application. It provides APIs for accessing program data from both a local database and external sources like Eventbrite.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root directory based on `example.env`
   ```
   cp example.env .env
   ```

3. Set up your Eventbrite API key:
   - Register as a developer on the [Eventbrite Developer portal](https://www.eventbrite.com/platform/api)
   - Create a new application to get your API key
   - Add your API key to the `.env` file:
     ```
     EVENTBRITE_API_KEY=your_api_key_here
     ```

4. Start the development server:
   ```
   npm run dev
   ```

## API Endpoints

### Programs

- `GET /api/programs` - Get all programs (from both database and external sources)
  - Query parameters:
    - `zip` - ZIP code to filter by location
    - `keyword` - Keyword to search for
    - `ageGroup` - Age group filter
    - `category` - Category filter
    - `distance` - Distance in miles (default: 10)

- `GET /api/programs/:id` - Get a program by ID
  - If ID starts with a source prefix (e.g., `eventbrite-`), it will fetch from that external source
  - Otherwise, it will fetch from the local database

## External API Integrations

The application supports fetching program data from external APIs:

### Eventbrite

Integration with the Eventbrite API allows fetching youth programs and events:

- Set `EVENTBRITE_API_KEY`, `EVENTBRITE_PRIVATE_TOKEN`, and other credentials in the `.env` file
- Use `USE_EVENTBRITE_MOCK_DATA=true` during development to use mock data

#### Structure

The API integrations follow a standardized structure:

```
src/integrations/
├── api-utils.ts      # Common API utilities
├── index.ts          # Exports all integrations
├── types.ts          # Common interfaces
└── eventbrite/       # Eventbrite-specific code
    ├── index.ts
    ├── EventbriteClient.ts
    └── EventbriteService.ts
```

#### Adding New Integrations

To add a new external API integration:

1. Create a new directory under `src/integrations/`
2. Implement the `ExternalProgramSource` interface
3. Add the new service to `externalProgramSources` in `src/integrations/index.ts`

## Environment Variables

- `PORT` - Port for the server (default: 4000)
- `NODE_ENV` - Environment (development, production)
- `DATABASE_URL` - Connection string for the database
- `EVENTBRITE_API_KEY` - API key for Eventbrite integration
- `EVENTBRITE_PRIVATE_TOKEN` - Private token for Eventbrite API
- `EVENTBRITE_CLIENT_SECRET` - Client secret for Eventbrite OAuth
- `EVENTBRITE_PUBLIC_TOKEN` - Public token for Eventbrite API
- `USE_EVENTBRITE_MOCK_DATA` - Set to `true` to use mock data instead of real API calls 