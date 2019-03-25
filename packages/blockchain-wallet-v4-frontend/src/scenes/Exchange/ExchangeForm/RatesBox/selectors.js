import { curry, prop, path, lift } from 'ramda'

import { selectors, model } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'
import { Exchange } from 'blockchain-wallet-v4/src'
import { formatFiat } from 'blockchain-wallet-v4/src/exchange/currency'

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

const transformBalanceMax = curry((currency, limits, rates) => {
  const balanceMax = path([currency, 'balanceMax'], limits)
  const sourceToFiatRate = prop('sourceToFiatRate', rates)
  const symbol = Exchange.getSymbol(currency)
  const maxFiat = formatFiat(prop('amount', balanceMax) * sourceToFiatRate)
  return {
    balanceMax,
    balanceMaxFiat: symbol + maxFiat
  }
})

export const getData = createDeepEqualSelector(
  [
    getCurrentPairRates,
    selectors.modules.rates.getBestRates,
    selectors.components.exchange.getLimits,
    (state, ownProps) => ownProps
  ],
  (adviceRatesR, bestRatesR, limitsR, { currency, sourceCoin, targetCoin }) => {
    const ratesR = fallbackToBestRates(
      adviceRatesR,
      bestRatesR.map(formatBestRates(sourceCoin, targetCoin, currency))
    )
    return {
      balance: lift(transformBalanceMax(currency))(limitsR, ratesR),
      sourceToTargetRate: ratesR.map(prop('sourceToTargetRate'))
    }
  }
)
