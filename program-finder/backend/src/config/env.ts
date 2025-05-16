import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

export const config = {
  port: process.env.PORT || 4000,
  databaseUrl: process.env.DATABASE_URL || 'sqlite:./database.sqlite',
  nodeEnv: process.env.NODE_ENV || 'development',
  eventbrite: {
    apiKey: process.env.EVENTBRITE_API_KEY,
    clientSecret: process.env.EVENTBRITE_CLIENT_SECRET,
    privateToken: process.env.EVENTBRITE_PRIVATE_TOKEN,
    publicToken: process.env.EVENTBRITE_PUBLIC_TOKEN,
    useMockData: process.env.USE_EVENTBRITE_MOCK_DATA === 'true' || true // Default to true until API is working
  }
};

// Validate required environment variables
export function validateEnvironment(): void {
  const requiredVars = ['EVENTBRITE_API_KEY'];
  
  const missingVars = requiredVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.warn(`Warning: Missing required environment variables: ${missingVars.join(', ')}`);
    console.warn('Some functionality may be limited');
  }
} 