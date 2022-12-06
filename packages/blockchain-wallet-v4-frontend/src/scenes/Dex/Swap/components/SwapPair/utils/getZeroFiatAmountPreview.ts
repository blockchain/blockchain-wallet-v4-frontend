import Currencies, { FiatCurrenciesType } from '@core/exchange/currencies'

export const getZeroFiatAmountPreview = (walletCurrency: string) => {
  return `${
    Currencies[walletCurrency as keyof FiatCurrenciesType].units[
      walletCurrency as keyof FiatCurrenciesType
    ].symbol
  }0.00`
}
