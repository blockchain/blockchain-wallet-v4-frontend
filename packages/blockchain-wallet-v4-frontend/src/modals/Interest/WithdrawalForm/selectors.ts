import BigNumber from 'bignumber.js'
import { lift } from 'ramda'

import { selectors } from 'data'

const getData = (state) => {
  const coin = selectors.components.interest.getCoinType(state)
  const displayCoin = selectors.components.interest.getIsAmountDisplayedInCrypto(state)
  const accountBalancesR = selectors.components.interest.getPassiveRewardsAccountBalance(state)
  const ratesR = selectors.components.interest.getRates(state)
  const withdrawalMinimumsR = selectors.components.interest.getWithdrawalMinimums(state)
  const interestLimitsR = selectors.components.interest.getInterestLimits(state)
  const earnEDDStatusR = selectors.components.interest.getEarnEDDStatus(state)
  const earnEDDWithdrawLimitsR = selectors.components.interest.getEarnEDDWithdrawLimits(state)

  const flagEDDInterestFileUpload = selectors.core.walletOptions
    .getEDDInterestFileUpload(state)
    .getOrElse(false)

  return lift(
    (
      accountBalances,
      interestLimits,
      rates,
      withdrawalMinimums,
      earnEDDStatus,
      earnEDDWithdrawLimits
    ) => ({
      accountBalances,
      availToWithdraw: new BigNumber(Number(accountBalances[coin].balance)).minus(
        accountBalances[coin].locked
      ),
      coin,
      displayCoin,
      earnEDDStatus,
      earnEDDWithdrawLimits,
      flagEDDInterestFileUpload,
      interestLimits,
      rates,
      withdrawalMinimums
    })
  )(
    accountBalancesR,
    interestLimitsR,
    ratesR,
    withdrawalMinimumsR,
    earnEDDStatusR,
    earnEDDWithdrawLimitsR
  )
}

export default getData
