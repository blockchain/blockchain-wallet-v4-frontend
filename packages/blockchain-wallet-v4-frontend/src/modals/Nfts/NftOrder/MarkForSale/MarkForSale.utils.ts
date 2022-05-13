import { convertCoinToFiat, convertFiatToCoin } from '@core/exchange'
import { RatesType } from '@core/types'

import { NftMarkForSaleFormValues } from './MarkForSale.types'

export const getQuoteAmts = (
  formValues: NftMarkForSaleFormValues,
  rates: RatesType,
  coin: string,
  currency
) => {
  const { ending, fix, fixAmount, reserve, starting } = formValues

  const fixCryptoAmt =
    fix === 'FIAT'
      ? convertFiatToCoin({
          coin,
          currency,
          maxPrecision: 8,
          rates,
          value: fixAmount
        })
      : fixAmount
  const fixFiatAmt =
    fix === 'CRYPTO'
      ? convertCoinToFiat({
          coin,
          currency,
          isStandard: true,
          rates,
          value: fixAmount || 0
        })
      : fixAmount

  const startingCryptoAmt =
    fix === 'FIAT'
      ? convertFiatToCoin({
          coin,
          currency,
          maxPrecision: 8,
          rates,
          value: starting
        })
      : starting
  const startingFiatAmt =
    fix === 'CRYPTO'
      ? convertCoinToFiat({
          coin,
          currency,
          isStandard: true,
          rates,
          value: starting || 0
        })
      : starting

  const endingCryptoAmt =
    fix === 'FIAT'
      ? convertFiatToCoin({
          coin,
          currency,
          maxPrecision: 8,
          rates,
          value: ending
        })
      : ending
  const endingFiatAmt =
    fix === 'CRYPTO'
      ? convertCoinToFiat({
          coin,
          currency,
          isStandard: true,
          rates,
          value: ending || 0
        })
      : ending

  const reserveCryptoAmt =
    fix === 'FIAT'
      ? convertFiatToCoin({
          coin,
          currency,
          maxPrecision: 8,
          rates,
          value: reserve
        })
      : reserve
  const reserveFiatAmt =
    fix === 'CRYPTO'
      ? convertCoinToFiat({
          coin,
          currency,
          isStandard: true,
          rates,
          value: reserve || 0
        })
      : reserve

  return {
    endingCryptoAmt,
    endingFiatAmt,
    fixCryptoAmt,
    fixFiatAmt,
    reserveCryptoAmt,
    reserveFiatAmt,
    startingCryptoAmt,
    startingFiatAmt
  }
}
