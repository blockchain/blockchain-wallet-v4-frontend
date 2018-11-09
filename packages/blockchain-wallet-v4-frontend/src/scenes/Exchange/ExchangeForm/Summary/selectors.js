import { prop } from 'ramda'

import { Remote } from 'blockchain-wallet-v4'
import { createDeepEqualSelector } from 'services/ReselectHelper'
import { model, selectors } from 'data'

const { formatPair } = model.rates

const { getSourceFee, getAmounts } = selectors.components.exchange

const getCurrentPairAmounts = (state, { sourceCoin, targetCoin }) =>
  getAmounts(formatPair(sourceCoin, targetCoin), state)

const nullAmounts = {
  sourceAmount: 0,
  targetAmount: 0,
  sourceFiat: 0,
  targetFiat: 0
}

const fallbackToNullAmounts = adviceAmountsR =>
  adviceAmountsR.cata({
    Success: () => adviceAmountsR,
    Failure: () => Remote.of(nullAmounts),
    Loading: () => adviceAmountsR,
    NotAsked: () => Remote.of(nullAmounts)
  })

export const getData = createDeepEqualSelector(
  [getSourceFee, getCurrentPairAmounts],
  (sourceFee, adviceAmountsR) => {
    const amountsR = fallbackToNullAmounts(adviceAmountsR)
    return {
      sourceFee,
      sourceAmount: amountsR.map(prop('sourceAmount')),
      targetAmount: amountsR.map(prop('targetAmount')),
      targetFiat: amountsR.map(prop('targetFiat'))
    }
  }
)
