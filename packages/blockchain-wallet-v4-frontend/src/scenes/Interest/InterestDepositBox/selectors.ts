// import { CoinType } from 'core/types'
import { lift } from 'ramda'
import { selectors } from 'data'

// const getRatesSelector = (coin: CoinType, state) => {
//   switch (coin) {
//     case 'BTC':
//       return selectors.core.data.btc.getRates(state)
//     case 'BCH':
//       return selectors.core.data.bch.getRates(state)
//     case 'ETH':
//       return selectors.core.data.eth.getRates(state)
//     case 'XLM':
//       return selectors.core.data.xlm.getRates(state)
//     case 'PAX':
//       return selectors.core.data.eth.getErc20Rates(state, 'pax')
//   }

export const getData = state => {
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)
  const interestAccountBalanceR = selectors.components.interest.getInterestAccountBalance(
    state
  )
  const interestEligibleR = selectors.components.interest.getInterestEligible(
    state
  )
  const interestRateR = selectors.components.interest.getInterestRate(state)
  // const ratesR = getRatesSelector(coin, state)

  const transform = (
    supportedCoins,
    interestAccountBalance,
    interestEligible,
    interestRate
    // rates
  ) => ({
    supportedCoins,
    interestAccountBalance,
    interestEligible,
    interestRate
    // rates
  })

  return lift(transform)(
    supportedCoinsR,
    interestAccountBalanceR,
    interestEligibleR,
    interestRateR
    // ratesR
  )
}
