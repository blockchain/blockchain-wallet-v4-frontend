import { lift } from 'ramda'

import { ExtractSuccess, SBPaymentTypes } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

import { OwnProps } from '.'

const getData = (state: RootState, ownProps: OwnProps) => {
  const coin = selectors.components.simpleBuy.getCryptoCurrency(state) || 'BTC'
  const formErrors = selectors.form.getFormSyncErrors('simpleBuyCheckout')(state)
  // used for sell only now, eventually buy as well
  // TODO: use swap2 quote for buy AND sell
  const paymentR = selectors.components.simpleBuy.getPayment(state)
  const quoteR =
    ownProps.orderType === 'BUY'
      ? selectors.components.simpleBuy.getSBQuote(state)
      : selectors.components.simpleBuy.getSellQuote(state)
  const ratesR = selectors.core.data.misc.getRatesSelector(coin, state)
  const sbBalancesR = selectors.components.simpleBuy.getSBBalances(state)
  const userDataR = selectors.modules.profile.getUserData(state)
  const sddEligibleR = selectors.components.simpleBuy.getSddEligible(state)
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)
  const userSDDTierR = selectors.components.simpleBuy.getUserSddEligibleTier(state)
  const sddLimitR = selectors.components.simpleBuy.getUserLimit(state, SBPaymentTypes.PAYMENT_CARD)
  const cardsR = selectors.components.simpleBuy.getSBCards(state) || []
  const bankTransferAccounts = selectors.components.brokerage
    .getBankTransferAccounts(state)
    .getOrElse([])
  const limitsR = selectors.components.simpleBuy.getLimits(state)
  const hasFiatBalance = selectors.components.simpleBuy.hasFiatBalances(state)

  return lift(
    (
      cards: ExtractSuccess<typeof cardsR>,
      quote: ExtractSuccess<typeof quoteR>,
      rates: ExtractSuccess<typeof ratesR>,
      sbBalances: ExtractSuccess<typeof sbBalancesR>,
      userData: ExtractSuccess<typeof userDataR>,
      sddEligible: ExtractSuccess<typeof sddEligibleR>,
      sddLimit: ExtractSuccess<typeof sddLimitR>,
      supportedCoins: ExtractSuccess<typeof supportedCoinsR>,
      userSDDTier: ExtractSuccess<typeof userSDDTierR>
    ) => ({
      bankTransferAccounts,
      cards,
      coinModel: supportedCoins[coin],
      formErrors,
      hasFiatBalance,
      hasPaymentAccount: hasFiatBalance || cards.length > 0 || bankTransferAccounts.length > 0,
      isSddFlow: sddEligible.eligible || userSDDTier === 3,
      limits: limitsR.getOrElse(undefined),
      payment: paymentR.getOrElse(undefined),
      quote,
      rates,
      sbBalances,
      sddEligible,
      sddLimit,
      supportedCoins,
      userData
    })
  )(
    cardsR,
    quoteR,
    ratesR,
    sbBalancesR,
    userDataR,
    sddEligibleR,
    sddLimitR,
    supportedCoinsR,
    userSDDTierR
  )
}

export default getData
