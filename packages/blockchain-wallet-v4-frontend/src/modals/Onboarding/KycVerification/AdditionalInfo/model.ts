export const DocsAllowedByCountry = (country) => {
  const countries = {
    AR: ['requirement_3'],
    default: ['requirement_1', 'requirement_2', 'requirement_3']
  }

  return countries[country] || countries.default
}
