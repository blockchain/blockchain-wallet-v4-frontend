import { ExtractSuccess } from 'core/types'
import { getCoinFromPair } from 'data/components/simpleBuy/model'
import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'

import { OwnProps } from '.'
import { selectors } from 'data'

export const getData = (state: RootState, ownProps: OwnProps) => {
  const coin = getCoinFromPair(ownProps.value.pair)
  const ratesR = selectors.core.data.misc.getRatesSelector(coin, state)
  const fiatCurrency = selectors.components.simpleBuy.getFiatCurrency(state)
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)

  return lift(
    (
      rates: ExtractSuccess<typeof ratesR>,
      supportedCoins: ExtractSuccess<typeof supportedCoinsR>
    ) => ({
      fiatCurrency,
      rates,
      supportedCoins
    })
  )(ratesR, supportedCoinsR)
}
