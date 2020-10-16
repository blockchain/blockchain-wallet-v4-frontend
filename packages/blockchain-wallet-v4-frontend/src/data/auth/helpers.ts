const COUNTRIES_CURRENCIES = {
  currency: {
    AD: 'EUR',
    AT: 'EUR',
    BE: 'EUR',
    CA: 'CAD',
    DK: 'DKK',
    FO: 'DKK',
    FI: 'EUR',
    FR: 'EUR',
    GF: 'EUR',
    TF: 'EUR',
    DE: 'EUR',
    GR: 'EUR',
    GL: 'DKK',
    GP: 'EUR',
    VA: 'EUR',
    IE: 'EUR',
    IT: 'EUR',
    LU: 'EUR',
    MQ: 'EUR',
    YT: 'EUR',
    MC: 'EUR',
    NL: 'EUR',
    PL: 'PLN',
    PT: 'EUR',
    RE: 'EUR',
    PM: 'EUR',
    SM: 'EUR',
    CS: 'EUR',
    ES: 'EUR',
    SE: 'SEK',
    GB: 'GBP'
  }
}

export const getCurrencyBasedOnCountry = (countryCode: string) =>
  COUNTRIES_CURRENCIES.currency[countryCode] || 'USD'
