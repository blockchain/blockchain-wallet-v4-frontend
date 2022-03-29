import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { getCoinsSortedByBalance } from 'components/Balances/selectors'

export const getData = (state) => {
  const coinsR = getCoinsSortedByBalance(state)

  const transform = (coins: ExtractSuccess<typeof coinsR>) => {
    return coins
      .filter((coinfig) => {
        const { products } = coinfig
        return (
          (products.includes('PrivateKey') ||
            products.includes('CustodialWalletBalance') ||
            // TODO: SELF_CUSTODY
            coinfig.symbol === 'STX') &&
          coinfig.type.name !== 'FIAT'
        )
      })
      .map((coinfig) => ({ text: coinfig.name, value: coinfig.symbol }))
  }

  return lift(transform)(coinsR)
}

export default getData
