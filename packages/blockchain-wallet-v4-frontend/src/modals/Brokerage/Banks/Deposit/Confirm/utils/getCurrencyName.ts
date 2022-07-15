import { FiatType } from '@core/types'

export const getCurrencyName = (currency?: FiatType): string | null => {
  if (!currency) return null

  const coin = window.coins[currency]

  if (!coin) return currency

  return coin.coinfig.name
}
