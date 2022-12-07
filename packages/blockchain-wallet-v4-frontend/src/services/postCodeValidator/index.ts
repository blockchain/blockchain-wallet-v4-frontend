import allCountryCodes from './countryCodes'
import postCodeRegex from './postCodeRegex'

const normalizePostCode = (postcode: string): string => {
  // replace all spaces and dashes with empty string
  return postcode.replace(/(-| )/g, '')
}

export const postCodeValidator = (country: string, postcode: string): boolean => {
  if (!postCodeRegex.has(country)) {
    throw Error(`Invalid country code: ${country}`)
  }

  return postCodeRegex.get(country)?.test(normalizePostCode(postcode)) ?? false
}

export const postCodeExistsForCountry = (country: string): boolean => {
  return postCodeRegex.has(country)
}

export const countryCodes = allCountryCodes
