import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ApiConfig } from './types';

/**
 * Make an API request with proper error handling
 * @param url API endpoint URL
 * @param config Configuration for the request
 * @returns Response data or null if request failed
 */
export async function makeApiRequest<T>(
  url: string, 
  config: AxiosRequestConfig
): Promise<T | null> {
  try {
    const response: AxiosResponse<T> = await axios(url, config);
    return response.data;
  } catch (error: any) {
    console.error(`API request failed: ${url}`, error.message);
    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error details:', error.response.data);
    }
    return null;
  }
}

/**
 * Safely extract a nested property from an object
 * @param obj The object to extract from
 * @param path The path to the property (e.g., 'user.address.zipCode')
 * @param defaultValue Default value if property doesn't exist
 * @returns The property value or the default value
 */
export function getNestedProperty<T>(
  obj: any, 
  path: string, 
  defaultValue: T
): T {
  const properties = path.split('.');
  let current = obj;
  
  for (const prop of properties) {
    if (current === null || current === undefined || !Object.prototype.hasOwnProperty.call(current, prop)) {
      return defaultValue;
    }
    current = current[prop];
  }
  
  return current === undefined ? defaultValue : current;
} 