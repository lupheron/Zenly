/**
 * Utility functions for processing location data
 */

/**
 * Filters out Google Plus Codes from location strings
 * Plus Codes typically follow the pattern: 2-3 characters + 2-3 characters + 2-3 characters
 * Examples: PWFW+4MV, 9C3X+Q2X, 8Q9H+5G7
 */
export const filterPlusCodes = (location: string): string => {
  if (!location) return location;
  
  // Remove Plus Codes and any adjacent commas or punctuation
  // Matches patterns like: PWFW+4MV, 9C3X+Q2X, etc.
  // Also handles cases like: ", PWFW+4MV" or "PWFW+4MV," or ", PWFW+4MV,"
  const plusCodePattern = /[,\s]*[A-Z0-9]{2,4}\+[A-Z0-9]{2,4}[,\s]*/g;
  
  return location.replace(plusCodePattern, '').trim();
};

/**
 * Cleans location string by removing Plus Codes and extra whitespace
 */
export const cleanLocation = (location: string): string => {
  if (!location) return location;
  
  // Filter out Plus Codes
  let cleaned = filterPlusCodes(location);
  
  // Remove commas and other punctuation that might be before or after Plus Codes
  cleaned = cleaned.replace(/,\s*$/, '').trim(); // Remove trailing commas
  cleaned = cleaned.replace(/^\s*,/, '').trim(); // Remove leading commas
  cleaned = cleaned.replace(/,\s*,/g, ','); // Remove double commas
  cleaned = cleaned.replace(/,\s*$/, '').trim(); // Remove trailing commas again
  
  // Remove extra whitespace and clean up
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  
  return cleaned;
};
