import allCountryCodes from './countryCodes'
import postCodeRegex from './postCodeRegex'

export const postCodeValidator = (country: string, postcode: string): boolean => {
  if (!postCodeRegex.has(country)) {
    throw Error(`Invalid country code: ${country}`)
  }

  return postCodeRegex.get(country)?.test(postcode) ?? false
}

export const postCodeExistsForCountry = (country: string): boolean => {
  return postCodeRegex.has(country)
}

export const countryCodes = allCountryCodes
