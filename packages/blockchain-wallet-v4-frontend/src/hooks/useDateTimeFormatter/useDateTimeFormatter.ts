import { useMemo } from 'react'

// for en-US example-> MM/DD/YYYY 00:00am
export const FULL_DATETIME_FORMAT: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  hour: 'numeric',
  hour12: true,
  minute: 'numeric',
  month: '2-digit',
  year: 'numeric'
}

// for en-US example-> MM/DD
export const DAY_MONTH: Intl.DateTimeFormatOptions = {
  day: '2-digit',
  month: '2-digit'
}

// for en-US example-> 00:00am
export const TIME_HS12: Intl.DateTimeFormatOptions = {
  hour: 'numeric',
  hour12: true,
  minute: 'numeric'
}

export const useDateTimeFormatter = (
  dateTime: string,
  options: Intl.DateTimeFormatOptions,
  locales: string | string[] = 'en-US'
) =>
  useMemo(() => {
    return new Date(dateTime).toLocaleString(locales, options)
  }, [dateTime, locales, options])
