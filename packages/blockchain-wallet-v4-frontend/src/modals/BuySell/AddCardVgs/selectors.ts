import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const walletHelperDomainR = selectors.core.walletOptions.getWalletHelperDomain(state)
  const fiatCurrencyR = selectors.modules.profile.getTradingCurrency(state)
  const appEnvR = selectors.core.walletOptions.getAppEnv(state)
  const userDataR = selectors.modules.profile.getUserData(state)
  const cryptoCurrency = selectors.components.buySell.getCryptoCurrency(state)
  const pair = selectors.components.buySell.getBSPair(state)

  return lift(
    (
      appEnv: ExtractSuccess<typeof appEnvR>,
      fiatCurrency: ExtractSuccess<typeof fiatCurrencyR>,
      userData: ExtractSuccess<typeof userDataR>,
      walletHelperDomain: ExtractSuccess<typeof walletHelperDomainR>
    ) => ({
      appEnv,
      cryptoCurrency,
      fiatCurrency,
      pair,
      userData,
      walletHelperDomain
    })
  )(appEnvR, fiatCurrencyR, userDataR, walletHelperDomainR)
}
