import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'

export const getData = (state) => {
  const coinsR = selectors.balances.getTotalWalletBalancesSorted(state)

  const transform = (coins: ExtractSuccess<typeof coinsR>) => {
    return coins
      .filter((coinfig) => {
        const { products } = coinfig
        return (
          (products.includes('PrivateKey') ||
            products.includes('CustodialWalletBalance') ||
            products.includes('DynamicSelfCustody')) &&
          coinfig.type.name !== 'FIAT'
        )
      })
      .map((coinfig) => ({ text: coinfig.name, value: coinfig.symbol }))
  }

  return lift(transform)(coinsR)
}

export default getData
