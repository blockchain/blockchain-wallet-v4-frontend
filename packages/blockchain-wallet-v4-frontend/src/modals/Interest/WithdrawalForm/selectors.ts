import BigNumber from 'bignumber.js'
import { lift } from 'ramda'

import { selectors } from 'data'

const getData = (state) => {
  const coin = selectors.components.interest.getCoinType(state)
  const displayCoin = selectors.components.interest.getCoinDisplay(state)
  const accountBalancesR = selectors.components.interest.getInterestAccountBalance(state)
  const ratesR = selectors.components.interest.getRates(state)
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)
  const withdrawalMinimumsR = selectors.components.interest.getWithdrawalMinimums(state)
  const interestLimitsR = selectors.components.interest.getInterestLimits(state)
  const interestEDDStatusR = selectors.components.interest.getInterestEDDStatus(state)
  const interestEDDWithdrawLimitsR = selectors.components.interest.getInterestEDDWithdrawLimits(
    state
  )

  return lift(
    (
      accountBalances,
      interestLimits,
      rates,
      supportedCoins,
      withdrawalMinimums,
      interestEDDStatus,
      interestEDDWithdrawLimits
    ) => ({
      accountBalances,
      availToWithdraw: new BigNumber(Number(accountBalances[coin].balance)).minus(
        accountBalances[coin].locked
      ),
      coin,
      displayCoin,
      interestEDDStatus,
      interestEDDWithdrawLimits,
      interestLimits,
      rates,
      supportedCoins,
      withdrawalMinimums,
    })
  )(
    accountBalancesR,
    interestLimitsR,
    ratesR,
    supportedCoinsR,
    withdrawalMinimumsR,
    interestEDDStatusR,
    interestEDDWithdrawLimitsR
  )
}

export default getData
