import { curry, prop, path } from 'ramda'

import { selectors, model } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'

const { formatPair } = model.rates

const getCurrentPairRates = (state, { sourceCoin, targetCoin }) =>
  selectors.components.exchange.getRates(
    formatPair(sourceCoin, targetCoin),
    state
  )

const fallbackToBestRates = (adviceRatesR, bestRatesR) =>
  adviceRatesR.cata({
    Success: () => adviceRatesR,
    Failure: () => bestRatesR,
    Loading: () => adviceRatesR,
    NotAsked: () => bestRatesR
  })

const formatBestRates = curry(
  (sourceCoin, targetCoin, currency, bestRates) => ({
    sourceToTargetRate: path(
      [formatPair(sourceCoin, targetCoin), 'price'],
      bestRates
    ),
    sourceToFiatRate: path(
      [formatPair(sourceCoin, currency), 'price'],
      bestRates
    ),
    targetToFiatRate: path(
      [formatPair(targetCoin, currency), 'price'],
      bestRates
    )
  })
)

export const getData = createDeepEqualSelector(
  [
    getCurrentPairRates,
    selectors.modules.rates.getBestRates,
    (state, ownProps) => ownProps
  ],
  (adviceRatesR, bestRatesR, { currency, sourceCoin, targetCoin }) => {
    const ratesR = fallbackToBestRates(
      adviceRatesR,
      bestRatesR.map(formatBestRates(sourceCoin, targetCoin, currency))
    )
    return {
      sourceToTargetRate: ratesR.map(prop('sourceToTargetRate')),
      sourceToFiatRate: ratesR.map(prop('sourceToFiatRate')),
      targetToFiatRate: ratesR.map(prop('targetToFiatRate'))
    }
  }
)
