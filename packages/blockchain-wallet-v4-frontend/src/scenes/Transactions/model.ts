import * as Currency from 'blockchain-wallet-v4/src/exchange/currency'

export const buildPercentageChange = (
  currencySymbol,
  priceChangeFiat,
  priceChangePercentage
) => {
  let priceFormatted
  if (priceChangeFiat < 0) {
    priceFormatted = `-${currencySymbol}${Currency.formatFiat(
      priceChangeFiat
    ).substring(1)}`
  } else {
    priceFormatted = currencySymbol + Currency.formatFiat(priceChangeFiat)
  }
  return `${priceFormatted} (${Currency.formatFiat(priceChangePercentage)}%)`
}
