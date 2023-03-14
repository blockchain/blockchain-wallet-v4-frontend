import BigNumber from 'bignumber.js'
import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
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
  const buySellAccountBalancesR = selectors.components.buySell.getBSBalances(state)

  const flagEDDInterestFileUpload = selectors.core.walletOptions
    .getEDDInterestFileUpload(state)
    .getOrElse(false)

  return lift(
    (
      accountBalances: ExtractSuccess<typeof accountBalancesR>,
      buySellAccountBalances: ExtractSuccess<typeof buySellAccountBalancesR>,
      earnEDDStatus: ExtractSuccess<typeof earnEDDStatusR>,
      earnEDDWithdrawLimits: ExtractSuccess<typeof earnEDDWithdrawLimitsR>,
      interestLimits: ExtractSuccess<typeof interestLimitsR>,
      rates: ExtractSuccess<typeof ratesR>,
      withdrawalMinimums: ExtractSuccess<typeof withdrawalMinimumsR>
    ) => ({
      accountBalances,
      availToWithdraw: new BigNumber(Number(accountBalances[coin]?.balance)).minus(
        accountBalances[coin]?.locked || '0'
      ),
      buySellBalance: buySellAccountBalances[coin]?.available || '0',
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
    buySellAccountBalancesR,
    earnEDDStatusR,
    earnEDDWithdrawLimitsR,
    interestLimitsR,
    ratesR,
    withdrawalMinimumsR
  )
}

export default getData
