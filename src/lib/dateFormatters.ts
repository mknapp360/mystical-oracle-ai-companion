// src/lib/dateFormatters.ts
// Shared date/time formatting utilities for birth chart display

export interface FormattedDateTime {
  formattedDate: string;
  formattedTime: string;
  formattedTimeWithZone: string;
}

/**
 * Format birth date/time for display in reports and UI
 * @param birth_date_time ISO 8601 datetime string
 * @param birth_timezone Timezone abbreviation (e.g., "EDT", "PST")
 * @returns Formatted date and time strings
 */
export function formatBirthDateTime(
  birth_date_time: string,
  birth_timezone: string
): FormattedDateTime {
  const date = new Date(birth_date_time);
  
  const dateOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  };
  
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  };
  
  const formattedDate = date.toLocaleDateString('en-US', dateOptions);
  const formattedTime = date.toLocaleTimeString('en-US', timeOptions);
  const formattedTimeWithZone = `${formattedTime} ${birth_timezone}`;
  
  return {
    formattedDate,
    formattedTime,
    formattedTimeWithZone
  };
}

/**
 * Format just the date portion
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Format just the time portion with timezone
 */
export function formatTime(dateString: string, timezone: string): string {
  const date = new Date(dateString);
  const time = date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  return `${time} ${timezone}`;
}