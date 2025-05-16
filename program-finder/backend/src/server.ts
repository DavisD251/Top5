import app from './app';
import { config, validateEnvironment } from './config/env';

// Validate environment variables
validateEnvironment();

const PORT = config.port;

app.listen(PORT, () => {
  console.log(`Backend API listening on port ${PORT}`);
  console.log(`Environment: ${config.nodeEnv}`);
});
