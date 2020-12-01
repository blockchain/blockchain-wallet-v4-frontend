const COUNTRIES_CURRENCIES = {
  currency: {
    AD: 'EUR',
    AT: 'EUR',
    BE: 'EUR',
    CA: 'CAD',
    CS: 'EUR',
    DE: 'EUR',
    DK: 'DKK',
    ES: 'EUR',
    FI: 'EUR',
    FO: 'DKK',
    FR: 'EUR',
    GB: 'GBP',
    GF: 'EUR',
    GL: 'DKK',
    GP: 'EUR',
    GR: 'EUR',
    IE: 'EUR',
    IT: 'EUR',
    LU: 'EUR',
    MC: 'EUR',
    MQ: 'EUR',
    NL: 'EUR',
    PL: 'PLN',
    PM: 'EUR',
    PT: 'EUR',
    RE: 'EUR',
    SE: 'SEK',
    SM: 'EUR',
    TF: 'EUR',
    VA: 'EUR',
    YT: 'EUR'
  }
}

export const guessCurrencyBasedOnCountry = (countryCode: string) =>
  COUNTRIES_CURRENCIES.currency[countryCode] || 'USD'
