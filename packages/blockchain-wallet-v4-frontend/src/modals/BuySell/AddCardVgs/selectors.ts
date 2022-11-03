import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const walletHelperDomainR = selectors.core.walletOptions.getWalletHelperDomain(state)
  const fiatCurrencyR = selectors.modules.profile.getTradingCurrency(state)

  const cryptoCurrency = selectors.components.buySell.getCryptoCurrency(state)
  const pair = selectors.components.buySell.getBSPair(state)

  return lift(
    (
      fiatCurrency: ExtractSuccess<typeof fiatCurrencyR>,
      walletHelperDomain: ExtractSuccess<typeof walletHelperDomainR>
    ) => ({
      cryptoCurrency,
      fiatCurrency,
      pair,
      walletHelperDomain
    })
  )(fiatCurrencyR, walletHelperDomainR)
}
