import { createDeepEqualSelector } from 'services/ReselectHelper'
import { getCurrentPairAmounts } from '../selectors'
import { model, selectors } from 'data'
import { pathOr, prop, propOr } from 'ramda'

const { getSourceFee } = selectors.components.exchange
const { EXCHANGE_FORM } = model.components.exchange

export const getData = createDeepEqualSelector(
  [
    getSourceFee,
    getCurrentPairAmounts,
    selectors.form.getFormValues(EXCHANGE_FORM),
    state => state
  ],
  (sourceFee, amountsR, formValues, state) => {
    const sourceCoinModel = selectors.core.walletOptions
      .getCoinModel(state, pathOr('', ['source', 'coin'], formValues))
      .getOrElse('')
    const targetCoinModel = selectors.core.walletOptions
      .getCoinModel(state, pathOr('', ['target', 'coin'], formValues))
      .getOrElse('')

    return {
      sourceFee,
      sourceFeeFiat: propOr(0, 'sourceFiat', sourceFee),
      sourceFiat: amountsR.map(prop('sourceFiat')),
      sourceCoinTicker: prop('coinTicker', sourceCoinModel),
      sourceAmount: amountsR.map(prop('sourceAmount')),
      targetAmount: amountsR.map(prop('targetAmount')),
      targetCoinTicker: prop('coinTicker', targetCoinModel),
      targetFiat: amountsR.map(prop('targetFiat')),
      insufficientEthBalance: propOr(false, 'insufficientEthBalance', sourceFee)
    }
  }
)
