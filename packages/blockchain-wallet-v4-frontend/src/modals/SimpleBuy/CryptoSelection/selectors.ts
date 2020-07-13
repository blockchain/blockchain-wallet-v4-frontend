import { lift } from 'ramda'
import { selectors } from 'data'

export const getData = state => {
  const eligibilityR = selectors.components.simpleBuy.getSBFiatEligible(state)
  const pairsR = selectors.components.simpleBuy.getSBPairs(state)
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)

  const bchRatesR = selectors.core.data.bch.getRates(state)
  const btcRatesR = selectors.core.data.btc.getRates(state)
  const ethRatesR = selectors.core.data.eth.getRates(state)
  const paxRatesR = selectors.core.data.eth.getErc20Rates(state, 'pax')
  const usdtRatesR = selectors.core.data.eth.getErc20Rates(state, 'usdt')
  const xlmRatesR = selectors.core.data.xlm.getRates(state)
  const algoRatesR = selectors.core.data.algo.getRates(state)

  const ratesR = lift(
    (
      bchRates,
      btcRates,
      ethRates,
      paxRates,
      xlmRates,
      usdtRates,
      algoRates
    ) => ({
      BCH: bchRates,
      BTC: btcRates,
      ETH: ethRates,
      PAX: paxRates,
      XLM: xlmRates,
      USDT: usdtRates,
      ALGO: algoRates
    })
  )(
    bchRatesR,
    btcRatesR,
    ethRatesR,
    paxRatesR,
    xlmRatesR,
    usdtRatesR,
    algoRatesR
  )

  return lift((eligibility, pairs, supportedCoins, rates) => ({
    eligibility,
    pairs,
    supportedCoins,
    rates
  }))(eligibilityR, pairsR, supportedCoinsR, ratesR)
}
